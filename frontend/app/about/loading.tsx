export default function AboutLoading() {
  return (
    <div className="bg-white">
      <section className="relative bg-[#f9f7f2] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto h-12 w-64 animate-pulse rounded-2xl bg-gray-200" />
          <div className="mx-auto mt-4 h-6 w-full max-w-2xl animate-pulse rounded-full bg-gray-200" />
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="h-10 w-80 animate-pulse rounded-2xl bg-gray-200" />
              <div className="h-6 w-full animate-pulse rounded-full bg-gray-200" />
              <div className="h-6 w-full animate-pulse rounded-full bg-gray-200" />
              <div className="h-6 w-5/6 animate-pulse rounded-full bg-gray-200" />
            </div>
            <div className="rounded-2xl bg-[#f9f7f2] p-8 border border-[rgba(212,175,55,0.25)]">
              <div className="mx-auto h-8 w-48 animate-pulse rounded-2xl bg-gray-200" />
              <div className="mt-6 space-y-5">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
                      <div className="h-4 w-full animate-pulse rounded-full bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
