import { client } from "../../services/db.js";
import { sendResponse } from "../../services/response.js";
import { v4 as uuidv4 } from "uuid";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { authMiddleware } from "../../services/authMiddleware.js";

async function baseHandler(event) {
  try {
    const { title } = event.body || {};
    const user = event.user;

    if (!title) {
      return sendResponse(400, { error: "Title is required" });
    }

    const quizId = uuidv4();
    const createdAt = new Date().toISOString();

    const params = new PutItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        pk: { S: `QUIZ` },
        sk: { S: `QUIZ#${quizId}` },
        quizId: { S: quizId },
        userId: { S: user.userId },
        title: { S: title },
        createdAt: { S: createdAt },
      },
    });

    await client.send(params);

    return sendResponse(201, {
      message: "Quiz created",
      quizId,
      owner: user.email,
      createdAt,
    });
  } catch (err) {
    console.error("CreateQuiz error:", err);
    return sendResponse(500, { error: "Could not create quiz" });
  }
}

export const handler = middy(baseHandler)
  .use(httpJsonBodyParser())
  .use(authMiddleware());
