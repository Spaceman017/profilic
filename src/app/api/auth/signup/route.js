// src/app/api/auth/signup/route.js
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    let { email, password, fullName, username } = body;

    if (!email || !password || !username) {
      return new Response(JSON.stringify({ message: "username, email, and password required" }), { status: 400 });
    }

    await connectToDatabase();

    username = username.trim().toLowerCase();

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      email: email.toLowerCase(),
      password: hashed,
      fullName: fullName || "",
      username,
      resetToken: null,
      portfolio: {
        name: "",
        bio: "",
        profileImage: "",
        profileImageId: "",

        info: "",

        skills: [],

        projects: [],

        background: "",

        contact: {
          email: "",
          phone: "",
          whatsapp: "",
          twitter: "",
          instagram: "",
          facebook: "",
        },
      },
      portfolioPublished: false,
    });

    await user.save();

    return new Response(JSON.stringify({ message: "User created successfully" }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Error creating user", error: err.message }), { status: 500 });
  }
}