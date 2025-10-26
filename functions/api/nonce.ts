// /functions/api/nonce.ts
export interface Env { NONCE_KV: KVNamespace; }
export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const { address } = await request.json<any>().catch(()=>({}));
  if (!address) return new Response('bad request',{status:400});
  const nonce = crypto.randomUUID();
  await env.NONCE_KV.put(`nonce:${address.toLowerCase()}`, nonce, { expirationTtl: 300 });
  return Response.json({ nonce });
};
