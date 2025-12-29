export const revalidate = 300;

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { fetchFromStrapi } from "@/lib/strapiClient"; 
import { getStrapiImageUrl, type StrapiImage } from "@/lib/strapiImage"; 

type AboutData = {
  title1?: string;
  title1Description?: string;
  title2?: string;
  title2Description?: string;
  title3?: string;
  title3Description?: string;
  img1?: StrapiImage | null;
  img2?: StrapiImage | null;
  img3?: StrapiImage | null;
};

export default async function AboutPage() {
  let aboutData: AboutData | null = null;
  let errorMessage: string | null = null;

  try {
    const res = await fetchFromStrapi("/api/about-page?populate=*");
    aboutData = (res as { data?: AboutData | null })?.data ?? null;
  } catch (err: unknown) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }

  if (!aboutData) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-red-600">
            Error loading page
          </h1>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
      </main>
    );
  }

  // 提取数据
  const title1 = aboutData.title1 || "About Us";
  const title1Description = aboutData.title1Description || "";
  const title2 = aboutData.title2 || "Our Mission";
  const title2Description = aboutData.title2Description || "";
  const title3 = aboutData.title3 || "Our Vision";
  const title3Description = aboutData.title3Description || "";

  // 获取图片 URLs
  const img1Url = getStrapiImageUrl(aboutData.img1);
  const img2Url = getStrapiImageUrl(aboutData.img2);
  const img3Url = getStrapiImageUrl(aboutData.img3);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top CTA */}
        <div className="flex justify-end mb-10">
          <Link
            href="/events"
            className="inline-flex items-center justify-center bg-[#00B7E3] hover:bg-[#00A6D1] text-black font-semibold px-6 py-3 rounded-full text-sm transition-colors duration-200"
          >
            Upcoming Events
          </Link>
        </div>

        {/* About Us Section */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Title and Description */}
            <div>
              <h1 className="text-5xl font-bold mb-8">{title1}</h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                {title1Description}
              </p>
            </div>

            {/* Right: Image - 616px × 388px */}
            <div className="flex justify-end">
              {img1Url && (
                <div className="rounded-3xl overflow-hidden shadow-lg w-full max-w-[616px] aspect-[616/388]">
                  <img
                    src={img1Url}
                    alt={title1}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image - 611px × 892px */}
            <div className="flex justify-start">
              {img2Url && (
                <div className="rounded-3xl overflow-hidden shadow-lg w-full max-w-[611px] aspect-[611/892]">
                  <img
                    src={img2Url}
                    alt={title2}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Right: Title, Description and Button */}
            <div>
              <h2 className="text-4xl font-bold mb-6">{title2}</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {title2Description}
              </p>
              <Link
                href="#mission"
                className="inline-block bg-[#00B7E3] hover:bg-[#00A6D1] text-black font-semibold px-12 py-3 rounded-full transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Our Vision Section */}
        <section className="mb-24">
          <div className="relative">
            <div className="rounded-3xl p-8 md:p-12 bg-[#F6F5F4] shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left: Description */}
                <div className="pt-10">
                  <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {title3Description}
                  </p>
                </div>

                {/* Right: Image - responsive with blur background */}
                <div className="flex justify-end relative w-full">
                  {img3Url && (
                    <>
                      {/* Blurred background image */}
                      <div
                        className="absolute inset-0 rounded-3xl blur-lg opacity-30 w-full h-full"
                        style={{
                          backgroundImage: `url(${img3Url})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      {/* Actual image on top */}
                      <div
                        className="rounded-3xl overflow-hidden shadow-lg relative z-10 w-full max-w-[729px] aspect-[729/520] mx-auto"
                      >
                        <img
                          src={img3Url}
                          alt={title3}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <h2 className="absolute -top-10 left-8 text-6xl font-bold z-20">
              {title3}
            </h2>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
