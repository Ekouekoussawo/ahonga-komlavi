import { getTranslations } from "next-intl/server";
import { getRecentVideos } from "@/lib/youtube";
import { getSermons } from "@/lib/wordpress";
import SermonsExplorer from "@/components/SermonsExplorer";

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@Evang%C3%A9listeahongankomlavi";
// Same no-API-key "uploads" playlist trick as the homepage — used only as a
// fallback if the channel's RSS feed can't be reached at build time.
const YOUTUBE_UPLOADS_EMBED = "https://www.youtube.com/embed/videoseries?list=UU0PpGC7UZupgs5C3Gy8VgkQ";

export default async function SermonsPage() {
  const t = await getTranslations("sermons");
  const videos = await getRecentVideos(3);
  const sermons = await getSermons();

  return (
    <div className="bg-white">
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/gallery/photo-11.jpg)" }}
        />
        <div className="absolute inset-0 bg-secondary-900/50" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center leading-[1.2] pb-1 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]" style={{ fontFamily: "var(--font-heading)" }}>{t("title")}</h1>
          <p className="text-center text-white/90 mt-3 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]" style={{ fontFamily: "var(--font-body)" }}>{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-16 bg-[#f9f7f2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "var(--font-heading)" }}>
            Vidéos récentes de la chaîne
          </h2>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="overflow-hidden rounded-2xl shadow-lg border border-slate-100 bg-white">
                  <div className="aspect-video w-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                  <p className="p-4 text-sm font-semibold text-gray-800 line-clamp-2" style={{ fontFamily: "var(--font-body)" }}>
                    {video.title}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-lg border border-slate-100">
              <iframe
                src={YOUTUBE_UPLOADS_EMBED}
                title="Vidéos récentes"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full"
                style={{ height: 366 }}
              />
            </div>
          )}

          <div className="mt-8 text-center">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-red-700"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Voir la chaîne YouTube
            </a>
          </div>
        </div>
      </section>

      <SermonsExplorer initialSermons={sermons} />
    </div>
  );
}
