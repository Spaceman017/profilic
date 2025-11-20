"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirm) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      router.push("/login");
    }

    setLoading(false);
  };

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

        .icon-btn:hover, .icon-btn:focus {
          background: transparent;
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

        .error {
          color: #b91c1c;
          text-align: center;
          margin-top: 0.45rem;
          font-size: 0.95rem;
        }

        .success-msg {
          color: #047857;
          text-align: center;
          margin-top: 0.6rem;
          font-size: 1rem;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/pictorials/seafolds.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "1rem"
      }}>
        <div className="card">
          {/* Logo */}
          <div className="logo">
            <span style={{ color: "#0047ab" }}>Pro</span>
            <span style={{ color: "black" }}>Filic</span>
          </div>

          {/* Title */}
          <div className="title">Reset Password</div>

          <form className="form" onSubmit={handleSubmit}>
            
            {/* New Password */}
            <div className="input-box">
              <input
                className="input-field"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="input-label">New Password</label>

              {/* Eye Icon */}
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="icon-btn"
              >
                {showPassword ? (
                  <svg width="18" height="18" fill="none" stroke="#374151" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path d="M3 3l18 18M10.58 10.58A3 3 0 0113.42 13.42M21 12s-3.5-7-9-7a9.77 9.77 0 00-6 2.2"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="#374151" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="input-box">
              <input
                className="input-field"
                type="password"
                placeholder=" "
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <label className="input-label">Confirm Password</label>
            </div>

            <button
              className="submit-btn"
              type="submit"
              disabled={loading}
              style={{ opacity: loading ? 0.85 : 1 }}
            >
              {loading ? (
                <div style={{
                  width: 18,
                  height: 18,
                  border: "3px solid white",
                  borderTop: "3px solid #003b8c",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }} />
              ) : "Reset Password"}
            </button>
          </form>

          {message && <div className={message.includes("updated") ? "success-msg" : "error"}>{message}</div>}

        </div>
      </div>
    </>
  );
}