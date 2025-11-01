// Cloudflare Pages Functions: GET /api/nonce
export async function onRequestGet() {
  // 32byte ランダム値を hex 文字列で返す
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  const nonce = [...buf].map(b => b.toString(16).padStart(2, "0")).join("");

  return new Response(JSON.stringify({ nonce }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
