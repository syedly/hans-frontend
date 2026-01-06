const EXTERNAL = "https://orghans.pythonanywhere.com/api/products/";

export async function GET() {
  try {
    console.log("Fetching from:", EXTERNAL);

    const res = await fetch(EXTERNAL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "NextJS-Client",
      },
    });

    const text = await res.text();
    const contentType = res.headers.get("content-type") || "";

    console.log("Upstream status:", res.status);
    console.log("Upstream content-type:", contentType);
    console.log("First 200 chars:", text.slice(0, 200));

    if (!res.ok || !contentType.includes("application/json")) {
      try {
        JSON.parse(text);
      } catch {
        return new Response(
          JSON.stringify({
            error: "Upstream error",
            status: res.status,
            contentType,
            preview: text.slice(0, 500),
          }),
          {
            status: 502,
            headers: { "content-type": "application/json" },
          }
        );
      }
    }

    return new Response(text, {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return new Response(
      JSON.stringify({
        error: "Fetch failed",
        details: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 502,
        headers: { "content-type": "application/json" },
      }
    );
  }
}
