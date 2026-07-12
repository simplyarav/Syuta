export default function BrandStrip() {
  return (
    <section className="mb-24 w-[100vw] ml-[calc(-50vw+50%)] bg-black text-white py-16 px-4 relative border-y-[4px] border-black shadow-[0_8px_0px_0px_rgba(0,0,0,1)] z-10 gs-reveal">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-between gs-item">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none max-w-2xl text-[#fce762]">
          ESSENTIAL STREETWEAR FOR THE EVERYDAY
        </h2>
        <div className="max-w-sm flex-shrink-0">
          <p className="text-lg font-bold">
            No gimmicks. Just premium hoodies, heavy tees, and everyday accessories built to last.
          </p>
        </div>
      </div>
    </section>
  );
}
