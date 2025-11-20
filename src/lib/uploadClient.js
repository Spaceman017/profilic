export async function uploadDataUrl(dataUrl, folder = "profilic") {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl, folder }),
  });
  if (!res.ok) throw new Error("upload failed");
  return res.json(); // { url, public_id }
}