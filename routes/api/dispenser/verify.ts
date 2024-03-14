import { Handlers } from "$fresh/server.ts";
import { z } from "zod";

import { verify } from "~utils/verify.ts";
import { errorHandler } from "~utils/errorHandler.ts";

const PostVerifyRequestBody = z.object({
  token: z.string(),
});

type PostVerifyRequestBody = z.infer<typeof PostVerifyRequestBody>;

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      const body = await req.json();
      const { token } = PostVerifyRequestBody.parse(body);
      const [header, payload, signature] = token.split(".");

      const isVerified = await verify([header, payload].join("."), signature);

      return new Response(JSON.stringify({ isVerified }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return errorHandler(error);
    }
  },
};
