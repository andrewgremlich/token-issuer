import { Handlers } from "$fresh/server.ts";
import { z } from "zod";

import { sign } from "~utils/verify.ts";
import { errorHandler } from "~utils/errorHandler.ts";
import { inFourWeeks } from "~utils/constants.ts";

const PostIssueRequestBody = z.object({
  numberOfTokens: z.number(),
  separateTokens: z.boolean(),
});

type PostIssueRequestBody = z.infer<typeof PostIssueRequestBody>;

export type JWTPayload = {
  iat: number;
  exp: number;
  sub: string;
  aud: string;
  iss: string;
  nbf?: number;
  jti?: string;
  numberOfTokens?: number;
};

// https://deno.land/x/zod@v3.22.4
// https://github.com/stripe/stripe-node
// https://fresh.deno.dev/docs/examples/creating-a-crud-api
// https://fresh.deno.dev/docs/concepts/middleware
// https://jwt.io/introduction/
// https://deno.land/api@v1.41.2?s=Temporal
// https://tc39.es/proposal-temporal/docs/index.html

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      const rawbody = await req.json();
      const { numberOfTokens, separateTokens } = PostIssueRequestBody.parse(
        rawbody,
      );

      const now = Temporal.Now.instant().epochSeconds;

      // public claims https://www.iana.org/assignments/jwt/jwt.xhtml
      const payload: JWTPayload = {
        iat: now,
        exp: now + inFourWeeks,
        sub: "One time use tokens",
        aud: "Audience that wants to use one time use tokens",
        iss: "Token Issuer",
        // nbf: now, // don't use token before...
        // jti: "Unique identifier for the token",
      };

      if (separateTokens) {
        const tokens = [];

        for (const _t of Array.from({ length: numberOfTokens })) {
          const token = await sign(payload);
          tokens.push(token);
        }

        return new Response(JSON.stringify({ tokens }), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      payload.numberOfTokens = numberOfTokens;

      const token = await sign(payload);

      return new Response(JSON.stringify({ token }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return errorHandler(error);
    }
  },
};
