import { client } from "../services/db.js";
import { sendResponse } from "../services/response.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";

async function baseHandler(event) {
  try {
    const { email, password } = event.body;

    if (!email || !password) {
      return sendResponse(400, { error: "Email and password required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const params = new PutItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        pk: { S: `USER#${userId}` },
        sk: { S: `PROFILE#${email}` },
        userId: { S: userId },
        email: { S: email },
        password: { S: hashedPassword },
      },
    });

    await client.send(params);

    return sendResponse(201, { msg: "User created", userId });
  } catch (err) {
    console.error(err);
    return sendResponse(500, { msg: "Could not create user" });
  }
}

export const handler = middy(baseHandler).use(httpJsonBodyParser());
