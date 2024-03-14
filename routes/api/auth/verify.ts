import { Handlers } from "$fresh/server.ts";

import { errorHandler } from "~utils/errorHandler.ts";
import { getUser } from "~utils/kv.ts";
import { verifyHash } from "~utils/registerHash.ts";

import { RegisterParams } from "./register.ts";
import { AuthorizationError } from "~utils/errorHandler.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      const rawbody = await req.json();
      const { username, password } = RegisterParams.parse(rawbody);
      const auth = await req.headers.get("Authorization");

      if (!auth) {
        throw new AuthorizationError("No Authorization header provided.");
      }

      const token = auth.split("Bearer ")[1];
      const user = await getUser(username);

      if (user.apiKey !== token) {
        throw new Error("Invalid token.");
      }

      return new Response(
        JSON.stringify({ message: verifyHash(password, user.hashedPassword) }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      return errorHandler(error);
    }
  },
};
