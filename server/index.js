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

/**
 * Fetch tweet data via the public oEmbed endpoint (no auth required).
 * Returns { title, description, image, likes } where:
 *   - description = tweet text (stripped of HTML)
 *   - image       = first pic.twitter.com/… or pbs.twimg.com image found in the embed HTML
 *   - title       = author name
 */
async function fetchOembed(tweetUrl) {
  const endpoint =
    "https://publish.twitter.com/oembed?" +
    new URLSearchParams({
      url: tweetUrl,
      omit_script: "true",
      dnt: "true",
    }).toString();

  const response = await fetch(endpoint, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; FetchMeta/1.0)" },
    // Allow up to 8 seconds per request
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`oEmbed responded ${response.status} for ${tweetUrl}`);
  }

  const data = await response.json();

  // data.html is the embeddable blockquote HTML — extract the tweet text from it
  const embedHtml = data.html || "";

  // Strip all HTML tags to get plain tweet text
  let description = embedHtml
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<a[^>]*href="https?:\/\/t\.co\/[^"]*"[^>]*>.*?<\/a>/gi, "") // remove t.co links
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  // The oEmbed html ends with "— AuthorName (@handle) Date" — strip that trailing attribution
  description = description.replace(/—\s*.+?\(@[^)]+\)\s+\w+ \d+, \d{4}\s*$/, "").trim();
  // Also strip a standalone trailing date like "July 15, 2025"
  description = description.replace(/\b\w+ \d{1,2}, \d{4}\s*$/, "").trim();

  // author_name from oEmbed (e.g. "TIMM¥")
  const title = data.author_name || "";

  // Try to extract an image URL from the embed HTML.
  // oEmbed HTML itself rarely includes images inline, but the tweet URL can be
  // resolved to a card image via a second oEmbed call with maxwidth for rich format.
  // As a practical fallback we look for pbs.twimg.com URLs embedded in the HTML.
  let image = "";
  const imgMatch =
    embedHtml.match(/https:\/\/pbs\.twimg\.com\/[^\s"'<>]+(?:\.jpg|\.png|\.webp)/i) ||
    embedHtml.match(/https:\/\/pic\.twitter\.com\/[^\s"'<>]+/i);
  if (imgMatch) image = imgMatch[0];

  // If no inline image was found, attempt a syndication API call which returns
  // tweet card data including photo URLs (no auth required, best-effort).
  if (!image) {
    try {
      // Extract tweet ID from URL (handles /status/NNNN and /status/NNNN?s=20 etc.)
      const idMatch = tweetUrl.match(/\/status\/(\d+)/);
      if (idMatch) {
        const tweetId = idMatch[1];
        const syndicationUrl = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en&features=tfw_timeline_list%3A%3Btfw_follower_count_sunset%3Atrue&token=x`;
        const synRes = await fetch(syndicationUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; FetchMeta/1.0)" },
          signal: AbortSignal.timeout(6000),
        });
        if (synRes.ok) {
          const synData = await synRes.json();
          // Photos live at tweet.photos[].url or tweet.mediaDetails[].media_url_https
          const photos =
            synData?.photos ||
            synData?.mediaDetails?.filter((m) => m.type === "photo") ||
            [];
          if (photos.length > 0) {
            image = photos[0].url || photos[0].media_url_https || "";
          }
          // Use tweet full_text if description is still empty
          if (!description && synData?.text) {
            description = synData.text.replace(/https:\/\/t\.co\/\S+/g, "").trim();
          }
        }
      }
    } catch {
      // Syndication is best-effort — silently ignore failures
    }
  }

  return { title, description: description.substring(0, 500), image, likes: 0 };
}

async function handleFetchMeta(req, res) {
  try {
    const body = await readJson(req);
    const urls = Array.isArray(body.urls) ? body.urls : [];
    if (!urls.length) return sendJson(res, 400, { ok: false, error: "no urls" });

    const results = await Promise.all(
      urls.map(async (urlValue) => {
        try {
          const meta = await fetchOembed(urlValue);
          return {
            url: urlValue,
            title: meta.title || "",
            description: meta.description || "",
            image: meta.image || "",
            likes: meta.likes || 0,
          };
        } catch (err) {
          console.error(`fetchOembed failed for ${urlValue}:`, err.message);
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

server.listen(PORT, "0.0.0.0", () => {
  console.log(`API server listening on http://0.0.0.0:${PORT}`);
});
