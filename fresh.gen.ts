// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_auth_token from "./routes/api/auth/token.ts";
import * as $api_auth_verify from "./routes/api/auth/verify.ts";
import * as $api_dispenser_issue from "./routes/api/dispenser/issue.ts";
import * as $api_dispenser_verify from "./routes/api/dispenser/verify.ts";
import * as $api_joke from "./routes/api/joke.ts";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $Counter from "./islands/Counter.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/auth/token.ts": $api_auth_token,
    "./routes/api/auth/verify.ts": $api_auth_verify,
    "./routes/api/dispenser/issue.ts": $api_dispenser_issue,
    "./routes/api/dispenser/verify.ts": $api_dispenser_verify,
    "./routes/api/joke.ts": $api_joke,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
