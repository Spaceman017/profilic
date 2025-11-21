// src/app/p/[username]/page.jsx
import Projects from "@/components/Projects";
export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";

async function fetchPortfolio(username) {
  if (!username) return null;
  try {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
      `http://localhost:${process.env.PORT || 3000}`;

    const url = `${base}/api/portfolio/public/${encodeURIComponent(
      username.toLowerCase()
    )}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("PUBLIC FETCH ERROR:", err);
    return null;
  }
}


/* Helper: find URLs in text and convert to clickable anchors */
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

/* Small icon set (SVGs inline) */
const Icon = ({ name, size = 20 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none" };

  switch (name) {
    case "email":
      return (
        <svg {...common}>
          <path d="M3 6.5L12 13 21 6.5" stroke="#0047ab" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="#0047ab" strokeWidth="1.5"/>
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3.08 4.18 2 2 0 0 1 5 2h3a2 2 0 0 1 2 1.72c.12 1.05.36 2.07.72 3.03a2 2 0 0 1-.45 2.11L9.91 11.09a16 16 0 0 0 6 6l1.23-1.23a2 2 0 0 1 2.11-.45c.96.36 1.98.6 3.03.72A2 2 0 0 1 22 16.92z" stroke="#0047ab" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
case "whatsapp":
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 2C8.27 2 2 8.27 2 16c0 2.83.75 5.47 2.05 7.76L2 30l6.38-2.02A13.94 13.94 0 0 0 16 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm0 25.72c-2.5 0-4.86-.73-6.87-2.07l-.49-.29-3.79 1.2 1.23-3.69-.31-.5A11.7 11.7 0 0 1 4.28 16c0-6.42 5.22-11.64 11.64-11.64S27.56 9.58 27.56 16 22.42 27.72 16 27.72zm6.02-8.16c-.33-.17-1.93-.95-2.23-1.06-.29-.11-.5-.17-.71.17-.21.34-.8 1.06-.98 1.27-.18.21-.36.24-.68.08-.33-.17-1.39-.53-2.6-1.61-.96-.85-1.61-1.91-1.79-2.18-.18-.27-.02-.41.13-.54.14-.13.33-.33.49-.5.16-.17.21-.28.3-.46.09-.18.05-.33-.02-.46-.07-.13-.55-1.12-.75-1.55-.2-.44-.39-.38-.53-.39-.14-.01-.31-.01-.48-.01s-.35.06-.54.32c-.19.26-.72.87-.72 2.13 0 1.26.91 2.48 1.04 2.63.13.15 2.1 3.2 5.1 4.49.69.3 1.28.48 1.8.61.75.2 1.43.17 1.97.09.59-.08 1.82-.51 2.07-1.12.25-.61.25-1.13.18-1.24-.07-.11-.27-.18-.54-.34z"
        fill="#0047ab"
      />
    </svg>
  );
    case "twitter":
      return (
        <svg {...common}>
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" fill="#0047ab"/>
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="#0047ab" strokeWidth="2"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="#0047ab" strokeWidth="2"/>
          <path d="M17.5 6.5h.01" stroke="#0047ab" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3V2z" stroke="#0047ab" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#0047ab" strokeWidth="1.5"/>
        </svg>
      );
  }
};

export default async function Page({ params }) {
  // Next 16: params is a Promise — unwrap it
  const resolvedParams = await params;
  const username = resolvedParams?.username?.toLowerCase()?.trim();
  const data = await fetchPortfolio(username);

  if (!data) {
    return (
      <div style={{ padding: 48, textAlign: "center", fontFamily: "Poppins, sans-serif" }}>
        <h1 style={{ color: "#0047ab" }}>Portfolio Not Found</h1>
        <p>User has not created a portfolio yet.</p>
      </div>
    );
  }

  const {
    name = "",
    bio = "",
    profileImage = "",
    aboutInfo = "",
    skills = [],
    projects = [],
    contact = {},
  } = data;

const contactItems = [];
if (contact.email) contactItems.push({ key: "email", href: `mailto:${contact.email}`, icon: "email" });
if (contact.phone) contactItems.push({ key: "phone", href: `tel:${contact.phone}`, icon: "phone" });
if (contact.whatsapp) {
  let waNumber = contact.whatsapp.replace(/\D/g, ""); // remove anything that's not a digit
  contactItems.push({
    key: "whatsapp",
    href: `https://wa.me/${waNumber}`,
    icon: "whatsapp"
  });
}
if (contact.instagram) contactItems.push({ key: "instagram", href: contact.instagram.startsWith("http") ? contact.instagram : `https://${contact.instagram}`, icon: "instagram" });
if (contact.facebook) contactItems.push({ key: "facebook", href: contact.facebook.startsWith("http") ? contact.facebook : `https://${contact.facebook}`, icon: "facebook" });

  return (
    <>

     <Navbar />
    
    <div style={{ fontFamily: "Poppins, sans-serif", color: "#111" }}>
      <style>{`
        .container { max-width: 1100px; margin: 0 auto; padding: 0 1rem; }
        .hero { display: flex; align-items: center; justify-content: center; min-height: 72vh; text-align: center; position: relative; }
        .hero-inner { z-index: 2; padding: 4rem 1rem; }
        .hero-bg { position: absolute; inset: 0; z-index: 1; background: linear-gradient(135deg, #04337a 0%, #2b2b2b 50%, #0f1723 100%); opacity: 0.95; }
        .hero-avatar { width: 160px; height: 160px; border-radius: 50%; object-fit: cover; box-shadow: 0 18px 40px rgba(0,0,0,0.45), 0 0 20px rgba(0,71,171,0.18); border: 6px solid rgba(255,255,255,0.08); }
        .hero-name { font-size: 2.4rem; color: #fff; margin-top: 1rem; font-weight: 700; }
        .hero-bio { color: rgba(255,255,255,0.92); max-width: 750px; margin: 0.75rem auto 0; line-height: 1.5; }
        .wave { display:block; width:100%; height:70px; margin-top: -2px; }
        section { padding: 4rem 0; }
        .center { text-align:center; }
        .skills-grid { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; }
        .skill-pill { background: #fff; padding: 8px 12px; border-radius: 999px; font-weight:600; box-shadow: 0 6px 18px rgba(2,6,23,0.08); transition: transform .22s ease, box-shadow .22s ease; white-space: nowrap; }
        .skill-pill:hover { transform: translateY(-6px); box-shadow: 0 22px 40px rgba(2,6,23,0.12); }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; align-items: start; }
        .project-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(2,6,23,0.06); transition: transform .22s ease, box-shadow .22s ease; display:flex; flex-direction:column; }
        .project-card:hover { transform: translateY(-8px); box-shadow: 0 30px 60px rgba(2,6,23,0.12); }
        .project-image { width:100%; height:180px; object-fit:cover; display:block; }
        .project-body { padding: 1rem; flex:1; display:flex; flex-direction:column; gap:0.5rem; }
        .project-title { font-weight:700; color: #0047ab; margin:0; }
        .project-desc { color: #333; margin:0; overflow-wrap: break-word; word-wrap: break-word; hyphens: auto; white-space: pre-wrap; flex:1; }
        .contact-row { display:flex; gap:10px; justify-content:center; align-items:center; }
        .contact-btn { display:inline-flex; align-items:center; justify-content:center; width:44px; height:44px; border-radius:10px; background:#fff; box-shadow: 0 6px 18px rgba(2,6,23,0.06); transition: transform .16s; }
        .contact-btn:hover { transform: translateY(-4px); }
        @media (max-width: 720px) {
          .hero-avatar { width:120px; height:120px; }
          .hero-name { font-size: 1.8rem; }
          .hero { min-height: 60vh; }
        }
      `}</style>

      {/* HERO */}
      <section id="home">
      <div className="hero" aria-label="Hero section">
        <div className="hero-bg" />
        <div className="hero-inner container">
          {profileImage ? (
            <img src={profileImage} alt={name || username} className="hero-avatar" />
          ) : (
            <div style={{ width:160, height:160, borderRadius: "50%", background:"#ffffffff", display:"inline-block" }} />
          )}

          <h1 className="hero-name" style={{ color: "#0047ab"}} >{name || username} </h1>
          <p className="hero-bio"style={{ color: "#000000ff" }}>{bio}</p>
        </div>
      </div>
      </section>

      {/* wave */}
      <svg className="wave" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path fill="#0047ab" d="M0,32 C240,96 480,0 720,32 C960,64 1200,0 1440,32 L1440,80 L0,80 Z"></path>
      </svg>

      {/* ABOUT */}
      <section id="about" style={{ background: "#fff" }}>
        <div className="container center">
          <h2 style={{ color: "#0047ab", fontSize: "2rem", marginBottom: 8 }}>About</h2>
          <p style={{ maxWidth: 900, margin: "0 auto", color: "#333", lineHeight: 1.7, wordWrap: "break-word",overflowWrap: "break-word",whiteSpace: "pre-wrap" }}>
            {aboutInfo || "No About info provided."}
          </p>
        </div>
      </section>

      {/* wave */}
      <svg className="wave" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path fill="#0047ab" d="M0,32 C240,96 480,0 720,32 C960,64 1200,0 1440,32 L1440,80 L0,80 Z"></path>
      </svg>

      {/* SKILLS */}
      <section id="skills" style={{ background: "#f8fafc" }}>
        <div className="container center">
          <h2 style={{ color: "#0047ab", fontSize: "2rem", marginBottom: 16 }}>Skills</h2>
          <div className="skills-grid" aria-label="Skills">
            {Array.isArray(skills) && skills.length > 0 ? (
              skills.map((s, i) => (
                <div key={i} className="skill-pill" title={s}>
                  {s}
                </div>
              ))
            ) : (
              <p style={{ color: "#0047ab" }}>No skills listed yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* wave */}
      <svg className="wave" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path fill="#0047ab" d="M0,32 C240,96 480,0 720,32 C960,64 1200,0 1440,32 L1440,80 L0,80 Z"></path>
      </svg>

      {/* PROJECTS */}
<section id="projects" style={{ background: "#fff" }}>
  <div className="container">
    <h2 style={{ color: "#0047ab", textAlign: "center", fontSize: "2rem", marginBottom: 16 }}>
      Projects
    </h2>

    <Projects projects={projects} />
  </div>
</section>

      {/* wave */}
      <svg className="wave" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path fill="#0047ab" d="M0,32 C240,96 480,0 720,32 C960,64 1200,0 1440,32 L1440,80 L0,80 Z"></path>
      </svg>

{/* CONTACT */}
<section id="contact" style={{ background: "#f8fafc" }}>
  <div className="container center">
    <h2 style={{ color: "#0047ab", fontSize: "2rem", marginBottom: 16 }}>Contact</h2>

    <div className="contact-row" role="list">
      {contactItems.length > 0 ? (
        contactItems.map((it) => (
          <a
            key={it.key}
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn"
            style={{ textDecoration: "none" }}
          >
            <Icon name={it.icon} />
          </a>
        ))
      ) : (
        <p style={{ color: "#666" }}>No contact details added.</p>
      )}
    </div>
  </div>
</section>

      <footer style={{ padding: "2rem 0", textAlign: "center", color: "#666" }}>
        <div className="container">© {new Date().getFullYear()}  Built with <span style={{ color: "#0047ab", fontSize: "1rem", fontWeight: 600, color: "#0047ab", marginBottom: "0.25rem" }}>Pro</span>
            <span style={{ color: "black", fontSize: "1rem", fontWeight: 600, color: "#000000ff", marginBottom: "0.25rem" }}>Filic</span>
</div>
      </footer>
    </div>
    </>
  );
}