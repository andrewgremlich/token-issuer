let key = await window.crypto.subtle.generateKey(
  {
    name: "AES-GCM",
    length: 256,
  },
  true,
  ["encrypt", "decrypt"],
);

export async function encryptData(
  key: CryptoKey,
  data: ArrayBuffer,
): Promise<ArrayBuffer> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    data,
  );

  return encryptedData;
}

// Example usage:
// const dataToEncrypt = new TextEncoder().encode("Hello, World!");
// const encryptedData = await encryptData(key, dataToEncrypt);
// console.log(encryptedData);

export async function decryptData(
  key: CryptoKey,
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
