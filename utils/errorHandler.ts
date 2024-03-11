import { z } from "zod";

export const errorHandler = (error: z.ZodError | SyntaxError) => {
  if (error instanceof z.ZodError) {
    return new Response(
      JSON.stringify({ error: true, message: "Invalid request." }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  if (error instanceof SyntaxError) {
    return new Response(
      JSON.stringify({ error: true, message: "Invalid JSON." }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  return new Response(
    JSON.stringify({
      error: true,
      message: "Hmm... don't know what happened here...",
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
