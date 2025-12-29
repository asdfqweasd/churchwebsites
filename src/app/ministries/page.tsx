/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { fetchFromStrapi } from "@/lib/strapiClient";
import { getStrapiImageUrl, type StrapiImage } from "@/lib/strapiImage";

export default async function MinistriesPage() {
  type MinistriesData = {
    title1Description?: string;
    title2?: string;
    title2Description?: string;
    title3?: string;
    title3Description?: string;
    title4?: string;
    title4Description?: string;
    title5?: string;
    title5Description?: string;
    img1?: StrapiImage | null;
    img2?: StrapiImage | null;
    img3?: StrapiImage | null;
    img4?: StrapiImage | null;
    img5?: StrapiImage | null;
  };

  let ministriesData: MinistriesData | null = null;
  let errorMessage: string | null = null;

  try {
    const res = await fetchFromStrapi("/api/ministries-page?populate=*");
    ministriesData = (res as { data?: MinistriesData | null })?.data ?? null;
  } catch (err: unknown) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }

  if (!ministriesData) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-red-600">
            Error loading ministries
          </h1>
          {errorMessage && (
            <p className="text-red-500 mt-2">{errorMessage}</p>
          )}
        </div>
      </main>
    );
  }

  const introDescription = ministriesData.title1Description || "";

  const ministries = [
    {
      title: ministriesData.title2,
      description: ministriesData.title2Description,
      image: ministriesData.img2,
    },
    {
      title: ministriesData.title3,
      description: ministriesData.title3Description,
      image: ministriesData.img3,
    },
    {
      title: ministriesData.title4,
      description: ministriesData.title4Description,
      image: ministriesData.img4,
    },
    {
      title: ministriesData.title5,
      description: ministriesData.title5Description,
      image: ministriesData.img5,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Introduction Section */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:items-center">
            {/* Left: Intro Description */}
            <div className="max-w-xl">
              <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                {introDescription}
              </p>
            </div>

            {/* Right: Intro Image */}
            <div className="flex justify-center lg:justify-end">
              {ministriesData.img1 && (
                <div className="rounded-3xl overflow-hidden shadow-lg flex-shrink-0 w-full max-w-[676px] aspect-[676/552]">
                  <img
                    src={getStrapiImageUrl(ministriesData.img1) || ""}
                    alt="Ministries"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Ministries Sections */}
        <div className="space-y-32">
          {ministries.map((ministry, index) => {
            const imageUrl = getStrapiImageUrl(ministry.image);
            const isEven = index % 2 === 0;

            return (
              <section key={index}>
                {/* 共用一个 grid，左右交错 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:items-center">
                  {isEven ? (
                    <>
                      {/* 左图右文 */}
                      <div className="flex justify-center lg:justify-start">
                        {imageUrl && (
                          <div className="rounded-3xl overflow-hidden shadow-lg flex-shrink-0 w-full max-w-[676px] aspect-[676/552]">
                            <img
                              src={imageUrl}
                              alt={ministry.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <div className="max-w-xl lg:pl-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                          {ministry.title}
                        </h2>
                        <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {ministry.description}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* 右图左文（顺序反转） */}
                      <div className="order-2 lg:order-1 max-w-xl lg:pr-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                          {ministry.title}
                        </h2>
                        <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {ministry.description}
                        </p>
                      </div>

                      <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                        {imageUrl && (
                          <div className="rounded-3xl overflow-hidden shadow-lg flex-shrink-0 w-full max-w-[676px] aspect-[676/552]">
                            <img
                              src={imageUrl}
                              alt={ministry.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {/* Back Link */}
        <div className="mt-24">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
