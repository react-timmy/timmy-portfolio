import { NextResponse } from "next/server";

export const revalidate = 0;

/**
 * Fetch tweet data via the public oEmbed endpoint (no auth required).
 *
 * Returns { title, description, image, likes } where:
 *   - description = tweet text (stripped of HTML tags and trailing attribution)
 *   - image       = first photo URL found via the syndication API
 *   - title       = author_name from oEmbed
 */
async function fetchOembed(tweetUrl: string): Promise<{
  title: string;
  description: string;
  image: string;
  likes: number;
}> {
  const endpoint =
    "https://publish.twitter.com/oembed?" +
    new URLSearchParams({
      url: tweetUrl,
      omit_script: "true",
      dnt: "true",
    }).toString();

  const response = await fetch(endpoint, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; FetchMeta/1.0)" },
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`oEmbed responded ${response.status} for ${tweetUrl}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await response.json();

  // data.html is the embeddable blockquote HTML — extract the tweet text from it
  const embedHtml: string = data.html || "";

  // Strip all HTML tags to get plain tweet text
  // First, preserve line breaks by converting <br> and </p> to newlines
  let description = embedHtml
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<a[^>]*href="https?:\/\/t\.co\/[^"]*"[^>]*>.*?<\/a>/gi, "") // strip t.co links
    .replace(/<br\s*\/?>/gi, "\n") // convert <br> to newline
    .replace(/<\/p>/gi, "\n\n") // convert </p> to double newline
    .replace(/<[^>]+>/g, "") // strip remaining HTML tags
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n") // collapse 3+ newlines to 2
    .replace(/ +/g, " ") // collapse multiple spaces to single space
    .trim();

  // Strip trailing "— AuthorName (@handle) Month DD, YYYY" attribution added by oEmbed
  description = description
    .replace(/—\s*.+?\(@[^)]+\)\s+\w+ \d+, \d{4}\s*$/, "")
    .trim();
  // Also strip a bare trailing date like "July 15, 2025"
  description = description.replace(/\b\w+ \d{1,2}, \d{4}\s*$/, "").trim();

  const title: string = data.author_name || "";

  // Try to find an image in the embed HTML first
  let image = "";
  const imgMatch =
    embedHtml.match(/https:\/\/pbs\.twimg\.com\/[^\s"'<>]+(?:\.jpg|\.png|\.webp)/i) ||
    embedHtml.match(/https:\/\/pic\.twitter\.com\/[^\s"'<>]+/i);
  if (imgMatch) image = imgMatch[0];

  // If no inline image, call the syndication API (no auth, best-effort)
  if (!image) {
    try {
      const idMatch = tweetUrl.match(/\/status\/(\d+)/);
      if (idMatch) {
        const tweetId = idMatch[1];
        const syndicationUrl =
          `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}` +
          `&lang=en&features=tfw_timeline_list%3A%3Btfw_follower_count_sunset%3Atrue&token=x`;

        const synRes = await fetch(syndicationUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; FetchMeta/1.0)" },
          next: { revalidate: 3600 },
        });

        if (synRes.ok) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const synData: any = await synRes.json();

          // Photos live at tweet.photos[].url or tweet.mediaDetails[].media_url_https
          const photos: Array<{ url?: string; media_url_https?: string }> =
            synData?.photos ||
            (synData?.mediaDetails ?? []).filter(
              (m: { type: string }) => m.type === "photo"
            );

          if (photos.length > 0) {
            image = photos[0].url ?? photos[0].media_url_https ?? "";
          }

          // Use tweet text if description is still sparse
          if (!description && synData?.text) {
            description = (synData.text as string)
              .replace(/https:\/\/t\.co\/\S+/g, "")
              .trim();
          }
        }
      }
    } catch {
      // Syndication is best-effort — silently ignore failures
    }
  }

  return { title, description: description.substring(0, 500), image, likes: 0 };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const urls: string[] = Array.isArray(body.urls) ? body.urls : [];
    if (!urls.length)
      return NextResponse.json({ ok: false, error: "no urls" }, { status: 400 });

    const results = await Promise.all(
      urls.map(async (u) => {
        try {
          const meta = await fetchOembed(u);
          return {
            url: u,
            title: meta.title,
            description: meta.description,
            image: meta.image,
            likes: meta.likes,
          };
        } catch (err) {
          console.error(`[fetch-meta] fetchOembed failed for ${u}:`, err);
          return { url: u, title: "", description: "", image: "", likes: 0 };
        }
      })
    );

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error("/api/fetch-meta error", err);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}
