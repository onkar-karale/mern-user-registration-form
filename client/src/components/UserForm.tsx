import { useState, type ChangeEvent, type FormEvent } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

type FormState = {
  name: string;
  email: string;
  age: string;
  phone: string;
  address: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  age: "",
  phone: "",
  address: "",
};

type Status = "idle" | "loading" | "success" | "error";

const UserForm = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });

      const data = await res.json();

      // fetch only rejects on network failure, so we check HTTP errors ourselves
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      setStatus("success");
      setMessage("Saved to MongoDB Atlas!");
      setForm(initialForm); // clear the form
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Could not reach the server",
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Age
          <input
            name="age"
            type="number"
            min={1}
            max={120}
            value={form.age}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Address
          <textarea
            name="address"
            rows={3}
            value={form.address}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message && <p className={`message ${status}`}>{message}</p>}
    </>
  );
};

export default UserForm;
