"use client";

import { useState } from "react";
import { EventsList, type Event } from "@/components/EventsList";

export function EventsSection({ events }: { events: Event[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [ministryTerm, setMinistryTerm] = useState("");

  return (
    <section className="relative mt-16">
      <div className="relative mb-0">
        <h2 className="text-4xl md:text-5xl font-semibold text-black inline-block px-6 relative z-10">
          Come join us
        </h2>
      </div>

      <div className="bg-gray-50 rounded-3xl p-8 md:p-12 -mt-6 pt-14">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
          <div className="space-y-4">
            <div>
              <p className="text-xs mb-1 text-gray-600">Event Title</p>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by Event title"
                className="bg-white w-full h-10 rounded-full px-4 border border-gray-200 text-sm"
              />
            </div>
            <div>
              <p className="text-xs mb-1 text-gray-600">Ministry</p>
              <input
                value={ministryTerm}
                onChange={(event) => setMinistryTerm(event.target.value)}
                placeholder="Filter by tags"
                className="bg-white w-full h-10 rounded-full px-4 border border-gray-200 text-sm"
              />
            </div>
          </div>

          <div>
            <EventsList
              events={events}
              searchTerm={searchTerm}
              ministryTerm={ministryTerm}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
