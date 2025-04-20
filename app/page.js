"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `https://67f57b0e913986b16fa4b9e7.mockapi.io/users?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error("Failed response");
      }

      const users = await response.json();

      if (users.length === 0) {
        setError("No user found with that email.");
        return;
      }

      const user = users[0];

      if (user.password !== password) {
        setError("Incorrect password.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userRole", user.role);

      router.push("/dashboard");
    } catch (err) {
      console.error("Login error: ", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
