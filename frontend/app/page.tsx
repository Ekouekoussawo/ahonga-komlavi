import { Sermon } from "@/types/wordpress";
import { mapBlogPostToSermon } from "@/lib/wordpress";
import { fallbackPosts } from "@/data/fallback";
import HeroSlider from "@/components/HeroSlider";
import DiscoverCards from "@/components/DiscoverCards";
import Evangelist from "@/components/Evangelist";

// Load snapshot with fallback for CI/CD builds
let snapshotPosts: any[] = [];
try {
  const snapshot = require("@/public/_generated/wp-content.json");
  snapshotPosts = Array.isArray(snapshot) ? snapshot : (snapshot.default || []);
} catch {
  snapshotPosts = [];
}
import Vision from "@/components/Vision";
import Sermons from "@/components/Sermons";
import PrayerProgram from "@/components/PrayerProgram";
import GalleryCarousel from "@/components/GalleryCarousel";
import YouTubeSection from "@/components/YouTubeSection";
import Give from "@/components/Give";
// Revalidate every hour OR on-demand via webhook
export const revalidate = 3600;  // 1 hour in seconds

export default function Home() {
  const snapshotSermons = (snapshotPosts as any[])
    .map(mapBlogPostToSermon);
  const posts = snapshotSermons.length > 0 ? snapshotSermons : fallbackPosts.map(mapBlogPostToSermon);

  return (
    <div>
      <HeroSlider />
      <DiscoverCards />
      <Evangelist />
      <section id="vision" className="scroll-mt-24">
        <Vision />
      </section>
      <Sermons posts={posts} />
      <GalleryCarousel />
      <section id="programme" className="scroll-mt-24">
        <PrayerProgram />
      </section>
      <YouTubeSection />
      <section id="dons" className="scroll-mt-24">
        <Give />
      </section>
    </div>
  );
}
