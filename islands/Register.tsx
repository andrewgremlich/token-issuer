import { FiUpload } from "@react-icons/fi";
import { useRef, useState } from "preact/hooks";

export const Register = () => {
  const form = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const verifyApiKey = async (evt: Event) => {
    evt.preventDefault();
    const formElement = form.current;

    if (!formElement) {
      return;
    }

    if (!localStorage["apiKey"]) {
      return;
    }

    const formData = new FormData(formElement);
    const username = formData.get("username");
    const password = formData.get("password");
    const apiKey = localStorage["apiKey"];

    console.log("RUN verify");

    const response = await fetch("/api/auth/verify", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data = await response.json();
    setIsVerified(data.verified);
  };

  const registerUser = async (evt: Event) => {
    evt.preventDefault();

    const formElement = form.current;

    if (!formElement) {
      return;
    }

    const formData = new FormData(formElement);
    const username = formData.get("username");
    const password = formData.get("password");

    const response = await fetch("/api/auth/register", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data = await response.json();

    console.log(data);

    if (!localStorage["apiKey"]) {
      localStorage.setItem("apiKey", data.apiKey);
      setLoaded(true);

      setTimeout(() => {
        setLoaded(false);
      }, 3000);
    } else {
      console.log("API Key already exists");
    }
  };

  return (
    <form ref={form}>
      <label htmlFor="username">
        Username:<input type="text" id="username" name="username" required />
      </label>

      <label htmlFor="password">
        Password:<input
          type="password"
          id="password"
          name="password"
          required
        />
      </label>

      <button type="submit" onClick={registerUser}>
        <FiUpload size={30} />
      </button>
      {loaded && <p>API Loaded</p>}

      <button onClick={verifyApiKey}>Verify API Key</button>
      {isVerified && <p>API Key Verified</p>}
    </form>
  );
};
