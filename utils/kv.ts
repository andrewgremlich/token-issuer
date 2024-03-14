import { TokenRequirements } from "../routes/api/auth/token.ts";

const kv = await Deno.openKv();

export const setKey = async (label: string, key: JsonWebKey) => {
  await kv.set([label], key);
};

export const getKey = async (label: string): Promise<JsonWebKey> => {
  const privateKey = await kv.get<JsonWebKey>([label]);

  if (!privateKey.value) {
    throw new Error("No private key found.");
  }

  return privateKey.value;
};

export const getTokenByUsername = async (
  { username, password }: TokenRequirements,
) => {
  return await kv.get([username, password]);
};

type TokenRequirementsValue = {
  usageCount: number;
  expirationDate: number;
  apiToken: string;
};

export const setTokenRequirements = async (
  userHash: string,
  tokenRequirements: TokenRequirementsValue,
) => {
  const primaryKey = [userHash];
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
