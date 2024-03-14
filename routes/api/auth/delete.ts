import { Handlers } from "$fresh/server.ts";
import { z } from "zod";

import { errorHandler } from "~utils/errorHandler.ts";
import { removeRegister } from "~utils/kv.ts";

export const DeleteParams = z.object({
  username: z.string(),
});

export type DeleteParams = z.infer<typeof DeleteParams>;

export const handler: Handlers = {
  async DELETE(req, _ctx) {
    try {
      const rawbody = await req.json();
      const { username } = DeleteParams.parse(rawbody);
      // TODO: the exisiting user's password should be double checked before deleting
      await removeRegister(username);

      return new Response(JSON.stringify({ "hello": username }), {
        headers: {
          "Content-Type": "application/json",
          "Authorization": ``,
        },
      });
    } catch (error) {
      return errorHandler(error);
    }
  },
};
