// src/app/api/portfolio/public/[username]/route.js
import connectToDatabase from "@/lib/mongodb";
import Portfolio from "@/models/portfolio";

export async function GET(req, contextPromise) {
  try {
    const { params } = await contextPromise;
    const resolvedParams = await params;

    const username = resolvedParams?.username?.toLowerCase();

    if (!username) {
      return new Response(JSON.stringify({ message: "Username required" }), {
        status: 400,
      });
    }

    await connectToDatabase();

    const portfolio = await Portfolio.findOne({ username }).lean();

    if (!portfolio) {
      return new Response(JSON.stringify({ message: "Not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        name: portfolio.name || "",
        bio: portfolio.bio || "",
        profileImage: portfolio.profileImage?.url || "",
        aboutInfo: portfolio.aboutInfo || "",
        skills: portfolio.skills || [],
        projects: (portfolio.projects || []).map((p) => ({
          name: p.name || "",
          info: p.info || "",
          image: (typeof p.image === "string" && p.image) || (p.image && p.image.url) || "",
          link: p.link || "",
          github: p.github || "",
        })),
        contact: portfolio.contact || {},
        published: !!portfolio.published,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("PUBLIC PORTFOLIO ERROR:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}