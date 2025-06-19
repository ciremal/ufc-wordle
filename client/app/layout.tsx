import type { Viewport, Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import { GoogleAnalytics } from "@next/third-parties/google";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBE9D0",
};

export const metadata: Metadata = {
  title: "UFClue",
  description:
    "Test your knowledge of UFC fighters with UFClue. A Wordle inspired game, guess dfaily fighters by their stats like MMA record, division, and more!",
  keywords: [
    "ufc",
    "UFC",
    "wordle",
    "fighter",
    "mma",
    "MMA",
    "fighter guessing game",
    "guessing game",
    "sports",
    "trivia",
    "sports trivia",
  ],
  openGraph: {
    url: "https://ufc-wordle.vercel.app",
    type: "website",
    locale: "en_US",
    title: "UFClue",
    description:
      "Test your knowledge of UFC fighters with UFClue. A Wordle inspired game, guess dfaily fighters by their stats like MMA record, division, and more!",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "UFClue",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UFClue - A UFC Fighter Guessing Game",
    description:
      "Test your knowledge of UFC fighters with UFClue. A Wordle inspired game, guess dfaily fighters by their stats like MMA record, division, and more!",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "UFClue",
      },
    ],
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },
  alternates: {
    canonical: "https://ufc-wordle.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "WebSite",
              name: "UFClue",
              url: "https://ufc-wordle.vercel.app/",
              potentialAction: {
                "@type": "SearchAction",
                target: "{search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        ></script>
      </Head>
      <body
        className={`${spaceGrotesk.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
      {/* <GoogleAnalytics gaId="G-QWY1FDBMT7" /> */}
    </html>
  );
}
