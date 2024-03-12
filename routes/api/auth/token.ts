// Provide an Auth Key in order to use 'dispenser' routes
import { Handlers } from "$fresh/server.ts";
import { z } from "zod";

import { errorHandler } from "~utils/errorHandler.ts";
import { getTokenRequirements, setTokenRequirements } from "~utils/kv.ts";

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
      const hasTokenRequirements = getTokenRequirements(body);

      // TODO: an expiration date would be checked
      // TODO: But wait, I could store an API Key and the usage count in KV...
      if (hasTokenRequirements) {
        return new Response(JSON.stringify(hasTokenRequirements), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const tokenRequirements = await setTokenRequirements(body, {
        usageCount: 0,
        expirationDate: new Date(),
        apiToken: Math.random().toString(36).slice(2),
        ...body,
      });

      return new Response(JSON.stringify(tokenRequirements), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return errorHandler(error);
    }
  },
};
