import { client } from "../../services/db.js";
import { sendResponse } from "../../services/response.js";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import middy from "@middy/core";
import { authMiddleware } from "../../services/authMiddleware.js";

async function baseHandler(event) {
  try {
    const params = new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": { S: "QUIZ" },
      },
    });

    const result = await client.send(params);
    const quizzes = result.Items.map((item) => ({
      quizId: item.quizId.S,
      title: item.title.S,
      ownerId: item.userId.S,
      createdAt: item.createdAt.S,
    }));

    return sendResponse(200, { quizzes });
  } catch (err) {
    console.error("GetAllQuizzes error:", err);
    return sendResponse(500, { error: "could not fetch quizzes" });
  }
}

export const handler = middy(baseHandler).use(authMiddleware());
