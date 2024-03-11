// Provide an Auth Key in order to use 'dispenser' routes
import { Handlers } from "$fresh/server.ts";
import { z } from "zod";

import { errorHandler } from "~utils/errorHandler.ts";

const User = z.object({
  username: z.string(),
});

type User = z.infer<typeof User>;

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      const body = await req.json();
      const user = User.parse(body);

      // Need to store server key somewhere...Deno KV?
      // An issued API key should be verified against the server key
      // And then an expiration date would be checked

      // But wait, I could store an API Key and the usage count in KV...
      // That way billing could work...

      return new Response(JSON.stringify(user), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return errorHandler(error);
    }
  },
};
