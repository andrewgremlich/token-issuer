import { FreshContext } from "$fresh/server.ts";

import { TokenIssueError } from "~utils/errorHandler.ts";
import { AuthorizationError, errorHandler } from "~utils/errorHandler.ts";

export const handler = [
  async function authMiddleware(req: Request, ctx: FreshContext) {
    try {
      const auth = await req.headers.get("Authorization");

      if (!auth) {
        throw new AuthorizationError("No Authorization header provided.");
      }

      return ctx.next();
    } catch (error) {
      return errorHandler(error);
    }
  },
  async function checkForTokenNumber(req: Request, ctx: FreshContext) {
    try {
      const cloneResponse = req.clone();
      const rawbody = await cloneResponse.json();
      const { numberOfTokens } = rawbody;
      const maxTokensIssued = Deno.env.get("MAX_TOKENS_ISSUED") ?? "0";

      if (numberOfTokens > parseInt(maxTokensIssued)) {
        throw new TokenIssueError(
          `Number of tokens requested exceeds the maximum number of tokens allowed to be issued.`,
        );
      }

      return ctx.next();
    } catch (error) {
      return errorHandler(error);
    }
  },
];
