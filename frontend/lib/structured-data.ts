import { Metadata } from "next";

type JsonLd = Record<string, unknown>;

export function jsonLd(data: JsonLd): Metadata {
  return {
    other: {
      "script:ld+json": JSON.stringify(data),
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Évangéliste Ahongan Komlavi",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
    description: "Ministère Évangélique basé à Lomé, Togo",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+228-90-87-78-55",
        contactType: "Ministry contact",
      },
    ],
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Évangéliste Ahongan Komlavi",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
    description: "Site de l'évangéliste Ahongan Komlavi - Ministère Évangélique",
    inLanguage: ["fr", "en"],
  };
}

export function itemListJsonLd(items: Array<{ name: string; url?: string }>, title = "Prêches") {
  const listItems = items.map((item) => ({
    "@type": "ListItem",
    position: items.indexOf(item) + 1,
    url: item.url ?? `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"}/sermons`,
    name: item.name,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: listItems.length,
    itemListElement: listItems,
  };
}
