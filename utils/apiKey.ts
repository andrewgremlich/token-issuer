import { decodeBase64Url, encodeBase64Url } from "base64UrlEncode";

const headerOptions = {
  alg: "HMAC",
  typ: "JWT",
};
const JWTHeader = encodeBase64Url(
  JSON.stringify({ ...headerOptions, alg: "HS512" }),
);
const key = await crypto.subtle.generateKey(
  { name: headerOptions.alg, hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

export const sign = async (
  rawpayload: { [key: string]: string | number },
): Promise<string> => {
  const payload = encodeBase64Url(JSON.stringify(rawpayload));
  const hashSigningInput = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${JWTHeader}.${payload}`),
  );
  const rawsignature = await crypto.subtle
    .sign(
      headerOptions.alg,
      key,
      hashSigningInput,
    );
  const signature = encodeBase64Url(
    rawsignature,
  );

  return `${JWTHeader}.${payload}.${signature}`;
};

export const verify = async (
  signingInput: string,
  rawsignature: string,
) => {
  const fromBase64 = decodeBase64Url(rawsignature);
  const hashSigningInput = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(signingInput),
  );

  // return fromBase64;
  const result = await crypto.subtle.verify(
    headerOptions.alg,
    key,
    fromBase64,
    hashSigningInput,
  );

  return result;
};
