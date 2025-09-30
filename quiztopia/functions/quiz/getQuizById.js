import { client } from "../../services/db.js";
import { sendResponse } from "../../services/response.js";
import { GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import middy from "@middy/core";
import { authMiddleware } from "../../services/authMiddleware.js";

async function baseHandler(event) {
  try {
    const { quizId } = event.pathParameters || {};
    if (!quizId) {
      return sendResponse(400, { success: false, error: "quizId is required" });
    }

    const getParams = new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk: { S: "QUIZ" },
        sk: { S: `QUIZ#${quizId}` },
      },
    });

    const quizResult = await client.send(getParams);

    if (!quizResult.Item) {
      return sendResponse(404, { success: false, error: "Quiz not found" });
    }

    const quiz = {
      quizId: quizResult.Item.quizId.S,
      userId: quizResult.Item.userId.S,
      title: quizResult.Item.title.S,
    };

    const queryParams = new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": { S: `QUIZ#${quizId}` },
      },
    });

    const questionResult = await client.send(queryParams);

    quiz.questions = (questionResult.Items || []).map((q) => ({
      question: q.questionText.S,
      answer: q.answer.S,
      location: {
        latitude: q.latitude.S,
        longitude: q.longitude.S,
      },
    }));

    return sendResponse(200, { success: true, quiz });
  } catch (err) {
    console.error("getQuizById error:", err);
    return sendResponse(500, { success: false, error: "Could not fetch quiz" });
  }
}

export const handler = middy(baseHandler).use(authMiddleware());
