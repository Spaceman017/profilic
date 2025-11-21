"use client";

import { useState } from "react";

// Helper: convert URLs in text to clickable links
function linkifyText(text) {
  if (!text) return null;
  const urlRegex = /((https?:\/\/)|(www\.))[^\s/$.?#].[^\s]*/gi;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[0];
    const idx = match.index;
    if (idx > lastIndex) {
      parts.push(text.slice(lastIndex, idx));
    }
    const href = url.startsWith("http") ? url : `https://${url}`;
    parts.push(
      <a
        key={idx}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#0047ab", textDecoration: "underline" }}
      >
        {url}
      </a>
    );
    lastIndex = idx + url.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length ? parts : text;
}

export default function Projects({ projects }) {
  const [lightboxImage, setLightboxImage] = useState(null);

  return (
    <>
      <div className="projects-grid">
        {projects.map((p, i) => {
          const descNodes = typeof p.info === "string" ? linkifyText(p.info) : p.info;
          return (
            <article className="project-card" key={i}>
              {p.image ? (
                <img
                  className="project-image"
                  src={p.image}
                  alt={p.name || `project-${i}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setLightboxImage(p.image)}
                />
              ) : (
                <div style={{ height: 180, background: "#e6eefc"}} />
              )}

              <div className="project-body">
                <h3 className="project-title">{p.name || `Untitled Project`}</h3>
                <p className="project-desc">{descNodes}</p>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
            }}
          >
            <img
              src={lightboxImage}
              alt="Enlarged"
              style={{ width: "auto",
    maxWidth: "90vw",
    height: "auto",
    maxHeight: "90vh",
    borderRadius: 12, }}
            />
            <button
              onClick={() => setLightboxImage(null)}
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                background: "#ffffffff",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",

                 // CENTERING THE ×
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    lineHeight: 1,
              }}
            >
              <span style={{color: "#0047ab",}}>X</span>
            </button>
          </div>
        </div>
      )}

      {/* CSS Styling */}
      <style jsx>{`
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1rem;
          align-items: start;
        }
        .project-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(2, 6, 23, 0.06);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          display: flex;
          flex-direction: column;
        }
        .project-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(2, 6, 23, 0.12);
        }
        .project-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
        }
        .project-body {
          padding: 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .project-title {
          font-weight: 700;
          color: #0047ab;
          margin: 0;
        }
        .project-desc {
          color: #333;
          margin: 0;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          white-space: pre-wrap;
          flex: 1;
        }
      `}</style>
    </>
  );
}
