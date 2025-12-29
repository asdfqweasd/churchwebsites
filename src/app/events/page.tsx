export const revalidate = 300;

import { fetchFromStrapi } from "@/lib/strapiClient";
import { EventsList, type Event } from "@/components/EventsList";
import { EventImage } from "@/components/EventImage";
import { getStrapiImageUrl } from "@/lib/strapiImage";

export default async function EventsPage() {
  const [pageRes, eventsRes] = await Promise.all([
    fetchFromStrapi("/api/events-page?populate=heroImage"),
    fetchFromStrapi("/api/events?sort=startDatetime:asc&populate=image"),
  ]);

  const page = pageRes?.data;

  type StrapiEvent = {
    id: number;
    documentId?: string;
    slug?: string;
    title?: string;
    startDatetime?: string;
    endDatetime?: string | null;
    tags?: string;
    description?: string;
    image?: Event["image"];
  };

  const rawEvents: StrapiEvent[] = Array.isArray(eventsRes?.data)
    ? (eventsRes.data as StrapiEvent[])
    : [];

  const events: Event[] = rawEvents.map((item) => ({
    id: item.id,
    documentId: item.documentId ?? "",
    slug: item.slug ?? "",
    title: item.title ?? "",
    startDatetime: item.startDatetime ?? "",
    endDatetime: item.endDatetime ?? null,
    tags: item.tags ?? "",
    description: item.description ?? "",
    image: item.image ?? null,
  }));

  const heroTitle: string = page?.heroTitle || "Upcoming Events";
  const heroSubtitle: string = page?.heroSubtitle || "";
  const heroImageUrl = getStrapiImageUrl(page?.heroImage) || "";

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Upcoming Events */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Title and Description */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-black leading-tight">
                {heroTitle.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < heroTitle.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </h1>
              {heroSubtitle && (
                <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                  {heroSubtitle}
                </p>
              )}
            </div>

            {/* Right Side - Hero Image */}
            <div className="relative">
              {heroImageUrl ? (
                <EventImage
                  src={heroImageUrl}
                  alt="Upcoming Events"
                  className="w-full h-[500px] object-cover rounded-3xl"
                />
              ) : (
                <div className="w-full h-[500px] bg-gray-200 rounded-3xl flex items-center justify-center">
                  <p className="text-gray-400">Image coming soon</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Events List Section */}
        <section className="relative mt-16">
          {/* Title positioned partially on the border */}
          <div className="relative mb-0">
            <h2 className="text-4xl md:text-5xl font-semibold text-black inline-block px-6 relative z-10">
              Come join us
            </h2>
          </div>

          {/* Content without border - negative margin to overlap with title */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 -mt-6 pt-14">
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
            {/* Filters Sidebar */}
            <div className="space-y-4">
              {["Search", "City", "Location", "Ministry"].map((label) => (
                <div key={label}>
                  <p className="text-xs mb-1 text-gray-600">{label}</p>
                  <input
                    disabled
                    className="bg-white w-full h-10 rounded-full px-4 border border-gray-200 text-sm"
                  />
                </div>
              ))}
            </div>

              {/* Events List */}
              <div>
                <EventsList events={events} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
