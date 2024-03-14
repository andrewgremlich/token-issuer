import { encodeBase64Url } from "base64UrlEncode";

import { getEncryptKey } from "./keys.ts";

export async function encryptData(
  data: ArrayBuffer,
): Promise<string> {
  const key = await getEncryptKey();
  // uniquely and securely identify the data
  const hasedData = await window.crypto.subtle.digest(
    "SHA-256",
    data,
  );
  // create a random initialization vector for a random pattern
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    hasedData,
  );

  // encodeBase64Url is a custom function that encodes the data in a URL safe way... otherwise there is some weird stuff.
  return encodeBase64Url(encryptedData);
}

export async function decryptData(
  encryptedData: ArrayBuffer,
): Promise<ArrayBuffer> {
  const key = await getEncryptKey();
  const iv = new Uint8Array(encryptedData.slice(0, 12));
  const data = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encryptedData.slice(12),
  );
  return data;
}
