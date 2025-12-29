import { fetchFromStrapi } from "@/lib/strapiClient";
import Link from "next/link";
import { EventImage } from "@/components/EventImage";
import { getStrapiImageUrl } from "@/lib/strapiImage";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

function formatDate(dateString?: string | null) {
  if (!dateString) return { day: "", month: "", fullDate: "" };
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return { day: "", month: "", fullDate: "" };
  const day = d.getDate().toString().padStart(2, "0");
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  const fullDate = `${day} ${month} ${year}`;
  return { day, month, fullDate };
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
        slug
      )}&populate=image`
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
  const endDatetime: string | undefined = attr.endDatetime;
  const location: string | undefined = attr.location;
  const city: string | undefined = attr.city;
  const tagsRaw: string | undefined = attr.tags;

  const { day, month } = formatDate(startDatetime);
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
            className="inline-flex items-center justify-center bg-[#00B7E3] hover:bg-[#00A6D1] text-black font-semibold px-6 py-3 rounded-full text-sm transition-colors duration-200"
          >
            Upcoming Events
          </Link>
        </div>

        {/* Main Event Card */}
        <div className="relative">
          <div className="space-y-6">
            {/* Gray Box with Title, Date, Time - with white square overlay */}
            <div className="relative">
              {/* Gray box with title and info - bottom layer (z-0) */}
              <div className="bg-gray-200 rounded-3xl h-80 p-8 md:p-12 relative z-0">
                <div className="space-y-8 pr-32">
                  {/* Title */}
                  <div className="pt-4">
                    <h1 className="text-6xl md:text-5xl font-bold text-black leading-tight">
                      {title}
                    </h1>
                  </div>

                  {/* Date and Time */}
                  <div className="space-y-3">
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
                        <span className="text-base">{fullDate}</span>
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
                        <span className="text-base">{timeText}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* White square and Tags container - middle layer (z-10) */}
              <div className="absolute top-8 right-8 md:top-20 md:right-32 z-10 w-80">
                {/* White square - below tags */}
                <div className="absolute top-25 left-0 w-80 h-80 bg-white rounded-lg shadow-lg z-10"></div>

                {/* Tags - above white square, container center aligns with white square's vertical midline */}
                {/* White square midline is at top-60 (top-20 + 40px) */}
                {/* Tags container center at top-60, but tags stay above white square */}
                {(tagList.length > 0 || city) && (
                  <div
                    className="absolute left-0 w-80 flex items-center justify-center flex-wrap gap-5 z-20"
                    style={{
                      top: "60px",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="flex items-center justify-center flex-wrap gap-5 -mt-20">
                      {tagList.map((tag) => (
                        <span
                          key={tag}
                          className="px-6 py-4 rounded-lg text-sm bg-white text-black"
                        >
                          {tag}
                        </span>
                      ))}
                      {city && (
                        <span className="px-6 py-4 rounded-lg text-sm bg-white text-black">
                          {city}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description and Image - side by side with equal space */}
            <div className="mt-6">
              <div className="bg-white rounded-3xl p-4 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left: description with padding */}
                <div className="p-4">
                  {description && (
                    <p className="text-base leading-relaxed text-gray-700 whitespace-pre-line">
                      {description}
                    </p>
                  )}
                </div>

                <div className="relative flex justify-end lg:justify-start z-30">
                  {imageUrl || attr.image ? (
                    <div className="relative w-full h-full md:w-4/5 md:h-100 md:ml-18 lg:-mt-32">
                      {imageUrl ? (
                        <EventImage
                          src={imageUrl}
                          alt={title}
                          className="w-full h-full object-cover rounded-3xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-3xl flex items-center justify-center">
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

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/events"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            Back to events
          </Link>
        </div>
      </div>
    </main>
  );
}
