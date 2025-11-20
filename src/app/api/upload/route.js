// src/app/api/upload/route.js
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const { dataUrl, folder } = await req.json();
    if (!dataUrl)
      return new Response(JSON.stringify({ message: "No file" }), { status: 400 });

    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: folder || "profilic",
      resource_type: "image",
    });

    return new Response(
      JSON.stringify({
        url: result.secure_url,
        public_id: result.public_id,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}