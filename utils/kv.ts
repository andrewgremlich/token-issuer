import { TokenRequirements } from "../routes/api/auth/token.ts";

const kv = await Deno.openKv();

export const getTokenByUsername = async (
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
  const primaryKey = [username, password];
  const byApiToken = [tokenRequirements.apiToken];

  const res = await kv.atomic()
    .check({ key: primaryKey, versionstamp: null })
    .check({ key: byApiToken, versionstamp: null })
    .set(primaryKey, tokenRequirements)
    .set(byApiToken, tokenRequirements)
    .commit();

  if (!res.ok) {
    throw new TypeError("User with username and password already exists.");
  }
};
