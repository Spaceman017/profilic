"use client";
export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get token from URL manually
  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  }, []);

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

    if (res.ok) router.push("/login");

    setLoading(false);
  };

  return (
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
      <div
        style={{
          maxWidth: 400,
          width: "100%",
          background: "rgba(255,255,255,0.94)",
          padding: "1.1rem",
          borderRadius: 12,
          boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ fontSize: "1.6rem", fontWeight: 700, display: "flex", gap: "0.25rem", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{ color: "#0047ab" }}>Pro</span>
          <span style={{ color: "black" }}>Filic</span>
        </div>

        <div style={{ fontSize: "1.3rem", fontWeight: 600, color: "#0047ab", marginBottom: "1rem" }}>
          Reset Password
        </div>

        <form style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }} onSubmit={handleSubmit}>
          {/* New Password */}
          <div style={{ position: "relative" }}>
            <input
              style={{
                width: "100%",
                padding: "10px 40px 10px 12px",
                border: "1.25px solid #d0d6dd",
                borderRadius: 8,
                background: "white",
                outline: "none",
                fontSize: "0.95rem",
              }}
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label
              style={{
                position: "absolute",
                top: "50%",
                left: 12,
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.94)",
                padding: "0 6px",
                color: "#6b7280",
                fontSize: "0.95rem",
                pointerEvents: "none",
              }}
            >
              New Password
            </label>

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                padding: 6,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
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
          <div style={{ position: "relative" }}>
            <input
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1.25px solid #d0d6dd",
                borderRadius: 8,
                background: "white",
                outline: "none",
                fontSize: "0.95rem",
              }}
              type="password"
              placeholder=" "
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <label
              style={{
                position: "absolute",
                top: "50%",
                left: 12,
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.94)",
                padding: "0 6px",
                color: "#6b7280",
                fontSize: "0.95rem",
                pointerEvents: "none",
              }}
            >
              Confirm Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#0047ab",
              color: "white",
              padding: "0.7rem",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.85 : 1,
            }}
          >
            {loading ? (
              <div
                style={{
                  width: 18,
                  height: 18,
                  border: "3px solid white",
                  borderTop: "3px solid #003b8c",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {message && (
          <div style={{ color: message.includes("updated") ? "#047857" : "#b91c1c", textAlign: "center", marginTop: 8 }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
