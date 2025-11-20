import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();
    const { oldPassword, newPassword, authToken } = body;

    const jwtToken = authToken || (req.cookies && req.cookies.token);
    if (!jwtToken) return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });

    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
    await connectToDatabase();
    const user = await User.findById(payload.userId);
    if (!user) return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return new Response(JSON.stringify({ message: "Old password incorrect" }), { status: 401 });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return new Response(JSON.stringify({ message: "Password changed" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Error", error: err.message }), { status: 500 });
  }
}
