import { Register } from "../islands/Register.tsx";
import { Tokens } from "../islands/Tokens.tsx";

export default function Home() {
  return (
    <main>
      <h1>Token Issuer</h1>

      <Register />
      <Tokens />
    </main>
  );
}
