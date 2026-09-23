"use client";

import { Play, BookOpen, HeartHandshake, MessageCircle } from "lucide-react";

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@Evang%C3%A9listeahongankomlavi";
// Channel ID UC0PpGC7UZupgs5C3Gy8VgkQ, with "UC" swapped for "UU" — YouTube's
// stable alias for "this channel's uploads" as a playlist. Embedding it
// always shows the most recent upload first with no API key and no
// maintenance, which static export needs since there's no server to poll
// the Data API from at request time.
const YOUTUBE_UPLOADS_EMBED = "https://www.youtube.com/embed/videoseries?list=UU0PpGC7UZupgs5C3Gy8VgkQ";

export default function YouTubeSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Chaîne YouTube
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6" style={{ fontFamily: "var(--font-body)" }}>
            Abonnez-vous à notre chaîne pour ne manquer aucune prédication et aucun enseignement.
          </p>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-white font-bold shadow-lg transition hover:bg-red-700"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M10 15l5.5-3-5.5-3v6zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
            S&apos;abonner à la chaîne
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100">
            <div className="aspect-video w-full">
              <iframe
                src={YOUTUBE_UPLOADS_EMBED}
                title="Dernière prédication"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="bg-white p-6">
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Dernière prédication
              </h3>
              <p className="text-gray-600 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                Regardez le dernier message de l&apos;Évangéliste Ahongan Komlavi sur notre chaîne YouTube.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#f9f7f2] p-8 border border-slate-100">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Restez connecté
            </h3>
            <p className="text-gray-700 mb-6" style={{ fontFamily: "var(--font-body)" }}>
              Notre chaîne YouTube propose des prêches, des enseignements et des moments de prière pour vous accompagner
              dans votre vie spirituelle. Rejoignez notre communauté et recevez des notifications pour chaque nouveau contenu.
            </p>
            <ul className="space-y-3 text-gray-700 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              <li className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary-600"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg> Prêches en direct et en replay</li>
              <li className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary-600"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg> Études bibliques approfondies</li>
              <li className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary-600"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg> Moments de prière et d&apos;intercession</li>
              <li className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary-600"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg> Témoignages et partages</li>
            </ul>
            <div className="mt-8">
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary-700 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-primary-800 hover:shadow-xl"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Voir toute la chaîne
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
