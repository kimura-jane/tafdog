export interface Env { NONCE_KV: KVNamespace; AL_SALT: string; }
const b64url = (buf: ArrayBuffer) => {
  let s=''; const a=new Uint8Array(buf); for (let i=0;i<a.length;i++) s+=String.fromCharCode(a[i]);
  return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/, '');
};
export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const { address } = await request.json<any>().catch(()=>({}));
  if (!address) return new Response('bad request',{status:400});
  const key = `nonce:${address.toLowerCase()}`;
  const nonce = await env.NONCE_KV.get(key);
  if (!nonce) return new Response('nonce missing',{status:400});
  const cryptoKey = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(env.AL_SALT),
    { name:'HMAC', hash:'SHA-256' }, false, ['sign']
  );
  const data = new TextEncoder().encode(`${address.toLowerCase()}:${nonce}`);
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, data);
  await env.NONCE_KV.delete(key);
  return Response.json({ signature: b64url(sig) });
};
