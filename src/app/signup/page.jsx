"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, email, password }),
      });

      const data = await res.json();
      if (data.message === "Username already taken") {
        setUsernameError(data.message);
        setLoading(false);
        return;
      }
      if (data.message === "Email already in use") {
        setEmailError(data.message);
        setLoading(false);
        return;
      }
      setMessage(data.message);

      if (res.ok) {
        router.push("/login");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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
          max-width: 400px;
          width: 100%;
          background: rgba(255,255,255,0.94);
          padding: 1.2rem;
          border-radius: 12px;
          box-shadow: 0 8px 18px rgba(0,0,0,0.18);
        }

        .title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #0047ab;
          margin-bottom: 0.8rem;
        }

        .logo {
          font-size: 1.6rem;
          font-weight: 700;
          display: flex;
          gap: 0.25rem;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .input-box {
          position: relative;
        }

        .input-field {
          width: 100%;
          padding: 10px 40px 10px 12px;
          border: 1.25px solid #d0d6dd;
          border-radius: 8px;
          background: white;
          outline: none;
          font-size: 0.95rem;
        }

        .input-label {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.94);
          padding: 0 6px;
          color: #6b7280;
          transition: all 0.18s ease;
          font-size: 0.95rem;
          pointer-events: none;
        }

        .input-field:focus + .input-label,
        .input-field:not(:placeholder-shown) + .input-label {
          top: -8px;
          font-size: 0.75rem;
          color: #0047ab;
        }

        .icon-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover,
        .icon-btn:focus {
          background: transparent;
          outline: none;
        }

        .icon-btn svg {
          pointer-events: none;
        }

        .submit-btn {
          background-color: #0047ab;
          color: white;
          padding: 0.7rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .small-note {
          text-align: center;
          margin-top: 0.6rem;
          font-size: 0.9rem;
        }

        .error {
          color: #b91c1c;
          text-align: center;
          margin-top: 0.45rem;
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
          <div className="logo">
            <span style={{ color: "#0047ab", fontSize: "3rem" }}>Pro</span>
            <span style={{ color: "black", fontSize: "3rem" }}>Filic</span>
          </div>

{/* Intro Section */}
<div
  style={{
    marginBottom: "1.5rem",
    padding: "1rem 1rem",
    borderRadius: "10px",
    background: "rgba(0, 71, 171, 0.08)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem"
  }}
>
  {/* Profile icon */}
 <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0047ab" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />       {/* head */}
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" /> {/* shoulders/body */}
  </svg>
  <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#0047ab", marginBottom: "0.25rem" }}>
    Welcome to             <span style={{ color: "#0047ab", fontSize: "1.25rem", fontWeight: 600, color: "#0047ab", marginBottom: "0.25rem" }}>Pro</span>
            <span style={{ color: "black", fontSize: "1.25rem", fontWeight: 600, color: "#000000ff", marginBottom: "0.25rem" }}>Filic</span>

  </h2>

  <p style={{ fontSize: "0.95rem", color: "#374151", lineHeight: "1.4rem", maxWidth: "320px" }}>
    Build your professional portfolio in minutes. Enter your details, and we’ll automatically generate a stunning online portfolio showcasing your skills, projects, and experience, no design skills required.
  </p>
</div>

          <div className="title">
            <h1 style={{ color: "#0047ab" }}>Sign-up</h1>
          </div>

          {/* Form starts here */}
          <form className="form" onSubmit={handleSubmit} autoComplete="on">
            <div className="input-box">
              <input
                className="input-field"
                placeholder=" "
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <label className="input-label">Full Name</label>
            </div>

            <div className="input-box">
              <input
                className="input-field"
                placeholder=" "
                value={username}
                onChange={(e) => { setUsername(e.target.value); setUsernameError(""); }}
                required
              />
              <label className="input-label">Username</label>
              {usernameError && <p className="error">{usernameError}</p>}
            </div>

            <div className="input-box">
              <input
                className="input-field"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                required
              />
              <label className="input-label">Email</label>
              {emailError && <p className="error">{emailError}</p>}
            </div>

            <div className="input-box">
              <input
                className="input-field"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="input-label">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="icon-btn"
              >
                {/* Password visibility icons here */}
              </button>
            </div>

            <div className="input-box">
              <input
                className="input-field"
                type={showConfirm ? "text" : "password"}
                placeholder=" "
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
              <label className="input-label">Confirm Password</label>
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="icon-btn"
              >
                {/* Confirm password icons here */}
              </button>
            </div>

            <button
              className="submit-btn"
              type="submit"
              disabled={loading}
              style={{ opacity: loading ? 0.85 : 1 }}
            >
              {loading ? spinner : "Sign-up"}
            </button>
          </form>

          <div className="small-note">
            Already have an account?{" "}
            <span
              style={{ color: "#0047ab", fontWeight: 700, cursor: "pointer" }}
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </div>

          {message && <div className="error">{message}</div>}
        </div>
      </div>
    </>
  );
}
