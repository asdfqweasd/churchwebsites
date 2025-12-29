/* eslint-disable @next/next/no-img-element */
// app/page.tsx
import Link from "next/link";
import { fetchFromStrapi } from "@/lib/strapiClient";
import { getStrapiImageUrl, type StrapiImage } from "@/lib/strapiImage";
import EventCarousel from "@/components/EventCarousel";
import type { Event } from "@/components/EventsList";

type HomeData = {
  heroImg?: StrapiImage | null;
  heroDescription?: string;
  ministriesImg?: StrapiImage | null;
  ministriesDescription?: string;
  givingImg?: StrapiImage | null;
  givingDescription?: string;
  [key: string]: unknown;
};

export default async function HomePage() {
  let homeData: HomeData | null = null;
  let eventsData: Event[] = [];
  let errorMessage: string | null = null;

  try {
    const homeRes = await fetchFromStrapi("/api/home-page?populate=*");
    homeData = (homeRes as { data?: HomeData | null })?.data ?? null;

    const eventsRes = await fetchFromStrapi(
      "/api/events?populate=*&pagination[pageSize]=100&sort=startDatetime:desc"
    );
    const rawEvents = Array.isArray((eventsRes as { data?: unknown })?.data)
      ? ((eventsRes as { data: unknown }).data as Array<Record<string, unknown>>)
      : [];

    eventsData = rawEvents.map((item) => ({
      id: item.id as number,
      documentId: (item.documentId as string) ?? "",
      slug: (item.slug as string) ?? "",
      title: (item.title as string) ?? "",
      startDatetime: (item.startDatetime as string) ?? "",
      endDatetime: (item.endDatetime as string | null | undefined) ?? null,
      tags: (item.tags as string | undefined) ?? "",
      description: (item.description as string | undefined) ?? "",
      image: (item.image as Event["image"]) ?? null,
    }));
  } catch (err: unknown) {
    errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Error fetching home data:", errorMessage);
  }

  if (!homeData) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-red-600">Error loading home page</h1>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
      </main>
    );
  }

  const heroImageUrl = getStrapiImageUrl(homeData.heroImg);
  const heroAlt =
    (homeData.heroImg as { alternativeText?: string } | undefined)?.alternativeText ||
    "Church";
  const heroDescription = homeData.heroDescription || "";

  const ministriesImageUrl = getStrapiImageUrl(homeData.ministriesImg);
  const ministriesAlt =
    (homeData.ministriesImg as { alternativeText?: string } | undefined)?.alternativeText ||
    "Ministries";
  const ministriesDescription = homeData.ministriesDescription || "";

  const givingImageUrl = getStrapiImageUrl(homeData.givingImg);
  const givingAlt =
    (homeData.givingImg as { alternativeText?: string } | undefined)?.alternativeText ||
    "Giving";
  const givingDescription = homeData.givingDescription || "";

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative w-full max-w-[1330px] h-[500px] sm:h-[620px] lg:h-[720px] xl:h-[820px] 2xl:h-[990px] rounded-[30px] overflow-hidden mx-auto px-4 sm:px-6 my-8">
        {heroImageUrl && (
          <img
            src={heroImageUrl}
            alt={heroAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-8">
          <p className="text-white text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
            {heroDescription}
          </p>
          <Link
            href="/about"
            className="inline-block bg-[#00B7E3] hover:bg-[#00A6D1] text-black font-semibold px-12 py-3 rounded-full transition-colors duration-200"
          >
            Visit
          </Link>
        </div>
      </section>

      {/* Events */}
      {eventsData && eventsData.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold">Events</h2>
          </div>
          <EventCarousel events={eventsData} />
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-500">No events available</p>
        </section>
      )}

      {/* Ministries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[4.6rem] pb-[2.9rem]">
        <div className="relative">
          <h2 className="absolute top-0 -translate-y-1/2 left-4 sm:left-8 md:left-10 text-[48px] sm:text-[64px] md:text-[80px] leading-[1.5] tracking-[-0.011em] font-normal">
            Ministries
          </h2>
          <div className="bg-gray-50 rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-20 pt-[6.6rem] pb-[4.9rem]">
              <div className="md:w-5/12 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                <p className="text-gray-700 leading-relaxed">{ministriesDescription}</p>
                <Link
                  href="/ministries"
                  className="inline-flex items-center justify-center bg-[#00B7E3] hover:bg-[#00A6D1] text-black font-semibold w-[249px] h-[79px] rounded-[30px] text-lg transition-colors duration-200 self-center"
                >
                  Visit
                </Link>
              </div>
              {ministriesImageUrl && (
                <div className="md:w-7/12 w-full">
                  <img
                    src={ministriesImageUrl}
                    alt={ministriesAlt}
                    className="w-full h-auto md:w-[466px] md:h-[333px] object-cover rounded-[30px] shadow-md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Giving */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-5/12 flex flex-col items-center md:items-center text-center md:text-left space-y-6">
            <h2 className="text-6xl font-semibold">Giving</h2>
            <p className="text-gray-700 leading-relaxed">{givingDescription}</p>
            <Link
              href="/giving"
              className="inline-flex items-center justify-center bg-[#00B7E3] hover:bg-[#00A6D1] text-black font-semibold w-[249px] h-[79px] rounded-[30px] text-lg transition-colors duration-200 self-center"
            >
              Giving Now
            </Link>
          </div>
          {givingImageUrl && (
            <div className="md:w-[612px] w-full flex justify-center md:justify-end">
              <img
                src={givingImageUrl}
                alt={givingAlt}
                className="w-full h-auto md:w-[612px] md:h-[831px] object-cover rounded-[30px] shadow-md"
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
