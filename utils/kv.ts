const kv = await Deno.openKv();

export const getTokenRequirements = async (
  apiToken: string,
) => {
  return await kv.get([apiToken]);
};

type TokenRequirementsValue = {
  usageCount: number;
  expirationDate: Date;
  apiToken: string;
  username: string;
  password: string;
};

export const setTokenRequirements = async (
  apiToken: string,
  tokenRequirements: TokenRequirementsValue,
) => {
  await kv.set([apiToken], tokenRequirements);
};
