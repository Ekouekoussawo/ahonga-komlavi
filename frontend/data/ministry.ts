export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  slug: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Veillée de prière spéciale",
    excerpt: "Une nuit consacrée à la prière, à l'intercession et à la louange. Venez chercher la face de Dieu avec nous.",
    image: "/gallery/1.jpg",
    date: "18 septembre 2026",
    slug: "veillee-de-priere-speciale",
  },
  {
    id: "2",
    title: "Jeûne et prière communautaire",
    excerpt: "Un temps de consécration et de jeûne pour la famille, l'Église et la nation.",
    image: "/gallery/2.jpg",
    date: "26 septembre 2026",
    slug: "jeune-et-priere-communautaire",
  },
  {
    id: "3",
    title: "Grande séance de prière",
    excerpt: "Programme spécial : enseignement, intercession et recherche de la présence de Dieu.",
    image: "/gallery/3.jpg",
    date: "03 octobre 2026",
    slug: "grande-seance-de-priere",
  },
];

export const events: Event[] = [
  {
    id: "1",
    title: "Veillée de prière spéciale",
    description: "Une nuit consacrée à la prière, à l'intercession et à la louange. Venez chercher la face de Dieu avec nous.",
    date: "2026-09-18",
    time: "19:00",
    location: "Centre de prière ESPRIT ET VIE, Djagblé-Abolavé",
  },
  {
    id: "2",
    title: "Jeûne et prière communautaire",
    description: "Un temps de consécration et de jeûne pour la famille, l'Église et la nation.",
    date: "2026-09-26",
    time: "06:00",
    location: "Centre de prière ESPRIT ET VIE, Djagblé-Abolavé",
  },
  {
    id: "3",
    title: "Grande séance de prière",
    description: "Programme spécial : enseignement, intercession et recherche de la présence de Dieu.",
    date: "2026-10-03",
    time: "08:00",
    location: "Centre de prière ESPRIT ET VIE, Djagblé-Abolavé",
  },
];
