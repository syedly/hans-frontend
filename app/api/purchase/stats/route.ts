const EXTERNAL = "https://orghans.pythonanywhere.com/api/purchase/stats/";

export async function GET() {
  try {
    const res = await fetch(EXTERNAL, { headers: { Accept: "application/json" } });
    const text = await res.text();
    const contentType = res.headers.get("content-type") || "";
    if (!res.ok || !contentType.includes("application/json")) {
      return new Response(JSON.stringify({ error: "Upstream error", status: res.status, preview: text.slice(0, 500) }), { status: 502, headers: { "content-type": "application/json" } });
    }
    // Return the JSON from upstream directly
    return new Response(text, { status: 200, headers: { "content-type": "application/json" } });
  } catch (err) {
    console.error("Stats proxy error:", err);
    return new Response(JSON.stringify({ error: "Fetch failed", details: String(err) }), { status: 502, headers: { "content-type": "application/json" } });
  }
}
