import { client } from "../../services/db.js";
import { sendResponse } from "../../services/response.js";
import { GetItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import middy from "@middy/core";
import { authMiddleware } from "../../services/authMiddleware.js";

async function baseHandler(event) {
  try {
    const { quizId } = event.pathParameters || {};
    const user = event.user;

    if (!quizId) {
      return sendResponse(400, { error: "quizId is required" });
    }

    // 1. Hämta quizet
    const getParams = new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        // <-- stort K här!
        pk: { S: "QUIZ" },
        sk: { S: `QUIZ#${quizId}` },
      },
    });

    const result = await client.send(getParams);

    if (!result.Item) {
      return sendResponse(404, { error: "Quiz not found" });
    }

    // 2. Kolla att användaren äger quizet
    if (result.Item.userId.S !== user.userId) {
      return sendResponse(403, { error: "Not authorized to delete this quiz" });
    }

    // 3. Ta bort quizet
    const deleteParams = new DeleteItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        // <-- stort K här också!
        pk: { S: "QUIZ" },
        sk: { S: `QUIZ#${quizId}` },
      },
    });

    await client.send(deleteParams);

    return sendResponse(200, {
      msg: "Quiz deleted",
      quizId,
    });
  } catch (err) {
    console.error("DeleteQuiz error:", err);
    return sendResponse(500, {
      error: "Could not delete quiz",
      details: err.message,
    });
  }
}

export const handler = middy(baseHandler).use(authMiddleware());
