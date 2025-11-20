"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 720);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleScroll = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 70; // navbar height
    const bodyRect = document.body.getBoundingClientRect().top;
    const elRect = el.getBoundingClientRect().top;
    const scrollPos = elRect - bodyRect - offset;
    window.scrollTo({ top: scrollPos, behavior: "smooth" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        padding: "1rem 2rem",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 50,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
<h1
  onClick={() => (window.location.href = "/signup")}
  style={{
    fontSize: "2rem",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  <span style={{ color: "#0047ab" }}>Pro</span>
  <span style={{ color: "black" }}>Filic</span>
</h1>

      {!isMobile && (
        <div className="nav-links" style={{ display: "flex", gap: "1.5rem", fontWeight: 600 }}>
          <a href="#home" onClick={(e) => handleScroll(e, "home")}>HOME</a>
          <a href="#about" onClick={(e) => handleScroll(e, "about")}>ABOUT</a>
          <a href="#skills" onClick={(e) => handleScroll(e, "skills")}>SKILLS</a>
          <a href="#projects" onClick={(e) => handleScroll(e, "projects")}>PROJECTS</a>
          <a href="#contact" onClick={(e) => handleScroll(e, "contact")}>CONTACT</a>
        </div>
      )}

      <style>{`
        .nav-links a {
          color: black;
          text-decoration: none;
          transition: color 0.3s ease, transform 0.2s ease;
        }
        .nav-links a:hover {
          color: #0047ab;
          transform: translateY(-2px);
        }
      `}</style>
    </nav>
  );
}
