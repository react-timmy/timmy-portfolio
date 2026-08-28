const http = require("node:http");

const PORT = Number(process.env.PORT || 4174);

const STATIC_TWEETS = [
  {
    id: "1",
    content:
      "The best builders I know aren't the ones waiting for the perfect idea. They're shipping, learning, and adjusting in public. Start small. Stay consistent. The compound effect hits different.",
    date: "Jul 2025",
    likes: 84,
    reposts: 22,
    views: "4.1K",
  },
  {
    id: "2",
    content:
      "InfoFi is the quiet layer of crypto most people sleep on. You contribute signal - analysis, content, attention - and the protocol rewards you for it. We're early. Like, very early.",
    date: "Jun 2025",
    likes: 61,
    reposts: 14,
    views: "2.8K",
  },
  {
    id: "3",
    content:
      "Bless Network just dropped leaderboard season results. Being in the top % as a solo content contributor with zero bots, zero engagement farms - that's the kind of win that feels real.",
    date: "Jun 2025",
    likes: 47,
    reposts: 9,
    views: "1.9K",
  },
  {
    id: "4",
    content:
      "ZK proofs for identity aren't just a tech problem - they're a trust problem. Billions Network is building the infrastructure to prove you're human without revealing who you are. That's the future.",
    date: "May 2025",
    likes: 73,
    reposts: 18,
    views: "3.3K",
  },
  {
    id: "5",
    content:
      "Built my first React Native screen in 2023. Shipped a full Android app with TMDB integration, Gemini AI fallback, and offline-first architecture in 2024. The gap between idea and ability collapses fast when you're consistent.",
    date: "May 2025",
    likes: 112,
    reposts: 31,
    views: "6.2K",
  },
  {
    id: "6",
    content:
      "Open AGI shouldn't be controlled by three companies. Sentient AGI is betting on a different future - open, verifiable, decentralized research. Following closely and building in that direction.",
    date: "Apr 2025",
    likes: 55,
    reposts: 11,
    views: "2.1K",
  },
];

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        req.destroy();
        reject(new Error("request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function decodeHtmlEntities(text) {
  return String(text || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function extractMeta(html) {
  const result = {};
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) result.title = titleMatch[1].trim();

  const metaRegex = /<meta\s+(?:property|name)=["']([^"']+)["']\s+content=["']([^"']*)["'][^>]*>/gi;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    result[match[1].toLowerCase()] = match[2];
  }

  let description = result["og:description"] || result["twitter:description"] || result.description || "";
  let title = description || result["og:title"] || result["twitter:title"] || result.title || "";
  const image = result["og:image"] || result["twitter:image"] || result.image || "";

  title = decodeHtmlEntities(title)
    .replace(/^[\u0022\u0027\u2018\u2019\u201C\u201D\u00AB\u00BB\u201E\u201F\s]+/, "")
    .replace(/[\u0022\u0027\u2018\u2019\u201C\u201D\u00AB\u00BB\u201E\u201F\s]+$/, "");

  if (title.includes(" on X")) title = title.split(" on X")[0].trim();
  if (title.includes("(@_devTimmy)")) {
    title = title.replace("𝗧𝗜𝗠𝗠¥ (@_devTimmy)", "").replace("TIMM¥ (@_devTimmy)", "").trim();
  }

  if (!description || description.length < 100) {
    const scriptMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/gi) || [];
    for (const script of scriptMatches) {
      const jsonMatch = script.match(/>([^<]+)<\/script>/);
      if (!jsonMatch) continue;
      try {
        const jsonData = JSON.parse(jsonMatch[1]);
        const candidates = [jsonData.description, jsonData.text, jsonData.articleBody].filter(Boolean);
        for (const candidate of candidates) {
          if (candidate.length > description.length) description = candidate;
        }
      } catch {}
    }

    if (!description || description.length < 100) {
      const tweetMatch =
        html.match(/data-testid=["']tweet["'][^>]*>[\s\S]*?<div[^>]*lang=["'][^"']*["'][^>]*>([^<]+)<\/div>/i) ||
        html.match(/class=["'][^"]*tweet[^"]*["'][^>]*>[\s\S]*?<span>([^<]{50,}?)<\/span>/i);
      if (tweetMatch?.[1]) description = tweetMatch[1].trim();
    }

    if (!description || description.length < 100) {
      const cleanHtml = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "");

      const text = cleanHtml
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .replace(/Log in|Sign up|Post|Share|Like|Reply|Repost/gi, "")
        .replace(/𝗧𝗜𝗠𝗠¥|TIMM¥|@_devTimmy|\(@_devTimmy\)/g, "")
        .replace(/on X:|on Twitter:/gi, "")
        .replace(/\s+/g, " ")
        .trim();

      if (text.length > 100) description = text.substring(0, 400).trim();
    }
  }

  if (description) {
    description = description
      .replace(/Log in|Sign up|Post|Share|Like|Reply|Repost/gi, "")
      .replace(/on X:|on Twitter:/gi, "")
      .replace(/\/ X Post/gi, "")
      .replace(/["']?\s*\/\s*X\s*["']?/gi, "")
      .replace(/https:\/\/t\.co\/[A-Za-z0-9]+/g, "")
      .replace(/[ \t]+/g, " ")
      .trim()
      .replace(/^["'"'""„‟\s]+/, "");
  }

  const likeMatch =
    html.match(/"like_count"\s*:\s*(\d+)/i) ||
    html.match(/"favorite_count"\s*:\s*(\d+)/i) ||
    html.match(/"likeCount"\s*:\s*(\d+)/i);
  const visibleMatch =
    html.match(/>([0-9][0-9,.]{0,6})<[^>]*>\s*(?:Likes|likes|Like)/i) ||
    html.match(/Likes?\W*([0-9][0-9,.]{0,6})/i);
  const likes = likeMatch
    ? parseInt(likeMatch[1].replace(/,/g, ""), 10) || 0
    : parseInt((visibleMatch?.[1] || "0").replace(/[,.]/g, ""), 10) || 0;

  return {
    title: decodeHtmlEntities(title).trim(),
    description: decodeHtmlEntities(description).trim().substring(0, 500),
    image: image.trim(),
    likes,
  };
}

async function handleFetchMeta(req, res) {
  try {
    const body = await readJson(req);
    const urls = Array.isArray(body.urls) ? body.urls : [];
    if (!urls.length) return sendJson(res, 400, { ok: false, error: "no urls" });

    const results = await Promise.all(
      urls.map(async (urlValue) => {
        try {
          const url = new URL(urlValue, "https://example.com").toString();
          const response = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; FetchMeta/1.0; +https://example.com)",
            },
          });
          if (!response.ok) return { url: urlValue, title: "", description: "", image: "", likes: 0 };

          const meta = extractMeta(await response.text());
          return {
            url: urlValue,
            title: meta.title || "",
            description: meta.description || "",
            image: meta.image || "",
            likes: meta.likes || 0,
          };
        } catch {
          return { url: urlValue, title: "", description: "", image: "", likes: 0 };
        }
      })
    );

    return sendJson(res, 200, { ok: true, results });
  } catch (error) {
    console.error("/api/fetch-meta error", error);
    return sendJson(res, 500, { ok: false, error: "server error" });
  }
}

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

async function handleTweets(_req, res) {
  const bearerToken = process.env.X_BEARER_TOKEN;
  if (!bearerToken) return sendJson(res, 200, { tweets: STATIC_TWEETS, source: "static" });

  try {
    const userRes = await fetch("https://api.twitter.com/2/users/by/username/_devTimmy", {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    if (!userRes.ok) throw new Error(`User lookup failed: ${userRes.status}`);

    const userData = await userRes.json();
    const userId = userData.data?.id;
    if (!userId) throw new Error("User ID not found");

    const tweetsRes = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&exclude=retweets,replies&tweet.fields=created_at,public_metrics&expansions=author_id`,
      { headers: { Authorization: `Bearer ${bearerToken}` } }
    );
    if (!tweetsRes.ok) throw new Error(`Tweets fetch failed: ${tweetsRes.status}`);

    const tweetsData = await tweetsRes.json();
    if (!tweetsData.data?.length) return sendJson(res, 200, { tweets: STATIC_TWEETS, source: "static" });

    const tweets = tweetsData.data.map((tweet) => ({
      id: tweet.id,
      content: tweet.text,
      date: formatDate(tweet.created_at),
      likes: tweet.public_metrics?.like_count ?? 0,
      reposts: tweet.public_metrics?.retweet_count ?? 0,
      views: formatCount(tweet.public_metrics?.impression_count ?? 0),
    }));

    return sendJson(res, 200, { tweets, source: "live" });
  } catch (error) {
    console.error("[/api/tweets] X API error, using static fallback:", error);
    return sendJson(res, 200, { tweets: STATIC_TWEETS, source: "static" });
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return sendJson(res, 204, {});

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  if (req.method === "POST" && url.pathname === "/api/fetch-meta") return handleFetchMeta(req, res);
  if (req.method === "GET" && url.pathname === "/api/tweets") return handleTweets(req, res);
  if (req.method === "GET" && url.pathname === "/api/health") return sendJson(res, 200, { ok: true });

  return sendJson(res, 404, { ok: false, error: "not found" });
});

server.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
