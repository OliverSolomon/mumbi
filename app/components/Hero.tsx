import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative w-full min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
            <Image
              src="/mumbi.jpg"
              alt="Mumbi Judy Jacqueline Kimaru"
              fill
              className="object-cover rounded-lg shadow-lg"
              priority
            />
          </div>

          {/* Text Content */}
          <div className="text-center md:text-left space-y-6">
            <p className="text-sm uppercase tracking-wider text-gray-600 font-sans">
              In Loving Memory
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 leading-tight">
              Mumbi Judy Jacqueline Kimaru
            </h1>
            <p className="text-lg text-gray-600 font-sans">
              1986 – 2025
            </p>
            <div className="pt-4 space-y-3 text-gray-700 font-sans leading-relaxed">
              <p>
                A beloved daughter, sister, and friend whose radiant smile and generous spirit touched all who knew her.
              </p>
              <p>
                Her memory lives on in the hearts of those she loved and inspired.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

