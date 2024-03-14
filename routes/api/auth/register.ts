import { Handlers } from "$fresh/server.ts";
import { z } from "zod";

import { errorHandler } from "~utils/errorHandler.ts";
import { getUser, setRegister } from "~utils/kv.ts";
import { genApiKey, hashPassword } from "~utils/registerHash.ts";
import { inFourWeeks } from "~utils/constants.ts";

export const RegisterParams = z.object({
  username: z.string(),
  password: z.string(),
});

export type RegisterParams = z.infer<typeof RegisterParams>;

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      const rawbody = await req.json();
      const { username, password } = RegisterParams.parse(rawbody);
      const user = await getUser(username);

      if (user) {
        return new Response(JSON.stringify({ "apiKey": user.apiKey }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const hashAndEncryptPassword = hashPassword(password);
      const now = Temporal.Now.instant().epochSeconds;
      const apiKey = genApiKey(16);

      await setRegister(username, {
        hashedPassword: hashAndEncryptPassword.hashed,
        usageCount: 0,
        expirationDate: now + inFourWeeks,
        apiKey,
      });

      return new Response(JSON.stringify({ "apiKey": apiKey }), {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
      });
    } catch (error) {
      return errorHandler(error);
    }
  },
};
