import { n as normalizeTrenWordType, i as incrementTrenDuniaClick } from './trenDunia_BYov0Uub.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ ok: false, error: "Invalid body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { wordType: wtRaw, slug: slugRaw } = body;
    const wordType = normalizeTrenWordType(String(wtRaw ?? ""));
    const slug = String(slugRaw ?? "").trim();
    if (!wordType || !slug || slug.length > 500) {
      return new Response(JSON.stringify({ ok: false, error: "Bad wordType or slug" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await incrementTrenDuniaClick(wordType, slug);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    console.error("[tren-dunia/track]", e);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
