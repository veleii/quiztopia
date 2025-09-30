import { client } from "../../services/db.js";
import { sendResponse } from "../../services/response.js";
import { v4 as uuidv4 } from "uuid";
import { PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { authMiddleware } from "../../services/authMiddleware.js";

async function baseHandler(event) {
  try {
    const { quizId, questionText, answer, latitude, longitude } =
      event.body || {};
    const user = event.user;

    if (!quizId || !questionText || !answer) {
      return sendResponse(400, {
        error: "quizId, questionText and answer are required",
      });
    }

    const getParams = new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk: { S: "QUIZ" },
        sk: { S: `QUIZ#${quizId}` },
      },
    });

    const result = await client.send(getParams);

    if (!result.Item) {
      return sendResponse(404, { error: "Quiz not found" });
    }

    if (result.Item.userId.S !== user.userId) {
      return sendResponse(403, {
        error: "Not authorized to add question to this quiz",
      });
    }

    const questionId = uuidv4();
    const createdAt = new Date().toISOString();

    const params = new PutItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        pk: { S: `QUIZ#${quizId}` },
        sk: { S: `QUESTION#${questionId}` },
        questionId: { S: questionId },
        questionText: { S: questionText },
        answer: { S: answer },
        latitude: { S: latitude || "0" },
        longitude: { S: longitude || "0" },
        createdAt: { S: createdAt },
      },
    });

    await client.send(params);

    return sendResponse(201, {
      message: "Question added",
      quizId,
      questionId,
      questionText,
    });
  } catch (err) {
    console.error("AddQuestion error:", err);
    return sendResponse(500, { error: "Could not add question" });
  }
}

export const handler = middy(baseHandler)
  .use(httpJsonBodyParser())
  .use(authMiddleware());
