import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { client } from "../services/db.js";
import { sendResponse } from "../services/response.js";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";

const JWT_SECRET = process.env.JWT_SECRET || "hemlis";

async function baseHandler(event) {
  try {
    const { email, password } = event.body;

    if (!email || !password) {
      return sendResponse(400, { error: "Email and password required" });
    }
    const params = new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE,
      IndexName: "EmailIndex", // lägg till i serverless.yml
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": { S: email },
      },
    });

    const result = await client.send(params);

    if (!result.Items || result.Items.length === 0) {
      return sendResponse(401, { error: "Wrong email or password" });
    }

    const user = result.Items[0];
    const validPassword = await bcrypt.compare(password, user.password.S);

    if (!validPassword) {
      return sendResponse(401, { error: "Wrong password or email" });
    }

    const token = jwt.sign(
      { userId: user.pk.S, email: user.email.S },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return sendResponse(200, { message: "Logged in", token });
  } catch (err) {
    console.error(err);
    return sendResponse(500, { error: "Could not log in" });
  }
}

export const handler = middy(baseHandler).use(httpJsonBodyParser());
