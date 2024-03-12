// Provide an Auth Key in order to use 'dispenser' routes
import { Handlers } from "$fresh/server.ts";
import { z } from "zod";

import { errorHandler } from "~utils/errorHandler.ts";
import { setTokenRequirements } from "~utils/kv.ts";
import { encryptData } from "~utils/encryptor.ts";

const TokenRequirements = z.object({
  username: z.string(),
  password: z.string(),
});

export type TokenRequirements = z.infer<typeof TokenRequirements>;

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      const rawbody = await req.json();
      const body = TokenRequirements.parse(rawbody);
      const encryptedData = await encryptData(
        new TextEncoder().encode(JSON.stringify(body)),
      );
      const inFourWeeks = 28 * 24 * 60 * 60;
      const now = Temporal.Now.instant().epochSeconds;

      await setTokenRequirements(encryptedData, {
        usageCount: 0,
        expirationDate: now + inFourWeeks,
        apiToken: Math.random().toString(36).slice(2), // TODO: actually make a token!
      });

      return new Response(JSON.stringify({ "hello": "world" }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return errorHandler(error);
    }
  },
};
