"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // spinner element 
  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .card {
          max-width: 400px;
          width: 100%;
          background: rgba(255,255,255,0.94);
          padding: 1.1rem;
          border-radius: 12px;
          box-shadow: 0 8px 18px rgba(0,0,0,0.18);
        }

        .logo {
          font-size: 1.6rem;
          font-weight: 700;
          display:flex;
          gap:0.25rem;
          align-items:center;
          margin-bottom: 0.25rem;
        }

        .title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #0047ab;
          margin-bottom: 0.8rem;
        }

        .form {
          display:flex;
          flex-direction:column;
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
          top: 44%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          padding: 5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* remove hover background for icon buttons (you asked for no color change) */
        .icon-btn:hover, .icon-btn:focus { background: transparent; }

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
          font-size: 0.95rem;
        }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundImage: "url('/pictorials/seafolds.png')", backgroundSize: "cover", backgroundPosition: "center", padding: "1rem" }}>
        <div className="card">
          <div className="logo">
            <span style={{ color: "#0047ab", fontSize: "3rem" }}>Pro</span>
            <span style={{ color: "black", fontSize: "3rem" }}>Filic</span>
          </div>

          <div className="title">
            <h1 style={{ color: "#0047ab" }}>Login</h1>
          </div>

          <form className="form" onSubmit={handleSubmit} autoComplete="on">
            <div className="input-box">
              <input className="input-field" placeholder=" " value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} required />
              <label className="input-label">Email or Username</label>
            </div>

            <div className="input-box">
              <input className="input-field" type={showPassword ? "text" : "password"} placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required />
              <label className="input-label">Password</label>

              <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((s) => !s)} className="icon-btn" title={showPassword ? "Hide" : "Show"}>
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3l18 18" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.58 10.58A3 3 0 0113.42 13.42" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12s-3.5-7-9-7a9.77 9.77 0 00-6 2.2" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#374151" strokeWidth="1.6"/>
                  </svg>
                )}
              </button>
            </div>

            <button className="submit-btn" type="submit" disabled={loading} style={{ opacity: loading ? 0.85 : 1 }}>
              {loading ? <div style={{ width: 18, height: 18, border: "3px solid white", borderTop: "3px solid #003b8c", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : "Login"}
            </button>
          </form>

          <p style={{ color: "#0047ab", cursor: "pointer", textAlign: "center" }} onClick={() => router.push("/forgot-password")}>Forgot Password?</p>

          <div className="small-note">
            Do not have an account?{" "}
            <span style={{ color: "#0047ab", fontWeight: 700, cursor: "pointer" }} onClick={() => router.push("/signup")}>
              Sign Up
            </span>
          </div>

          {message && <div className="error">{message}</div>}
        </div>
      </div>
    </>
  );
}