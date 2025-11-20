"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
    setLoading(false);
  };

  const spinner = (
    <div
      style={{
        width: 18,
        height: 18,
        border: "3px solid rgba(255,255,255,0.6)",
        borderTopColor: "white",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .card {
          max-width: 380px;
          width: 100%;
          background: rgba(255,255,255,0.94);
          padding: 1.5rem;
          border-radius: 14px;
          box-shadow: 0 8px 18px rgba(0,0,0,0.18);
        }

        .logo {
          font-size: 1.6rem;
          font-weight: 700;
          display:flex;
          gap:0.25rem;
          align-items:center;
          margin-bottom: 0.5rem;
        }

        .title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #0047ab;
          margin-bottom: 1rem;
        }

        .form {
          display:flex;
          flex-direction:column;
          gap: 0.8rem;
        }

        .input {
          width: 100%;
          padding: 10px 12px;
          border: 1.3px solid #d0d6dd;
          border-radius: 8px;
          font-size: 0.95rem;
          outline: none;
          background: white;
        }

        .submit-btn {
          background-color: #0047ab;
          color: white;
          padding: 0.75rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .note {
          margin-top: 1rem;
          text-align:center;
          font-size: 0.9rem;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: "url('/pictorials/seafolds.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "1rem",
        }}
      >
        <div className="card">
          {/* Logo */}
          <div className="logo">
            <span style={{ color: "#0047ab" }}>Pro</span>
            <span style={{ color: "black" }}>Filic</span>
          </div>

          {/* Title */}
          <div className="title">Forgot Password</div>

          {/* Form */}
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="input"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="submit-btn" disabled={loading}>
              {loading ? spinner : "Send Reset Link"}
            </button>
          </form>

          {/* Message */}
          {message && (
            <p
              style={{
                marginTop: "1rem",
                color: message.includes("sent") ? "green" : "red",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              {message}
            </p>
          )}

          {/* Back to login */}
          <p className="note">
            Remember your password?{" "}
            <span
              style={{ color: "#0047ab", fontWeight: 700, cursor: "pointer" }}
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
}