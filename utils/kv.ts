import { TokenRequirements } from "../routes/api/auth/token.ts";

const kv = await Deno.openKv();

export const getTokenRequirements = async (
  { username, password }: TokenRequirements,
) => {
  return await kv.get([username, password]);
};

export const setTokenRequirements = async (
  { username, password }: TokenRequirements,
  apiToken: string,
) => {
  await kv.set([username, password], apiToken);
};
