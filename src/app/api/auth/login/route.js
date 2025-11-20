// src/app/api/auth/login/route.js
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function getCookieHeader(token) {
  const maxAge = 7 * 24 * 60 * 60;
  return `token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export async function POST(req) {
  try {
    const { emailOrUsername, password } = await req.json();

    if (!emailOrUsername || !password) {
      return new Response(JSON.stringify({ message: "Missing credentials" }), { status: 400 });
    }

    await connectToDatabase();

    const query = { $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername.toLowerCase() }] };
    const user = await User.findOne(query);

    if (!user) return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return new Response(JSON.stringify({ message: "Logged in", success: true }), {
      status: 200,
      headers: { "Set-Cookie": getCookieHeader(token) },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return new Response(JSON.stringify({ message: "Login failed", error: err.message }), { status: 500 });
  }
}