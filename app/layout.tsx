import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://solo-devtimmy.vercel.app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Cole Sustain Timmy | AI-first FullStack Developer",
    template: "%s | Cole Sustain Timmy | AI-first FullStack Developer",
  },
  description:
    "I am an Full-Stack developer that builds practical web and mobile app ideas from concept to production. Prompt-to-Stack Builder, Mobile Developer, and Content Creator",
  keywords: [
    "Cole Sustain Timmy",
    "full-stack developer",
    "AI developer",
    "React Native developer",
    "Next.js developer",
    "web developer Nigeria",
    "AI-powered web and mobile applications",
    "FilmSort",
    "devTimmy",
    "_devTimmy",
  ],
  authors: [{ name: "Cole Sustain Timmy", url: "https://x.com/_devTimmy" }],
  creator: "Cole Sustain Timmy",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "Cole Sustain Timmy | AI-first FullStack Developer",
    description:
      "I am an Full-Stack developer that builds practical web and mobile app ideas from concept to production. Prompt-to-Stack Builder, Mobile Developer, and Content Creator",
    siteName: "Cole Sustain Timmy | AI-first FullStack Developer",
    images: [
      {
        url: `${BASE_URL}/timmy_pfp-modified.png`,
        width: 1200,
        height: 630,
        alt: "Cole Sustain Timmy | AI-first FullStack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@_devTimmy",
    creator: "@_devTimmy",
    title: "Cole Sustain Timmy | AI-first FullStack Developer",
    description:
      "I am an Full-Stack developer that builds practical web and mobile app ideas from concept to production. Prompt-to-Stack Builder, Mobile Developer, and Content Creator",
    images: [`${BASE_URL}/timmy_pfp-modified.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <meta name="google-site-verification" content="Z1dN3MwWGovirMrzNwY60G3ZTP6hdfBlDL5zIdtyeXs" />
        <meta name="description" content="I am an Full-Stack developer that builds practical web and mobile app ideas from concept to production. Prompt-to-Stack Builder, Mobile Developer, and Content Creator" />
        <meta name="keywords" content="Cole Sustain Timmy, dev timmy, devTimmy, full-stack developer, AI developer, Next.js, React Native, TypeScript, portfolio" />
        <meta name="author" content="Cole Sustain Timmy" />
        <link rel="canonical" href={BASE_URL} />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cole Sustain Timmy | AI-first FullStack Developer" />
        <meta property="og:description" content="Full-stack AI developer building practical web and mobile products from concept to production." />
        <meta property="og:url" content={BASE_URL} />
        <meta property="og:image" content={`${BASE_URL}/timmy_pfp-modified.png`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@_devTimmy" />

        {/* Structured Data (Person) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Cole Sustain Timmy",
              alternateName: ["dev timmy", "devTimmy", "Timmy"],
              url: BASE_URL,
              jobTitle: "AI-first FullStack Developer",
              sameAs: [
                "https://x.com/_devTimmy",
                "https://github.com/devtimmy",
                "https://www.linkedin.com/in/devtimmy"
              ]
            }),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-[#000000] text-[#ffffff] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
