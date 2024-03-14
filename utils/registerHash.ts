import { hash, verify } from "scrypt";

export const genApiKey = (length: number) => {
  // Generate random bytes
  const randomBytes = new Uint8Array(length);
  window.crypto.getRandomValues(randomBytes);

  // Convert bytes to a hexadecimal string
  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const hashPassword = (password: string) => {
  const hashed = hash(password);

  return {
    hashed,
  };
};

export const verifyHash = (
  password: string,
  hashed: string,
) => {
  return verify(password, hashed);
};
