import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSermons, getSermonBySlug, mapBlogPostToSermon } from "@/lib/wordpress";
import { fallbackPosts } from "@/data/fallback";
import { CardImage } from "@/components/ResponsiveImage";
import JsonLd from "@/components/JsonLd";

// Load snapshot for static generation fallback
let snapshotPosts: any[] = [];
try {
  const snapshot = require("@/public/_generated/wp-content.json");
  snapshotPosts = Array.isArray(snapshot) ? snapshot : (snapshot.default || []);
} catch {
  snapshotPosts = [];
}

export async function generateStaticParams() {
  try {
    const sermons = await getSermons();
    return sermons.map((sermon) => ({ slug: sermon.slug }));
  } catch {
    // Fallback to snapshot or hardcoded posts for CI/CD builds
    const posts = snapshotPosts.length > 0 ? snapshotPosts : fallbackPosts;
    const sermons = posts.map(mapBlogPostToSermon);
    return sermons.map((sermon) => ({ slug: sermon.slug }));
  }
}

export default async function SermonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);

  if (!sermon) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: sermon.title,
    datePublished: sermon.dateIso ?? sermon.date,
    author: { "@type": "Person", name: sermon.author },
    image: sermon.image,
    description: sermon.excerpt,
  };

  return (
    <article className="bg-white pb-24">
      <JsonLd data={jsonLd} />

      <div className="relative aspect-[21/9] w-full overflow-hidden bg-secondary-900">
        <CardImage src={sermon.image} alt={sermon.title} aspectRatio="21/9" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-4 pb-10 sm:px-6 lg:px-8">
          <Link
            href="/sermons"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux prêches
          </Link>
          {sermon.series && (
            <span className="mb-3 inline-block rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-secondary-900">
              {sermon.series}
            </span>
          )}
          <h1
            className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {sermon.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          className="mb-8 flex flex-wrap items-center gap-4 text-sm text-gray-600"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <span>Par {sermon.author}</span>
          <span aria-hidden="true">•</span>
          <time>{sermon.date}</time>
        </div>

        {sermon.videoId && (
          <div className="mb-10 aspect-video overflow-hidden rounded-2xl shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${sermon.videoId}`}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none text-gray-700"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <p className="text-xl leading-relaxed text-gray-800">{sermon.excerpt}</p>
          {sermon.content && sermon.content !== sermon.excerpt && (
            <p className="mt-6 leading-relaxed whitespace-pre-line">{sermon.content}</p>
          )}
        </div>

        {sermon.youtubeUrl && !sermon.videoId && (
          <a
            href={sermon.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-700 px-6 py-3 font-bold text-white shadow-md transition hover:bg-primary-800"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Regarder sur YouTube
          </a>
        )}

        <div className="mt-12 border-t border-slate-100 pt-8">
          <Link
            href="/sermons"
            className="inline-flex items-center gap-2 font-semibold text-primary-700 hover:text-primary-800"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft className="h-4 w-4" /> Tous les prêches
          </Link>
        </div>
      </div>
    </article>
  );
}
