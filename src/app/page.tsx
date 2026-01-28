export const revalidate = 300;

/* eslint-disable @next/next/no-img-element */
// app/page.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { fetchFromStrapi } from "@/lib/strapiClient";
import { getStrapiImageUrl, type StrapiImage } from "@/lib/strapiImage";
import EventCarousel from "@/components/EventCarousel";
import type { Event } from "@/components/EventsList";

type RichTextNode = {
  type?: string;
  children?: RichTextNode[];
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  url?: string;
  newTab?: boolean;
  level?: number;
  format?: "ordered" | "unordered";
};

type HomeData = {
  heroImg?: StrapiImage | null;
  heroDescription?: string;
  heroDescriptionRichtext?: RichTextNode[] | null;
  ministriesImg?: StrapiImage | null;
  ministriesDescription?: string;
  givingImg?: StrapiImage | null;
  givingDescription?: string;
  [key: string]: unknown;
};

const heroTextStyle = {
  fontFamily: '"Sans Serif Collection", sans-serif',
  fontStyle: "normal",
  letterSpacing: "-0.011em",
};

function applyTextMarks(text: string, node: RichTextNode): ReactNode {
  const parts = text.split("\n");
  const withBreaks = parts.flatMap<ReactNode>((part, idx) =>
    idx === 0 ? [part] : [<br key={`br-${idx}`} />, part]
  );

  let content: ReactNode = withBreaks;

  if (node.bold) {
    content = <strong>{content}</strong>;
  }
  if (node.italic) {
    content = <em>{content}</em>;
  }
  if (node.underline) {
    content = <u>{content}</u>;
  }
  if (node.strikethrough) {
    content = <s>{content}</s>;
  }
  if (node.code) {
    content = (
      <code className="px-1 py-0.5 rounded bg-white/10 font-mono text-sm">
        {content}
      </code>
    );
  }

  return content;
}

function renderRichTextNode(node: RichTextNode, key: string): ReactNode {
  const children = (node.children ?? []).map((child, idx) =>
    renderRichTextNode(child, `${key}-${idx}`)
  );

  const fallback =
    typeof node.text === "string" && node.text.length > 0
      ? applyTextMarks(node.text, node)
      : null;

  const isPlainTextNode =
    (!node.type || node.type === "text") && (node.children ?? []).length === 0;

  if (isPlainTextNode && fallback) {
    return (
      <span key={key} className="leading-[1.6]">
        {fallback}
      </span>
    );
  }

  switch (node.type) {
    case "heading": {
      const level = Math.min(Math.max(node.level ?? 2, 1), 6) as 1 | 2 | 3 | 4 | 5 | 6;
      const HeadingTag = `h${level}` as const;
      const headingClass =
        level === 1
          ? "text-3xl sm:text-2xl md:text-4xl font-bold leading-tight text-center"
          : level === 2
          ? "text-2xl sm:text-lg font-semibold leading-tight"
          : "text-xl sm:text-lg font-semibold leading-tight";
      return (
        <HeadingTag key={key} className={headingClass}>
          {children.length > 0 ? children : fallback}
        </HeadingTag>
      );
    }
    case "paragraph":
      return (
        <p key={key} className="text-base sm:text-lg leading-[1.6]">
          {children.length > 0 ? children : fallback}
        </p>
      );
    case "list": {
      const isOrdered = node.format === "ordered";
      const ListTag = isOrdered ? "ol" : "ul";
      const listChildren =
        children.length > 0
          ? children
          : fallback
          ? [<li key={`${key}-item`}>{fallback}</li>]
          : null;
      return (
        <ListTag
          key={key}
          className={`list-inside ${isOrdered ? "list-decimal" : "list-disc"} pl-4 space-y-2 text-left inline-block text-base sm:text-lg leading-[1.6]`}
        >
          {listChildren}
        </ListTag>
      );
    }
    case "list-item":
      return (
        <li key={key} className="text-base sm:text-lg leading-[1.6]">
          {children.length > 0 ? children : fallback}
        </li>
      );
    case "quote":
      return (
        <blockquote
          key={key}
          className="border-l-4 border-white/50 pl-4 italic text-base sm:text-lg leading-[1.6] text-left inline-block"
        >
          {children.length > 0 ? children : fallback}
        </blockquote>
      );
    case "link": {
      const href = node.url ?? "#";
      const isExternal = /^https?:\/\//i.test(href);
      return (
        <a
          key={key}
          href={href}
          target={node.newTab || isExternal ? "_blank" : undefined}
          rel={node.newTab || isExternal ? "noreferrer" : undefined}
          className="underline underline-offset-2"
        >
          {children.length > 0 ? children : fallback}
        </a>
      );
    }
    default:
      return (
        <span key={key} className="leading-[1.6]">
          {children.length > 0 ? children : fallback}
        </span>
      );
  }
}

function HeroRichText({
  richText,
  fallbackText,
}: {
  richText?: RichTextNode[] | null;
  fallbackText: string;
}) {
  if (!richText || richText.length === 0) {
    return (
      <p
        className="text-white max-w-2xl text-sm sm:text-base leading-[1.6]"
        style={heroTextStyle}
      >
        {fallbackText}
      </p>
    );
  }

  return (
    <div
      className="text-white max-w-2xl space-y-3 sm:space-y-4 text-left sm:text-center"
      style={heroTextStyle}
    >
      {richText.map((node, idx) => renderRichTextNode(node, `hero-${idx}`))}
    </div>
  );
}

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
  const heroDescriptionRichtext = Array.isArray(homeData.heroDescriptionRichtext)
    ? (homeData.heroDescriptionRichtext as RichTextNode[])
    : null;

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

  const SHOW_GIVING = false;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative w-full max-w-[1330px] h-[420px] sm:h-[520px] lg:h-[700px] xl:h-[820px] 2xl:h-[990px] rounded-[30px] overflow-hidden mx-auto px-4 sm:px-6 my-8">
        {heroImageUrl && (
          <img
            src={heroImageUrl}
            alt={heroAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col items-center justify-center md:justify-start text-left sm:text-center px-4 sm:px-8 pt-2 sm:pt-12 md:pt-[90px] lg:pt-[90px] gap-6 sm:gap-8">
          <HeroRichText richText={heroDescriptionRichtext} fallbackText={heroDescription} />
          <Link
            href="/about"
            className="inline-flex text-2xl sm:text-3xl items-center justify-center bg-[#00B7E3] hover:bg-[#00A6D1] text-black font-semibold w-full max-w-[220px] h-14 sm:h-[68px] rounded-[30px] transition-colors duration-200"
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
                  className="inline-flex text-4xl items-center justify-center bg-[#00B7E3] hover:bg-[#00A6D1] text-black font-semibold w-[249px] h-[79px] rounded-[30px] transition-colors duration-200 self-center"
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
      {SHOW_GIVING && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-5/12 flex flex-col items-center md:items-center text-center md:text-left space-y-6">
              <h2 className="text-[48px] sm:text-[64px] md:text-[80px]font-semibold">Giving</h2>
              <p className="text-gray-700 leading-relaxed">{givingDescription}</p>
              <Link
                href="/giving"
                className="inline-flex text-4xl items-center justify-center bg-[#00B7E3] hover:bg-[#00A6D1] text-black font-semibold w-[249px] h-[79px] rounded-[30px] transition-colors duration-200 self-center"
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
      )}
    </main>
  );
}
