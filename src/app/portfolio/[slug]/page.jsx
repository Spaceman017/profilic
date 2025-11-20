import connectToDatabase from "@/lib/mongodb";
import Portfolio from "@/models/portfolio";

export async function generateMetadata({ params }) {
  return { title: `Portfolio · ${params.slug}` };
}

export default async function PortfolioPage({ params }) {
  const { slug } = params;
  await connectToDatabase();
  const portfolio = await Portfolio.findOne({ slug }).populate("owner", "fullName userName");

  if (!portfolio) return <div style={{ padding: 40 }}>Portfolio not found.</div>;

  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui" }}>
      <section style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1>{portfolio.title}</h1>
        <p>by {portfolio.owner?.fullName || portfolio.owner?.userName}</p>
        <p>{portfolio.bio}</p>

        <h2>Projects</h2>
        {portfolio.projects?.length ? (
          <ul>
            {portfolio.projects.map((p, i) => (
              <li key={i} style={{ marginBottom: 12 }}>
                <strong>{p.title}</strong>
                <p>{p.description}</p>
                {p.link && <a href={p.link} target="_blank" rel="noreferrer">{p.link}</a>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects yet.</p>
        )}

        <hr />
        <small>Generated on {new Date(portfolio.createdAt).toLocaleString()}</small>
      </section>
    </main>
  );
}
