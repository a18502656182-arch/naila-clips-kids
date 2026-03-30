// pages/api/cf-stream.js
export default async function handler(req, res) {
  const { account_id, page = 1 } = req.query;
  const token = req.headers["x-cf-token"];

  if (!account_id || !token) {
    return res.status(400).json({ error: "missing account_id or token" });
  }

  const cfRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account_id}/stream?per_page=100&page=${page}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = await cfRes.json();
  return res.status(cfRes.status).json(data);
}
