import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/search?q=", "/admin/"],
    },
    sitemap: ["https://ufc-wordle.vercel.app/sitemap.xml"],
  };
}
