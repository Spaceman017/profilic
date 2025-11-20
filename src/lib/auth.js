// src/lib/auth.js
import jwt from "jsonwebtoken";
import User from "@/models/user";
import connectToDatabase from "@/lib/mongodb";

export async function verifyUser(req) {
  try {
    await connectToDatabase();

    // Next.js Request cookie access in route handlers:
    // If using Next Request object with cookies: req.cookies.get("token")?.value
    // Some environments use req.headers.cookie string; adjust if necessary.
    const token = req.cookies?.get?.("token")?.value || (req.headers?.cookie || "").split("; ").find((c) => c.startsWith("token="))?.split("=")[1];

    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id && !decoded?.userId) return null;

    const userId = decoded.id || decoded.userId;
    const user = await User.findById(userId).lean();
    return user || null;
  } catch (err) {
    console.error("verifyUser ERROR:", err?.message || err);
    return null;
  }
}