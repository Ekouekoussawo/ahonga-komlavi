export default function SermonsLoading() {
  return (
    <section className="bg-[#f9f7f2] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto h-10 w-48 animate-pulse rounded-full bg-[rgba(212,175,55,0.15)]" />
          <div className="mx-auto mt-5 h-12 w-96 animate-pulse rounded-2xl bg-gray-200" />
          <div className="mx-auto mt-4 h-6 w-full max-w-2xl animate-pulse rounded-full bg-gray-200" />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="overflow-hidden rounded-2xl bg-white p-0 shadow-sm">
              <div className="animate-pulse bg-gray-200" style={{ aspectRatio: "16/10" }} />
              <div className="p-6 sm:p-8 space-y-4">
                <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
                <div className="h-6 w-full animate-pulse rounded-full bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded-full bg-gray-200" />
                <div className="h-4 w-2/3 animate-pulse rounded-full bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
