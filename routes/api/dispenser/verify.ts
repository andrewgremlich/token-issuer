import { Handlers } from "$fresh/server.ts";
import { z } from "zod";
import { decodeBase64Url } from "base64UrlEncode";

import { sign, verify } from "~utils/verify.ts";
import { errorHandler } from "~utils/errorHandler.ts";
import { TokenUseError } from "~utils/errorHandler.ts";

import { JWTPayload } from "./issue.ts";

const PostVerifyRequestBody = z.object({
  token: z.string(),
});

type PostVerifyRequestBody = z.infer<typeof PostVerifyRequestBody>;

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      // TODO: Count use on authorization header
      // const auth = await req.headers.get("Authorization");

      const body = await req.json();
      const { token } = PostVerifyRequestBody.parse(body);
      const [header, payload, signature] = token.split(".");
      const isVerified = await verify([header, payload].join("."), signature);
      const decodedParsedPayload: JWTPayload = JSON.parse(
        new TextDecoder().decode(decodeBase64Url(payload)),
      );
      const now = Temporal.Now.instant().epochSeconds;

      console.log(decodedParsedPayload);

      if (decodedParsedPayload.exp < now) {
        throw new TokenUseError("Token has expired");
      }

      if (decodedParsedPayload.nbf && decodedParsedPayload.nbf > now) {
        throw new TokenUseError("Token cannot be used yet");
      }

      // TODO: store the used token in DB and check if it's already used

      if (decodedParsedPayload.numberOfTokens === 0) {
        throw new TokenUseError("Tokens have been used");
      }

      if (decodedParsedPayload.numberOfTokens) {
        decodedParsedPayload.numberOfTokens -= 1;
        const token = await sign(decodedParsedPayload);

        return new Response(JSON.stringify({ isVerified, token }), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

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
