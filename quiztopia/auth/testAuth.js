import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { authMiddleware } from "../services/authMiddleware.js";
import { sendResponse } from "../services/response.js";

async function baseHandler(event) {
  // Tack vare authMiddleware finns event.user nu
  return sendResponse(200, {
    message: `Hello ${event.user.email}, du är inloggad!`,
    user: event.user,
  });
}

export const handler = middy(baseHandler)
  .use(httpJsonBodyParser())
  .use(authMiddleware());
