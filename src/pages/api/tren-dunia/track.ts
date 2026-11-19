export const prerender = false;

import { incrementTrenDuniaClick, normalizeTrenWordType } from "../../../utils/trenDunia";

export const POST = async ({ request }: { request: Request }) => {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ ok: false, error: "Invalid body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { wordType: wtRaw, slug: slugRaw } = body as {
      wordType?: unknown;
      slug?: unknown;
    };

    const wordType = normalizeTrenWordType(String(wtRaw ?? ""));
    const slug = String(slugRaw ?? "").trim();

    if (!wordType || !slug || slug.length > 500) {
      return new Response(JSON.stringify({ ok: false, error: "Bad wordType or slug" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await incrementTrenDuniaClick(wordType, slug);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[tren-dunia/track]", e);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
