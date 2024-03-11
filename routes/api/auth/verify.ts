// Verify an Auth Key in order to use 'dispenser' routes
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    return new Response(JSON.stringify({ message: "Hello, World!" }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};