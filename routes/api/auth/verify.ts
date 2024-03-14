// Verify an Auth Key in order to use 'dispenser' routes
import { Handlers } from "$fresh/server.ts";
import { errorHandler } from "~utils/errorHandler.ts";

import { decryptData } from "~utils/encryptor.ts";
import { decodeBase64Url } from "base64UrlEncode";

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      const auth = await req.headers.get("Authorization");

      if (!auth) {
        throw new Error("No Authorization header provided.");
      }

      const token = auth.split("Bearer ")[1];
      const tokenDecoded = decodeBase64Url(token);

      console.log(decryptData(tokenDecoded));

      return new Response(JSON.stringify({ message: "Hello, World!" }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return errorHandler(error);
    }
  },
};
