//src/app/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


async function uploadImage(file, folder = "profilic") {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl: reader.result, folder }),
        });
        const data = await res.json();
        if (res.ok) resolve(data);
        else reject(new Error(data.message || "Upload failed"));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
}

function Logo() {
  return (
    <h1 style={{ fontSize: "3rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.25rem" }}>
      <span style={{ color: "#0047ab" }}>Pro</span>
      <span style={{ color: "black" }}>Filic</span>
    </h1>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  // DATA
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImageId, setProfileImageId] = useState("");
  const [aboutInfo, setAboutInfo] = useState("");
  const [skills, setSkills] = useState([""]);
  const [projects, setProjects] = useState([{ name: "", info: "", image: "", imageId: "" }]);
  const [contact, setContact] = useState({
    email: "", phone: "", whatsapp: "", twitter: "", instagram: "", facebook: "",
  });
  const [username, setUsername] = useState("");

  // UI STATE
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingLoad, setLoadingLoad] = useState(true);
  const [message, setMessage] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // MODAL
  const [showGeneratedModal, setShowGeneratedModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  // BACKGROUNDS
const homeBg     = "linear-gradient(135deg, #1f2937 0%, #374151 100%)"; // dark, calm, grounding
const aboutBg    = "linear-gradient(135deg, #111827 0%, #1e293b 100%)"; // serious, storytelling
const skillsBg   = "linear-gradient(135deg, #0f172a 0%, #1e40af 100%)"; // growth, trustful
const projectsBg = "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"; // professional showcase
const contactBg  = "linear-gradient(135deg, #92a8a2ff 0%, #2a4672ff 100%)"; // reliable, communicative

  // LOAD PORTFOLIO
  useEffect(() => {
    let alive = true;
    async function load() {
      setLoadingLoad(true);
      try {
        const res = await fetch("/api/portfolio/get");
        const data = await res.json();
        if (!res.ok) { setLoadingLoad(false); return; }
        if (!alive) return;

        setName(data.name || "");
        setBio(data.bio || "");
        if (data.profileImage) setProfileImage(data.profileImage);
        if (data.profileImageId) setProfileImageId(data.profileImageId);
        setAboutInfo(data.aboutInfo || "");
        setSkills(Array.isArray(data.skills) && data.skills.length ? data.skills : [""]);
        setProjects(Array.isArray(data.projects) && data.projects.length ? data.projects : [{ name: "", info: "", image: "", imageId: "" }]);
        setContact((old) => ({ ...old, ...(data.contact || {}) }));
        if (data.username) setUsername(data.username);
      } catch (err) { console.error("Load error:", err); }
      setLoadingLoad(false);
    }
    load();
    return () => { alive = false };
  }, []);

  // GENERATE PORTFOLIO
  const handleGenerate = async () => {
    setLoadingSave(true); setMessage("");
    try {
      const payload = { name, bio, profileImage: profileImage ? { url: profileImage, public_id: profileImageId } : null, aboutInfo, skills, projects, contact };
      const res = await fetch("/api/portfolio/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setMessage(data.message || "Generate failed"); setLoadingSave(false); return; }

      const finalUsername = data.username || username;
      const portfolioUrl = `${window.location.origin}/p/${finalUsername}`;
      setGeneratedLink(portfolioUrl);
      setShowGeneratedModal(true);
      setMessage("Portfolio generated successfully!");
    } catch (err) { console.error("Generate error:", err); setMessage("Generate failed"); }
    setLoadingSave(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setMessage("Copied to clipboard!");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleDownloadPortfolio = async () => {
    try {
      const res = await fetch(generatedLink);
      const htmlText = await res.text();
      const blob = new Blob([htmlText], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "portfolio.html"; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { console.error("Download error:", err); }
  };

  // IMAGE HANDLERS
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return; setMessage("Uploading profile image...");
    try { const res = await uploadImage(file, "profile-images"); if (res.url) { setProfileImage(res.url); setProfileImageId(res.public_id || ""); } setMessage(""); }
    catch { setMessage("Profile upload failed"); }
  };

  const handleProjectImageUpload = async (e, idx) => {
    const file = e.target.files?.[0]; if (!file) return; setMessage("Uploading project image...");
    try { const res = await uploadImage(file, "project-images"); const updated = [...projects]; updated[idx].image = res.url; updated[idx].imageId = res.public_id || ""; setProjects(updated); setMessage(""); }
    catch { setMessage("Project image upload failed"); }
  };

  // SKILL & PROJECT HANDLERS
  const handleAddSkill = () => setSkills([...skills, ""]);
  const handleRemoveSkill = (i) => setSkills(skills.filter((_, idx) => idx !== i));
  const handleAddProject = () => setProjects([...projects, { name: "", info: "", image: "", imageId: "" }]);
  const handleRemoveProject = (i) => setProjects(projects.filter((_, idx) => idx !== i));

  // LOGOUT & DELETE
  const handleLogout = async () => { await fetch("/api/auth/logout", { method: "POST" }).catch(() => {}); window.location.href = "/login"; };
  const handleResetPassword = () => { router.push("/forgot-password"); setShowSettings(false); };
  const handleDeleteAccount = async () => {
    try { const res = await fetch("/api/auth/delete-account", { method: "POST" }); const d = await res.json(); if (!res.ok) { alert(d.message || "Delete failed"); return; } alert("Account deleted."); window.location.href = "/"; }
    catch { alert("Delete failed"); }
    setConfirmDelete(false);
  };

  // Ensure at least one skill/project
  useEffect(() => { if (skills.length === 0) setSkills([""]); if (projects.length === 0) setProjects([{ name: "", info: "", image: "", imageId: "" }]); }, [skills, projects]);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: "2rem", maxWidth: "1300px", margin: "0 auto", backgroundColor: "#c3cfe6", backgroundSize: "cover", backgroundPosition: "center", minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5rem" }}>
          <Logo />
        </div>

        <div style={{ position: "relative" }}>
          <button onClick={() => setShowSettings((s) => !s)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "0.3rem" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" stroke="#0047ab" strokeWidth="1.5"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.7 0 1.32-.39 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06c.5.5 1.21.65 1.82.33.61-.31 1-1 1-1.51V3a2 2 0 1 1 4 0v.09c0 .7.39 1.32 1 1.51.61.31 1.32.17 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.5.5-.65 1.21-.33 1.82.31.61 1 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.7 0-1.32.39-1.51 1Z" stroke="#0047ab" strokeWidth="1.5"/>
            </svg>
          </button>
          {showSettings && (
            <div style={{ position: "absolute", right: 0, top: "40px", width: "180px", background: "white", boxShadow: "0 8px 18px rgba(0,0,0,0.2)", borderRadius: "10px", padding: "0.7rem", zIndex: 99 }}>
              <p style={{ padding: "0.5rem", cursor: "pointer" }} onClick={handleResetPassword}>Reset Password</p>
              <p style={{ padding: "0.5rem", cursor: "pointer" }} onClick={handleLogout}>Logout</p>
              <p style={{ padding: "0.5rem", cursor: "pointer", color: "red", fontWeight: 600 }} onClick={() => setConfirmDelete(true)}>Delete Account</p>
            </div>
          )}
        </div>
      </div>

      <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem", color: "#0047ab" }}>Dashboard</h2>

      {/* CARDS */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center", alignItems: "flex-start" }}>
        {/* HOME */}
        <div style={{ ...cardStyle, backgroundImage: homeBg }}>
          <h3 style={cardTitleStyle} >Home</h3>
          <input style={inputStyle} type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea style={textareaStyle} placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <label style={attachLabelStyle}>Profile Image
              <input type="file" style={{ display: "none" }} onChange={handleProfileImageUpload} />
            </label>
            {profileImage && <img src={profileImage} alt="profile" style={previewImgStyle} />}
          </div>
        </div>

        {/* ABOUT */}
        <div style={{ ...cardStyle, backgroundImage: aboutBg}}>
          <h3 style={cardTitleStyle}>About</h3>
          <textarea style={textareaStyle} placeholder="Info" value={aboutInfo} onChange={(e) => setAboutInfo(e.target.value)} />
        </div>

{/* SKILLS */}
<div style={{ ...cardStyle, backgroundImage: skillsBg}}>
  <h3 style={cardTitleStyle}>Skills</h3>

  {skills.map((s, idx) => {
    // Parse "Skill||Level"
    const [skillName = "", skillLevel = ""] = s.includes("||") ? s.split("||") : [s, ""];

    return (
      <div
        key={idx}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        {/* SKILL NAME */}
        <input
          style={{ ...inputStyle, flex: 1, minWidth: "150px" }}
          placeholder={`Skill #${idx + 1}`}
          value={skillName}
          onChange={(e) => {
            const newSkills = [...skills];
            newSkills[idx] = `${e.target.value}||${skillLevel}`;
            setSkills(newSkills);
          }}
        />

        {/* LEVEL DROPDOWN */}
        <select
          style={{
            ...inputStyle,
            width: "150px",
            minWidth: "120px",
            cursor: "pointer",
            border: "1px solid #0047ab",
          }}
          value={skillLevel}
          onChange={(e) => {
            const newSkills = [...skills];
            newSkills[idx] = `${skillName}||${e.target.value}`;
            setSkills(newSkills);
          }}
        >
          <option value="">Select level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>

        {/* DELETE BUTTON */}
        <button
          onClick={() => handleRemoveSkill(idx)}
          style={{
            ...smallCircularXStyle,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          ×
        </button>
      </div>
    );
  })}

  <button onClick={handleAddSkill} style={addBtnStyle}>Add Skill</button>
</div>
        {/* PROJECTS */}
        <div style={{ ...cardStyle, backgroundImage: projectsBg, flex: "1 1 100%" }}>
          <h3 style={cardTitleStyle}>Projects</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {projects.map((p, idx) => (
              <div key={idx} style={{ borderRadius: 8, padding: 8, background: "rgba(13, 13, 13, 0.85)" }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="Project Name" value={p.name} onChange={(e) => { const copy = [...projects]; copy[idx].name = e.target.value; setProjects(copy); }} />
                  <button onClick={() => handleRemoveProject(idx)} style={{ ...smallCircularXStyle, display: "flex", justifyContent: "center", alignItems: "center" }}>×</button>
                </div>
                <textarea style={{ ...textareaStyle, marginTop: 8 }} placeholder="Project Info" value={p.info} onChange={(e) => { const copy = [...projects]; copy[idx].info = e.target.value; setProjects(copy); }} />
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: 8 }}>
                  <label style={attachLabelStyle}>Attach Image
                    <input type="file" style={{ display: "none" }} onChange={(e) => handleProjectImageUpload(e, idx)} />
                  </label>
                  {p.image && <img src={p.image} alt={`project-${idx}`} style={previewImgStyle} />}
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleAddProject} style={addBtnStyle}>Add Project</button>
        </div>

        {/* CONTACT */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ ...cardStyle, backgroundImage: contactBg, flex: "1 1 100%", maxWidth: "600px" }}>
            <h3 style={cardTitleStyle}>Contact</h3>
            {["email","phone","whatsapp","twitter","instagram","facebook"].map(field => (
              <input key={field} style={inputStyle} placeholder={field.charAt(0).toUpperCase()+field.slice(1)} value={contact[field]} onChange={(e) => setContact({ ...contact, [field]: e.target.value })} />
            ))}
          </div>
        </div>
      </div>

      {/* GENERATE BUTTON */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button onClick={handleGenerate} disabled={loadingSave} style={{ padding: "0.75rem 2rem", borderRadius: 8, background: "#0047ab", color: "white", fontWeight: 600, cursor: "pointer", fontSize: "1.25rem" }}>
          {loadingSave ? "Generating..." : "Generate Portfolio"}
        </button>
      </div>

      {/* MESSAGES */}
      {message && <p style={{ textAlign: "center", marginTop: "1rem", color: "green" }}>{message}</p>}

      {/* GENERATED MODAL */}
      {showGeneratedModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: 12, width: "400px", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.5rem", color: "#0047ab" }}>Portfolio Generated!</h3>
            <p style={{ margin: "1rem 0" }}>Your portfolio is live at:</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f0f0f0", padding: "0.5rem 1rem", borderRadius: 8 }}>
              <span style={{ wordBreak: "break-all" }}>{generatedLink}</span>
              <button onClick={handleCopyLink} style={{ marginLeft: 8, background: "#0047ab", color: "white", border: "none", padding: "4px 8px", borderRadius: 6, cursor: "pointer", transition: "0.2s", transform: "scale(1)" }}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"}
                onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >Copy</button>
            </div>
            <button onClick={handleDownloadPortfolio} style={{ marginTop: "1rem", background: "#0047ab", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: 8, cursor: "pointer", transition: "0.2s", transform: "scale(1)" }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >Download Portfolio</button>
            <button onClick={() => setShowGeneratedModal(false)} style={{ marginTop: "0.5rem", background: "#eee", color: "#0047ab", border: "none", padding: "0.4rem 1rem", borderRadius: 8, cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: 12, width: "400px", textAlign: "center" }}>
            <p style={{ marginBottom: "1rem", color: "red" }}>Are you sure you want to delete your account? This action is permanent!</p>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <button onClick={handleDeleteAccount} style={{ padding: "0.5rem 1rem", borderRadius: 6, background: "red", color: "white" }}>Delete</button>
              <button onClick={() => setConfirmDelete(false)} style={{ padding: "0.5rem 1rem", borderRadius: 6, background: "#eee", color: "#0047ab" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// INLINE STYLES
const cardStyle = { flex: "0 1 300px", backgroundSize: "cover", backgroundPosition: "center", padding: "1rem", borderRadius: "12px", boxShadow: "0 4px 18px rgba(0,0,0,0.2)", color: "#0047ab" };
const cardTitleStyle = { fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", color: "white" };
const inputStyle = { width: "100%", padding: "0.5rem", marginBottom: "0.5rem", borderRadius: 6, border: "1px solid #ccc" };
const textareaStyle = { width: "100%", padding: "0.5rem", borderRadius: 6, minHeight: 80, border: "1px solid #ccc", marginBottom: "0.5rem" };
const attachLabelStyle = { padding: "0.5rem 1rem", background: "#0047ab", color: "white", borderRadius: 6, cursor: "pointer" };
const previewImgStyle = { width: 50, height: 50, objectFit: "cover", borderRadius: 6 };
const smallCircularXStyle = { background: "red", color: "white", borderRadius: "50%", border: "none", width: 24, height: 24, cursor: "pointer" };
const addBtnStyle = { marginTop: "0.5rem", padding: "0.5rem 1rem", borderRadius: 6, background: "#0047ab", color: "white", cursor: "pointer" };