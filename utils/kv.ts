type UserStoreValue = {
  usageCount: number;
  expirationDate: number;
  apiKey: string;
  hashedPassword: string;
};

const kv = await Deno.openKv();

export const setKey = async (label: string, key: JsonWebKey) => {
  await kv.set([label], key);
};

export const getKey = async (
  label: string,
): Promise<JsonWebKey | undefined> => {
  const privateKey = await kv.get<JsonWebKey>([label]);

  if (!privateKey.value) {
    console.error(`No key found for ${label}`);
    return;
  }

  return privateKey.value;
};

export const getUser = async (
  username: string,
): Promise<UserStoreValue> => {
  return (await kv.get([username])).value as UserStoreValue;
};

export const setRegister = async (
  username: string,
  tokenRequirements: UserStoreValue,
) => {
  const primaryKey = [username];
  const byApiToken = [tokenRequirements.apiKey];

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

export const removeRegister = async (username: string) => {
  await kv.delete([username]);
};
