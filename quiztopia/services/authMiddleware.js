import jwt from "jsonwebtoken";
import { sendResponse } from "./response.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = () => {
  return {
    before: async (request) => {
      const headers = request.event.headers || {};
      const authHeader = headers.Authorization || headers.authorization;

      if (!authHeader) {
        throw new Error("Unauthorized: No Authorization header");
      }

      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        request.event.user = decoded;
      } catch (err) {
        console.error("JWT verification failed", err.message);
        throw new Error("Unauthorized: Invalid token");
      }
    },
    onError: async () => {
      return sendResponse(401, { error: "Unauthorized" });
    },
  };
};
