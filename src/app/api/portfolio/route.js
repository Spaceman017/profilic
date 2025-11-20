// src/app/api/portfolio/route.js
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import jwt from "jsonwebtoken";

async function getTokenFromReq(req) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
  if (match) return match[1];
  const auth = req.headers.get("authorization") || "";
  if (auth.startsWith("Bearer ")) return auth.split(" ")[1];
  return null;
}

export async function POST(req) {
  try {
    const token = await getTokenFromReq(req);
    if (!token) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
    }

    const body = await req.json();

    await connectToDatabase();
    const user = await User.findById(decoded.userId);
    if (!user) return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });

    // Overwrite portfolio fields (we only accept a safe subset)
    const safe = {};
    if (typeof body.name === "string") safe["portfolio.name"] = body.name;
    if (typeof body.bio === "string") safe["portfolio.bio"] = body.bio;
    if (typeof body.profileImage === "string") safe["portfolio.profileImage"] = body.profileImage;
    if (typeof body.profileImageId === "string") safe["portfolio.profileImageId"] = body.profileImageId;
    if (typeof body.info === "string") safe["portfolio.info"] = body.info;
    if (Array.isArray(body.skills)) safe["portfolio.skills"] = body.skills;
    if (Array.isArray(body.projects)) safe["portfolio.projects"] = body.projects;
    if (typeof body.background === "string") safe["portfolio.background"] = body.background;
    if (body.contact && typeof body.contact === "object") safe["portfolio.contact"] = body.contact;
    if (typeof body.portfolioPublished === "boolean") safe.portfolioPublished = body.portfolioPublished;

    await User.findByIdAndUpdate(user._id, { $set: safe }, { new: true });

    return new Response(JSON.stringify({ message: "Portfolio saved", link: `/p/${user.username}`, slug: user.username }), { status: 200 });
  } catch (err) {
    console.error("SAVE PORTFOLIO ERROR:", err);
    return new Response(JSON.stringify({ message: "Server error", error: err.message }), { status: 500 });
  }
}