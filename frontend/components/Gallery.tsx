const images = [
  { src: "/gallery/1.jpg", alt: "Prière" },
  { src: "/gallery/2.jpg", alt: "Communauté" },
  { src: "/gallery/3.jpg", alt: "Louange" },
  { src: "/gallery/4.jpg", alt: "Enseignement" },
];

export default function Gallery() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl sm:text-4xl font-bold mb-14" style={{ fontFamily: "var(--font-heading)" }}>
          Galerie
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image.alt}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/10 hover:border-[#D4AF37]/30"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-6 text-center">
                <span className="text-white font-semibold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300" style={{ fontFamily: "var(--font-heading)" }}>
                  {image.alt}
                </span>
                <span className="mt-2 h-0.5 w-8 bg-[#D4AF37] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
