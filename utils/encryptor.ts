import { encodeBase64Url } from "base64UrlEncode";

const key = await window.crypto.subtle.generateKey(
  {
    name: "AES-GCM",
    length: 256,
  },
  true,
  ["encrypt", "decrypt"],
);

export async function encryptData(
  data: ArrayBuffer,
): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const hashIncomingData = await window.crypto.subtle.digest(
    "SHA-256",
    data,
  );
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    hashIncomingData,
  );

  return encodeBase64Url(encryptedData);
}

export async function decryptData(
  encryptedData: ArrayBuffer,
): Promise<ArrayBuffer> {
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
