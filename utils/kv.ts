import { TokenRequirements } from "../routes/api/auth/token.ts";

const kv = await Deno.openKv();

export const getTokenRequirements = async (
  { username, password }: TokenRequirements,
) => {
  return await kv.get([username, password]);
};

type TokenRequirementsValue = {
  usageCount: number;
  expirationDate: Date;
  apiToken: string;
  username: string;
  password: string;
};

export const setTokenRequirements = async (
  { username, password }: TokenRequirements,
  tokenRequirements: TokenRequirementsValue,
) => {
  await kv.set([username, password], tokenRequirements);
};
