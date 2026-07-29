import { sameAs, site } from "@/lib/site";

/**
 * Structured data (schema.org JSON-LD) describing the site owner as an entity.
 *
 * This is the strongest on-page signal for ranking on a personal name: it tells
 * search engines "this domain represents the *person* Zuhayr Mahmood," links
 * that person to their verified profiles via `sameAs`, and makes the site
 * eligible for a knowledge panel. Rendered once in the root layout so it's
 * present on every page.
 *
 * The two nodes are cross-linked by `@id`: the WebSite is authored/published by
 * the Person. `@id` uses URL fragments on the canonical domain so the same
 * entity can be referenced from other pages later without duplication.
 */
export function JsonLd() {
  const personId = `${site.url}/#person`;
  const websiteId = `${site.url}/#website`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        url: site.url,
        jobTitle: site.jobTitle,
        // Only include when there are real profile URLs to point at.
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "en",
        author: { "@id": personId },
        publisher: { "@id": personId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; there is no user input here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
