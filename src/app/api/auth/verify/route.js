export async function GET(req) {
  return new Response(JSON.stringify({ message: "Email verification is not required in this version." }), { status: 200 });
}
