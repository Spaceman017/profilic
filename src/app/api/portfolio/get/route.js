import connectToDatabase from "@/lib/mongodb";
import Portfolio from "@/models/portfolio";
import { verifyUser } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await verifyUser(req);
    if (!user)
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });

    await connectToDatabase();

    const data = await Portfolio.findOne({ userId: user._id }).lean();

    if (!data) {
      return new Response(
        JSON.stringify({
          username: user.username.toLowerCase(),
          name: "",
          bio: "",
          profileImage: "",
          profileImageId: "",
          aboutInfo: "",
          skills: [],
          projects: [],
          contact: {},
          published: false,
        }),
        { status: 200 }
      );
    }

    const sanitized = {
      username: data.username,
      name: data.name || "",
      bio: data.bio || "",
      profileImage: data.profileImage?.url || "",
      profileImageId:
        data.profileImage?.public_id || data.profileImageId || "",
      aboutInfo: data.aboutInfo || "",
      skills: Array.isArray(data.skills) ? data.skills : [],
      projects: Array.isArray(data.projects)
        ? data.projects.map((p) => ({
            name: p.name || "",
            info: p.info || "",
            image: p.image || "",
            imageId: p.imageId || "",
          }))
        : [],
      contact: data.contact || {},
      published: !!data.published,
    };

    return new Response(JSON.stringify(sanitized), { status: 200 });
  } catch (err) {
    console.error("GET PORTFOLIO ERROR:", err);
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      { status: 500 }
    );
  }
}