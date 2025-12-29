"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Splide,
  SplideSlide,
  type SplideInstance,
} from "@splidejs/react-splide";
import { getStrapiImageUrl } from "@/lib/strapiImage";

interface EventCarouselProps {
  events: any[];
  autoplayInterval?: number;
}

export default function EventCarousel({
  events,
  autoplayInterval = 4000,
}: EventCarouselProps) {
  if (!events || events.length === 0) return null;

  const splideRef = useRef<SplideInstance | null>(null);

  const options = {
    type: "loop" as const, 
    perPage: 3, 
    perMove: 1, 
    gap: "1.5rem", 
    pagination: false, 
    arrows: false, 
    autoplay: autoplayInterval > 0,
    interval: autoplayInterval,
    pauseOnHover: true,
    pauseOnFocus: true,
    speed: 350, 
    rewind: false, 
    breakpoints: {
      1024: { perPage: 2 },
      640: { perPage: 1 },
    },
  };

  const goPrev = () => {
    splideRef.current?.splide?.go("<");
  };

  const goNext = () => {
    splideRef.current?.splide?.go(">");
  };

  function formatDateTime(ev: any) {
    if (!ev.startDatetime) return "TBA";

    const start = new Date(ev.startDatetime);
    const end = ev.endDatetime ? new Date(ev.endDatetime) : null;

    const dd = start.getDate().toString().padStart(2, "0");
    const mm = (start.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = start.getFullYear();
    const datePart = `${dd}.${mm}.${yyyy}`;

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    const startTime = start
      .toLocaleTimeString("en-US", timeOptions)
      .replace(" ", "");
    const endTime = end
      ? end.toLocaleTimeString("en-US", timeOptions).replace(" ", "")
      : "";

    if (endTime) return `${datePart} at ${startTime} -${endTime}`;
    return `${datePart} at ${startTime}`;
  }

  return (
    <div className="w-full">
      {/* 顶部右侧自定义箭头 */}
      <div className="flex items-center justify-end mb-6 gap-3">
        <button
          onClick={goPrev}
          aria-label="Previous"
          className="p-2 rounded-full bg-white shadow hover:bg-gray-100"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={goNext}
          aria-label="Next"
          className="p-2 rounded-full bg-white shadow hover:bg-gray-100"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Splide 容器 */}
      <Splide
        ref={splideRef}
        options={options}
        aria-label="Events carousel"
        className="w-full"
      >
        {events.map((event: any) => {
          const img = getStrapiImageUrl(event.image);

          return (
            <SplideSlide key={event.id}>
              <Link href={`/events/${event.slug}`} className="block w-full">
                {/* 容器：整体轻微上移 + 动画 */}
                <div className="group w-full max-w-[489px] mx-auto cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-2">
                  {/* 图片：圆角 + 悬停放大 + 阴影 */}
                  <div className="w-full h-[430px] rounded-[32px] overflow-hidden bg-gray-200 shadow-sm group-hover:shadow-2xl transition-shadow duration-300">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>


                  <div className="mt-4 px-1">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover:text-gray-800">
                      {event.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-700">
                      {formatDateTime(event)}
                    </p>
                  </div>
                </div>
              </Link>
            </SplideSlide>
          );
        })}
      </Splide>
    </div>
  );
}
