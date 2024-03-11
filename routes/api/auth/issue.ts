import { Handlers } from "$fresh/server.ts";

import { sign } from "~utils/apiKey.ts";

interface PostIssueRequestBody {
  isAuthenticated: boolean;
  numberOfTokens: number;
  expiryDate: {
    year: number;
    month: number;
    day: number;
  };
}

// https://deno.land/x/zod@v3.22.4
// https://github.com/stripe/stripe-node
// https://fresh.deno.dev/docs/examples/creating-a-crud-api

export const handler: Handlers = {
  async POST(req, _ctx) {
    const body = (await req.json()) as PostIssueRequestBody;
    const expiryDate = new Date(
      body.expiryDate.year,
      body.expiryDate.month - 1,
      body.expiryDate.day,
    );
    const payload = {
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(expiryDate.getTime() / 1000),
      iss: "fresh",
    };
    const token = await sign(payload);

    return new Response(JSON.stringify({ token }), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
