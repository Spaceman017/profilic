// src/app/api/portfolio/save/route.js
import connectToDatabase from "@/lib/mongodb";
import Portfolio from "@/models/portfolio";
import { verifyUser } from "@/lib/auth";
import { jsonRes } from "@/lib/utils";

export async function POST(req) {
  try {
    const user = await verifyUser(req);
    if (!user) return jsonRes({ message: "Unauthorized" }, 401);

    const body = await req.json();
    await connectToDatabase();

    // normalize profileImage
    let profileImage = null;
    if (body.profileImage) {
      if (typeof body.profileImage === "string") {
        profileImage = { url: body.profileImage, public_id: "" };
      } else if (typeof body.profileImage === "object") {
        profileImage = { url: body.profileImage.url || "", public_id: body.profileImage.public_id || body.profileImage.imageId || "" };
      }
    }

    // normalize projects
    const projects = Array.isArray(body.projects)
      ? body.projects.map((p) => ({
          name: p.name || "",
          info: p.info || "",
          // allow string or object for image
          image: (typeof p.image === "string" && p.image) || (p.image && p.image.url) || "",
          imageId: p.imageId || (p.image && (p.image.public_id || p.image.imageId)) || "",
          link: p.link || "",
          github: p.github || "",
        }))
      : [];

    const updateData = {
      userId: user._id,
      username: (user.username || user.email || "").toLowerCase(),
      name: body.name || "",
      bio: body.bio || "",
      profileImage: profileImage || { url: "", public_id: "" },
      aboutInfo: body.aboutInfo || "",
      skills: Array.isArray(body.skills) ? body.skills : [],
      projects,
      contact: body.contact || {},
      published: !!body.published,
    };

    const updated = await Portfolio.findOneAndUpdate(
      { userId: user._id },
      updateData,
      { upsert: true, new: true }
    );

    return jsonRes(
      {
        message: "Saved",
        username: updated.username,
      },
      200
    );
  } catch (e) {
    console.error("SAVE ERROR", e);
    return jsonRes({ message: "Save failed" }, 500);
  }
}