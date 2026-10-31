import { useState, type ChangeEvent, type FormEvent } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const MIN_AGE = 18;
const MAX_AGE = 120;

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
  const [ageError, setAgeError] = useState(""); // saved message; replaces ageTouched

  // Returns an error message, or "" if the age is fine. Called on blur and on submit.
  const checkAge = (): string => {
    if (form.age === "") return "";

    const age = Number(form.age);
    if (age < MIN_AGE)
      return `You must be at least ${MIN_AGE} years old to register.`;
    if (age > MAX_AGE) return "Please enter a valid age.";
    return "";
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "age") setAgeError(""); // hide the message while the user types
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = checkAge();
    if (error) {
      setAgeError(error); // show it and stop
      return;
    }

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
      setAgeError("");
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
            placeholder=" "
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
            placeholder=" "
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
            placeholder=" "
            value={form.age}
            onChange={handleChange}
            onBlur={() => setAgeError(checkAge())} // validate only when the user leaves the field
            aria-invalid={ageError !== ""}
            required
          />
          {ageError && <span className="field-error">{ageError}</span>}
        </label>

        <label>
          Phone
          <input
            name="phone"
            type="tel"
            placeholder=" "
            value={form.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Address
          <textarea
            name="address"
            rows={3}
            placeholder=" "
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
