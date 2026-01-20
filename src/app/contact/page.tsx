import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-3 mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#00B7E3]">
            Get in touch
          </p>
          <h1
            className="text-[64px] sm:text-[72px] lg:text-[80px] font-normal leading-[1.5] tracking-[-0.011em] text-gray-900 text-left"
            style={{ fontFamily: '"Sans Serif Collection", "Helvetica Neue", Arial, sans-serif' }}
          >
            Contact us
          </h1>
        </div>

        <ContactForm />
      </section>
    </div>
  );
}
