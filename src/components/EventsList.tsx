"use client";

import Link from "next/link";
import { useState } from "react";
import type { StrapiImage } from "@/lib/strapiImage";

export type Event = {
  id: number;               
  documentId: string;      
  slug: string;             
  title: string;
  startDatetime: string;
  endDatetime?: string | null;
  tags?: string;
  description?: string;
  image?: StrapiImage | null;
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function formatPreciseTime(dateString: string) {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";

  let hour = d.getHours();
  const minute = d.getMinutes().toString().padStart(2, "0");
  const ampm = hour >= 12 ? "PM" : "AM";

  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;

  return `${hour}:${minute}${ampm}`;
}

function formatDate(dateString: string) {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  const day = d.getDate().toString().padStart(2, "0");
  const month = MONTH_NAMES[d.getMonth()];
  return `${day} ${month}`;
}

function formatMonthYear(dateString: string) {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return `${month} ${year}`;
}

function formatTimeDisplay(start: string, end?: string | null) {
  const startDate = new Date(start);
  if (isNaN(startDate.getTime())) return "";

  const startStr = formatPreciseTime(start);
  if (!end) return startStr;

  const endDate = new Date(end);
  if (isNaN(endDate.getTime()) || endDate <= startDate) return startStr;

  const endStr = formatPreciseTime(end);
  return `${startStr} - ${endStr}`;
}

function normalizeForSearch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isSubsequence(needle: string, haystack: string) {
  if (!needle) return true;
  let i = 0;
  for (const ch of haystack) {
    if (ch === needle[i]) i += 1;
    if (i >= needle.length) return true;
  }
  return false;
}

function fuzzyMatch(needle: string, haystack: string) {
  const n = normalizeForSearch(needle);
  const h = normalizeForSearch(haystack);
  if (!n) return true;
  if (!h) return false;
  if (h.includes(n)) return true;
  return isSubsequence(n, h);
}

export function EventsList({
  events,
  searchTerm = "",
  ministryTerm = "",
}: {
  events: Event[];
  searchTerm?: string;
  ministryTerm?: string;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rippleId, setRippleId] = useState<number | null>(null);

  type Group = { label: string; items: Event[] };
  const groups: Group[] = [];

  const sortedEvents = [...events].sort((a, b) => {
    const aTime = new Date(a.startDatetime).getTime();
    const bTime = new Date(b.startDatetime).getTime();
    const safeATime = Number.isNaN(aTime) ? -Infinity : aTime;
    const safeBTime = Number.isNaN(bTime) ? -Infinity : bTime;
    return safeBTime - safeATime;
  });

  const filteredEvents = sortedEvents.filter((e) => {
    const matchesTitle = fuzzyMatch(searchTerm, e.title);
    if (!matchesTitle) return false;
    if (!ministryTerm.trim()) return true;
    const tagsText = e.tags ? e.tags.replace(/[,/|]+/g, " ") : "";
    return fuzzyMatch(ministryTerm, tagsText);
  });

  filteredEvents.forEach((e) => {
    if (!e.startDatetime) return;
    const label = formatMonthYear(e.startDatetime) || "Other";

    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.label === label) {
      lastGroup.items.push(e);
    } else {
      groups.push({ label, items: [e] });
    }
  });

  const handleClick = (id: number) => {
    setSelectedId(id);
    setRippleId(id);
    setTimeout(() => {
      setRippleId((current) => (current === id ? null : current));
    }, 300);
  };

  const renderCard = (e: Event) => {
    const isSelected = e.id === selectedId;
    const showRipple = e.id === rippleId;

    const dateFormatted = formatDate(e.startDatetime);
    const [day, month] = dateFormatted ? dateFormatted.split(" ") : ["", ""];
    const timeText = formatTimeDisplay(e.startDatetime, e.endDatetime);
    const tagList = e.tags ? e.tags.split(",").map((t) => t.trim()) : [];

    return (
      <Link
        key={e.id}
        href={`/events/${e.slug}`}   
        className="block"
        onClick={() => handleClick(e.id)}
      >
        <article
          className={`
            group relative cursor-pointer rounded-3xl overflow-hidden flex flex-col md:flex-row
            transition-all duration-300 ease-out
            hover:bg-cyan-400 hover:text-black
            hover:-translate-y-1 hover:shadow-lg
            ${isSelected
              ? "bg-cyan-400 text-black shadow-xl ring-2 ring-cyan-300/70"
              : "bg-white text-black shadow-sm"
            }
          `}
        >
          {showRipple && (
            <span
              className="
                pointer-events-none
                absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                w-40 h-40 rounded-full bg-white/30
                animate-[ping_0.5s_ease-out_forwards]
              "
            />
          )}

          <div className="md:w-40 flex items-center justify-center bg-white text-black">
            <div className="text-center px-6 py-6">
              <div className="text-3xl font-bold">{day}</div>
              <div className="text-sm">{month}</div>
            </div>
          </div>

          <div className="flex-1 px-6 py-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {tagList.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs bg-white text-black shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="font-semibold text-base mb-1">
              {e.title}
            </h3>

            {timeText && (
              <p className="text-xs mb-2 text-neutral-600 group-hover:text-black">
                {timeText}
              </p>
            )}

            <p className="text-xs leading-relaxed text-neutral-700 group-hover:text-black">
              {e.description}
            </p>
          </div>
        </article>
      </Link>
    );
  };

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.label} className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {group.label}
          </h3>

          <div className="space-y-4">
            {group.items.map((e) => renderCard(e))}
          </div>
        </div>
      ))}
    </div>
  );
}
