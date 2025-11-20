// src/app/api/auth/reset-password/route.js

import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return new Response(
        JSON.stringify({ message: "Token and new password required" }),
        { status: 400 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return new Response(
        JSON.stringify({ message: "User no longer exists" }),
        { status: 404 }
      );
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(decoded.userId, { password: hashed });

    return new Response(
      JSON.stringify({ message: "Password updated successfully!" }),
      { status: 200 }
    );

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return new Response(
      JSON.stringify({ message: "Server error", error: err.message }),
      { status: 500 }
    );
  }
}