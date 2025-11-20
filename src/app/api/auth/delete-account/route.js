// src/app/api/auth/delete-account/route.js
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import cloudinary from "@/lib/cloudinary";
import { verifyUser } from "@/lib/auth"; // ✅ correct import

export async function POST(req) {
  try {
    await connectToDatabase();

    // 🔑 Get authenticated user (replaces getUserIdFromRequest)
    const user = await verifyUser(req);

    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = user._id;

    const foundUser = await User.findById(userId).lean();

    if (!foundUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Collect Cloudinary IDs
    const ids = [];

    if (foundUser.portfolio?.profileImageId)
      ids.push(foundUser.portfolio.profileImageId);

    foundUser.portfolio?.projects?.forEach((p) => {
      if (p.imageId) ids.push(p.imageId);
    });

    // Delete images (best-effort)
    await Promise.all(
      ids.map((id) =>
        cloudinary.uploader.destroy(id, { resource_type: "image" }).catch(() => {})
      )
    );

    // Delete account
    await User.findByIdAndDelete(userId);

    return new Response(JSON.stringify({ message: "Account deleted" }), {
      status: 200,
      headers: {
        "Set-Cookie": "token=; Max-Age=0; Path=/; HttpOnly",
      },
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: err.message === "No token" ? 401 : 500,
    });
  }
}
