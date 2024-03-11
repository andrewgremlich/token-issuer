import { Handlers } from "$fresh/server.ts";

import { verify } from "~utils/apiKey.ts";

interface PostVerifyRequestBody {
  token: string;
}

export const handler: Handlers = {
  async POST(req, _ctx) {
    const { token } = (await req.json()) as PostVerifyRequestBody;
    const [header, payload, signature] = token.split(".");

    const isVerified = await verify([header, payload].join("."), signature);

    return new Response(JSON.stringify({ isVerified }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
