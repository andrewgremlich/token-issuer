import { getKey, setKey } from "./kv.ts";

const KVEncryptKey = "encryptKey";
const KVSigningKey = "signingKey";

export const getEncryptKey = async () => {
  const storedKey = await getKey(KVEncryptKey);

  if (!storedKey) {
    const generatedKey = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"],
    );
    const exportedKey = await window.crypto.subtle.exportKey(
      "jwk", // jwk is a JSON Web Key. These are only supported and they work well too.
      generatedKey,
    );

    await setKey(KVEncryptKey, exportedKey);

    return generatedKey;
  }

  const fetchedKey = await window.crypto.subtle.importKey(
    "jwk",
    storedKey,
    {
      name: "AES-GCM",
    },
    true,
    ["encrypt", "decrypt"],
  );

  return fetchedKey;
};

export const getSigningKey = async () => {
  const storedKey = await getKey(KVSigningKey);

  if (!storedKey) {
    const generatedKey = await window.crypto.subtle.generateKey(
      {
        name: "HMAC",
        hash: "SHA-512",
      },
      true,
      ["sign", "verify"],
    );
    const exportedKey = await window.crypto.subtle.exportKey(
      "jwk",
      generatedKey,
    );

    await setKey(KVSigningKey, exportedKey);

    return generatedKey;
  }

  const fetchedKey = await window.crypto.subtle.importKey(
    "jwk",
    storedKey,
    {
      name: "HMAC",
      hash: "SHA-512",
    },
    true,
    ["sign", "verify"],
  );

  return fetchedKey;
};
