import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/writing";
import { getAllProjects } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...["/writing", "/projects", "/about"].map((path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  const posts = await getAllPosts();
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${site.url}/writing/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const projects = await getAllProjects();
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
    lastModified: new Date(`${project.date}T00:00:00`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
