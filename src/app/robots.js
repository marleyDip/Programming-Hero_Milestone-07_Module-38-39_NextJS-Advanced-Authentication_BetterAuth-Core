import { siteConfig } from "@/lib/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/sign-in", "/sign-up"],
      },
    ],

    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
