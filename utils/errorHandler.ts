import { z } from "zod";

export class AuthorizationError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class TokenIssueError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class TokenUseError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export const errorHandler = (
  error: z.ZodError | SyntaxError | AuthorizationError | Error,
) => {
  if (error instanceof z.ZodError) {
    return new Response(
      JSON.stringify({ error: true, message: error.message }),
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
      JSON.stringify({ error: true, message: error.message }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  if (error instanceof AuthorizationError) {
    return new Response(
      JSON.stringify({ error: true, message: error.message }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const DENO_ENV = Deno.env.get("DENO_ENV");

  if (DENO_ENV === "development") {
    return new Response(
      JSON.stringify({
        error: true,
        message: error.message,
      }),
      {
        status: 500,
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
