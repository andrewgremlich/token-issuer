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

      // encrypt username and password here
      const encryptedData = await encryptData(
        new TextEncoder().encode(JSON.stringify(body)),
      );

      console.log(encryptedData);

      // then store username and password in KV

      // await setTokenRequirements(body, {
      //   usageCount: 0,
      //   expirationDate: new Date(),
      //   apiToken: Math.random().toString(36).slice(2),
      //   ...body,
      // });

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
