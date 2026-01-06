const EXTERNAL = "https://orghans.pythonanywhere.com/api/purchases/";

function transformPurchase(raw: any) {
  const price = parseFloat(raw.product_price || "0");
  const discountedPrice = parseFloat(raw.product_discounted_price || "0");
  const finalPrice = discountedPrice > 0 ? discountedPrice : price;

  return {
    id: raw.id,
    external_id: raw.external_id,
    purchase_date: raw.purchase_date,
    purchase_month: String(raw.purchase_month),
    purchase_year: raw.purchase_year,
    province: raw.province,
    contact: raw.contact,
    status: raw.status,
    last_digits: raw.last_digits,
    shipping_address: raw.shipping_address,
    user: {
      id: raw.user_id,
      username: raw.user_username,
      first_name: raw.user_first_name,
      last_name: raw.user_last_name,
      email: raw.user_email,
      is_staff: raw.user_is_staff,
      is_active: raw.user_is_active,
      date_joined: raw.user_date_joined,
    },
    product: {
      id: raw.product_id,
      name: raw.product_name,
      description: raw.product_description,
      price: price,
      discounted_price: discountedPrice,
      is_available: raw.product_is_available,
      status: raw.product_status,
      category: raw.product_category,
      sku: raw.product_sku,
      stock: raw.product_stock,
      image_url: raw.product_image_url,
    },
  };
}

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

    const parsed = JSON.parse(text);
    const data = Array.isArray(parsed) ? parsed : [parsed];
    const transformed = data.map(transformPurchase);

    return new Response(JSON.stringify(transformed), {
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
