import { Sermon } from "@/types/wordpress";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://evangelisteahongankomlavi.com";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Évangéliste Ahongan Komlavi",
    alternateName: "Ministère ESPRIT ET VIE",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    sameAs: [
      "https://www.youtube.com/@Evang%C3%A9listeahongankomlavi",
      "https://wa.me/22890877855",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+228-90-87-78-55",
      contactType: "customer service",
      availableLanguage: ["French"],
      areaServed: "TG",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Centre de prière ESPRIT ET VIE, Djagblé-Abolavé — Quartier des Vainqueurs",
      addressLocality: "Lomé",
      addressRegion: "Maritime",
      addressCountry: "TG",
    },
    founder: {
      "@type": "Person",
      name: "Ahongan Komlavi",
      title: "Évangéliste",
    },
    description: "Ministère évangélique basé à Lomé, Togo - Prière, enseignement biblique, évangélisation et accompagnement spirituel.",
  };
}

export function sermonJsonLd(sermon: Sermon) {
  return {
    "@context": "https://schema.org",
    "@type": sermon.videoId || sermon.youtubeUrl ? "VideoObject" : "Message",
    name: sermon.title,
    description: sermon.excerpt,
    datePublished: sermon.dateIso ?? sermon.date,
    author: {
      "@type": "Person",
      name: sermon.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Évangéliste Ahongan Komlavi",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    image: sermon.image ? `${SITE_URL}${sermon.image}` : `${SITE_URL}/images/default-sermon.jpg`,
    ...(sermon.youtubeUrl && {
      embedUrl: sermon.youtubeUrl,
      contentUrl: sermon.youtubeUrl,
    }),
    ...(sermon.videoId && {
      embedUrl: `https://www.youtube.com/embed/${sermon.videoId}`,
      contentUrl: `https://www.youtube.com/watch?v=${sermon.videoId}`,
    }),
    ...(sermon.series && {
      isPartOf: {
        "@type": "CreativeWorkSeries",
        name: sermon.series,
      },
    }),
  };
}

export function sermonsListJsonLd(sermons: Sermon[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Prêches et enseignements - Ministère ESPRIT ET VIE",
    description: "Archive des messages, prédications et études bibliques de l'Évangéliste Ahongan Komlavi",
    numberOfItems: sermons.length,
    itemListElement: sermons.map((sermon, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: sermon.youtubeUrl ?? `${SITE_URL}/sermons/#sermon-${sermon.id}`,
      name: sermon.title,
    })),
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Évangéliste Ahongan Komlavi - Ministère Évangélique",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}#organization`,
    name: "Centre de prière ESPRIT ET VIE",
    description: "Centre de prière et ministère évangélique dirigé par l'Évangéliste Ahongan Komlavi à Lomé, Togo.",
    url: SITE_URL,
    telephone: "+228-90-87-78-55",
    email: "priere@evangelisteahongakomlavi.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Djagblé-Abolavé — Quartier des Vainqueurs",
      addressLocality: "Lomé",
      addressRegion: "Maritime",
      postalCode: "BP 8048",
      addressCountry: "TG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.1725,
      longitude: 1.2314,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "09:00",
        closes: "12:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Wednesday"],
        opens: "18:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday"],
        opens: "18:00",
        closes: "20:00",
      },
    ],
    priceRange: "Free",
    currenciesAccepted: "XOF",
    paymentAccepted: "Cash, Mobile Money",
    areaServed: "TG",
    sameAs: [
      "https://www.youtube.com/@Evang%C3%A9listeahongankomlavi",
      "https://wa.me/22890877855",
    ],
  };
}