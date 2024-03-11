import { Handlers } from "$fresh/server.ts";
import { z } from "zod";

import { sign } from "~utils/apiKey.ts";
import { errorHandler } from "~utils/errorHandler.ts";

const PostIssueRequestBody = z.object({
  isAuthenticated: z.boolean(),
  numberOfTokens: z.number(),
});

type PostIssueRequestBody = z.infer<typeof PostIssueRequestBody>;

// https://deno.land/x/zod@v3.22.4
// https://github.com/stripe/stripe-node
// https://fresh.deno.dev/docs/examples/creating-a-crud-api
// https://fresh.deno.dev/docs/concepts/middleware

export const handler: Handlers = {
  async POST(_req, _ctx) {
    try {
      // const incomingBody = await req.json();
      const inFourWeeks = 28 * 24 * 60 * 60;
      const now = Temporal.Now.instant().epochSeconds;

      const payload = {
        iat: now,
        exp: now + inFourWeeks,
        iss: "fresh",
      };
      const token = await sign(payload);

      return new Response(JSON.stringify({ token }), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error);
      return errorHandler(error);
    }
  },
};
