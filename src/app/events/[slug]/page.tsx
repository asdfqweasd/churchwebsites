export const revalidate = 300;

import { fetchFromStrapi } from "@/lib/strapiClient";
import Link from "next/link";
import { EventImage } from "@/components/EventImage";
import { getStrapiImageUrl } from "@/lib/strapiImage";

function formatPreciseTime(dateString?: string | null) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  let hour = d.getHours();
  const minute = d.getMinutes().toString().padStart(2, "0");
  const ampm = hour >= 12 ? "PM" : "AM";
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${hour}:${minute}${ampm}`;
}

function formatTimeRange(start?: string | null, end?: string | null) {
  if (!start) return "";
  const startStr = formatPreciseTime(start);
  if (!end) return startStr;
  const endDate = new Date(end);
  const startDate = new Date(start);
  if (isNaN(endDate.getTime()) || endDate <= startDate) return startStr;
  const endStr = formatPreciseTime(end);
  return `${startStr} - ${endStr}`;
}

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;

  type StrapiEvent = {
    id: number;
    documentId?: string;
    slug?: string;
    title?: string;
    startDatetime?: string;
    endDatetime?: string | null;
    location?: string;
    city?: string;
    tags?: string;
    description?: string;
    image?: import("@/lib/strapiImage").StrapiImage | null;
  };

  let res: { data?: unknown } | null = null;
  let errorMessage: string | null = null;

  try {
    res = await fetchFromStrapi(
      `/api/events?filters[slug][$eq]=${encodeURIComponent(
        slug,
      )}&populate=image`,
    );
  } catch (err: unknown) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }

  const data = res?.data;
  const event = Array.isArray(data) ? (data as StrapiEvent[])[0] : null;

  if (!event) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
          <Link
            href="/events"
            className="inline-flex items-center text-xs text-neutral-300 hover:text-white mb-2"
          >
            Back to events
          </Link>

          <section className="bg-white text-black rounded-3xl p-6 md:p-8 space-y-4">
            <h1 className="text-xl font-bold">Event not found</h1>
            <p className="text-sm text-neutral-600">
              We couldn&apos;t find an event with slug: <code>{slug}</code>
            </p>
            {errorMessage && (
              <p className="text-sm text-red-600 mt-2">
                Error from fetchFromStrapi: {errorMessage}
              </p>
            )}
          </section>
        </div>
      </main>
    );
  }

  const attr = event as StrapiEvent;

  const title: string = attr.title ?? "Event";
  const description: string = attr.description ?? "";
  const startDatetime: string | undefined = attr.startDatetime;
  const endDatetime: string | null | undefined = attr.endDatetime;
  // location currently unused in UI; keep accessible if needed later
  // const location: string | undefined = attr.location;
  const city: string | undefined = attr.city;
  const tagsRaw: string | undefined = attr.tags;

  const timeText = formatTimeRange(startDatetime, endDatetime);
  const tagList = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean)
    : [];

  // Format full date like "25 October 2025"
  const fullDate = startDatetime
    ? new Date(startDatetime).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Get image URL using optimized Strapi v5 helper
  const imageUrl = getStrapiImageUrl(attr.image);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Upcoming Events CTA */}
        <div className="flex justify-end mb-6">
          <Link
            href="/events"
            className="inline-flex items-center justify-center bg-[#00B7E3] hover:bg-[#00A6D1] text-black font-semibold px-7 py-3 rounded-full text-lg transition-colors duration-200"
          >
            Upcoming Events
          </Link>
        </div>

        {/* Main Event Card */}
        <div className="relative">
          <div className="space-y-8 sm:space-y-10">
            {/* Gray Box with Title, Date, Time - with white square overlay */}
            <div className="relative">
              {/* Gray box with title and info - bottom layer (z-0) */}
              <div className="bg-[#f5f5f5] rounded-[28px] p-8 md:p-12 relative z-0 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-10">
                  <div className="space-y-6 md:space-y-8 max-w-[680px] md:w-1/2">
                    {/* Title */}
                    <div className="pt-2 sm:pt-4 max-w-[560px]">
                      <h1 className="text-[44px] sm:text-5xl md:text-[72px] font-medium text-black leading-[1.1] break-words">
                        {title}
                      </h1>
                    </div>

                    {/* Date and Time */}
                    <div className="space-y-4">
                      {fullDate && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-lg">{fullDate}</span>
                        </div>
                      )}

                      {timeText && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-lg">{timeText}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile tags inline */}
                {(tagList.length > 0 || city) && (
                  <div className="mt-6 flex flex-wrap gap-3 md:hidden">
                    {tagList.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 rounded-full text-xs bg-white text-black shadow"
                      >
                        {tag}
                      </span>
                    ))}
                    {city && (
                      <span className="px-4 py-2 rounded-full text-xs bg-white text-black shadow">
                        {city}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* White square and Tags container - middle layer (z-10) */}
              {tagList.length > 0 || city ? (
                <div className="hidden md:block absolute top-7 right-12 z-10 w-[360px]">
                  {/* White square - below tags */}
                  <div className="absolute top-[120px] left-0 w-[360px] h-[220px] bg-white rounded-[18px] shadow-[0_10px_24px_rgba(15,23,42,0.12)] z-10"></div>

                  {/* Tags - above white square */}
                  <div
                    className="absolute left-0 w-[360px] flex items-center justify-center flex-wrap gap-3 z-20"
                    style={{
                      top: "58px",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="flex items-center justify-center flex-wrap gap-3 -mt-2">
                      {tagList.map((tag) => (
                        <span
                          key={tag}
                          className="px-5 py-2 rounded-full text-sm bg-white text-black shadow"
                        >
                          {tag}
                        </span>
                      ))}
                      {city && (
                        <span className="px-5 py-2 rounded-full text-sm bg-white text-black shadow">
                          {city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Description and Image - side by side with equal space */}
            <div className="mt-6">
              <div className="rounded-3xl p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 items-start lg:pl-12 lg:pr-0 lg:py-6">
                {/* Left: description with padding */}
                <div className="p-2 sm:p-4 lg:pr-8">
                  {description && (
                    <p className="text-base sm:text-lg leading-7 text-gray-700 whitespace-pre-line break-words max-w-2xl mx-auto lg:mx-0 text-left">
                      {description}
                    </p>
                  )}
                </div>

                <div className="relative flex lg:justify-end z-30 w-full lg:absolute lg:right-12 lg:top-1/3">
                  {imageUrl || attr.image ? (
                    <div className="relative w-full lg:w-auto">
                      {imageUrl ? (
                        <div className="w-3/4 lg:w-[400px] overflow-hidden rounded-[24px] shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                          <EventImage
                            src={imageUrl}
                            alt={title}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-full rounded-[24px] flex items-center justify-center shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                          <div className="text-center p-4">
                            <p className="text-sm text-gray-600 mb-2">
                              Image data found but URL not resolved
                            </p>
                            <pre className="text-xs text-gray-500 overflow-auto max-h-40">
                              {JSON.stringify(attr.image, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
