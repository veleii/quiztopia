import jwt from "jsonwebtoken";
import { sendResponse } from "./response.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = () => {
  return {
    before: async (request) => {
      const headers = request.event.headers || {};
      console.log("HEADERS:", headers);

      const authHeader = headers.Authorization || headers.authorization;
      console.log("AUTHHEADER:", authHeader);

      if (!authHeader) {
        throw new Error("Unauthorized: No Authorization header");
      }

      const token = authHeader.split(" ")[1];
      console.log("TOKEN FROM HEADER:", token);

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("DECODED TOKEN:", decoded);
        request.event.user = decoded;
      } catch (err) {
        console.error("JWT verification failed", err);
        throw new Error("Unauthorized: Invalid token");
      }
    },
    onError: async (request) => {
      return sendResponse(401, { error: "Unauthorized" });
    },
  };
};
