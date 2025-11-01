// Cloudflare Pages Functions: POST /api/sign
// body: { address: string, qty: number, deadline: number, nonce: string }
import { ethers } from "ethers";

function isAddr(x) {
  try { return ethers.utils.getAddress(x), true; } catch { return false; }
}

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  if (!env.PRIVATE_KEY) {
    return new Response(JSON.stringify({ error: "PRIVATE_KEY missing" }), { status: 500 });
  }

  const { address, qty, deadline, nonce } = await request.json().catch(() => ({}));

  if (!isAddr(address)) {
    return new Response(JSON.stringify({ error: "invalid address" }), { status: 400 });
  }
  if (!Number.isInteger(qty) || qty <= 0) {
    return new Response(JSON.stringify({ error: "invalid qty" }), { status: 400 });
  }
  if (!Number.isInteger(deadline) || deadline <= 0) {
    return new Response(JSON.stringify({ error: "invalid deadline" }), { status: 400 });
  }
  if (typeof nonce !== "string" || nonce.length === 0) {
    return new Response(JSON.stringify({ error: "invalid nonce" }), { status: 400 });
  }

  // 任意のメッセージ設計（EIP-191 署名）
  // hash = keccak256( address, qty, deadline, nonce )
  const hash = ethers.utils.solidityKeccak256(
    ["address", "uint256", "uint256", "bytes32"],
    [address, qty, deadline, ethers.utils.hexZeroPad("0x" + nonce.replace(/^0x/i, ""), 32)]
  );

  const wallet = new ethers.Wallet(env.PRIVATE_KEY);
  const signature = await wallet.signMessage(ethers.utils.arrayify(hash));

  return new Response(JSON.stringify({ hash, signature }), {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}
