# tafdog-pages-starter

Cloudflare Pages + Functions 最小構成。

## 構成
- public/index.html  … Wallet接続とAPIテスト
- public/mint.html   … コントラクト検証とミント候補呼び出し
- functions/api/nonce.ts … ノンス発行 (KV 必須)
- functions/api/sign.ts  … HMAC署名 (AL_SALT 必須)

## Cloudflare 設定
1) Workers & Pages → KV → 名前空間作成: `nonces`
2) Pages → 設定 → バインディング → 追加(KV): Variable `NONCE_KV` → Namespace `nonces`
3) Pages → 設定 → 変数とシークレット → 追加: `AL_SALT`（ランダム長文）
4) GitHubへプッシュして再デプロイ

## 注意
- iPhoneはMetaMaskアプリ内ブラウザで動作確認
- CONTRACT アドレスは mint.html 内で変更可能
