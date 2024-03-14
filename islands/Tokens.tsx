import { useRef } from "preact/hooks";
import { FiUpload } from "@react-icons/fi";

export const Tokens = () => {
  const form = useRef(null);

  const getTokens = async (evt: Event) => {
    evt.preventDefault();

    if (!localStorage["apiKey"]) {
      return;
    }
    const apiKey = localStorage["apiKey"];
    const formElement = form.current;

    if (!formElement) {
      return;
    }

    const formData = new FormData(formElement);
    const numberOfTokens = formData.get("numberOfTokens");
    const separateTokens = formData.get("separateTokens") === "on"
      ? true
      : false;

    const response = await fetch("/api/dispenser/issue", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      method: "POST",
      body: JSON.stringify({
        numberOfTokens: Number(numberOfTokens),
        separateTokens,
      }),
    });
    const data = await response.json();

    localStorage["tokens"] = JSON.stringify(data.tokens);
  };

  return (
    <div>
      <h2>Token Issuer</h2>

      <form ref={form}>
        <label htmlFor="numberOfTokens">
          Number of Tokens:<input
            type="number"
            id="numberOfTokens"
            name="numberOfTokens"
          />
        </label>

        <label htmlFor="separateTokens">
          Separate Tokens:{" "}
          <input type="checkbox" id="separateTokens" name="separateTokens" />
        </label>

        <button type="submit" onClick={getTokens}>
          <FiUpload size={20} />
        </button>
      </form>
    </div>
  );
};
