import type { MetadataRoute } from "next";

const BASE = "https://thewellnesslondon.com/facesculpt";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/workouts`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/membership`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/assessment`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
