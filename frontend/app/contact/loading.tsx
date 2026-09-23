export default function ContactLoading() {
  return (
    <section className="relative bg-[#faf9f6] py-24" id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <div className="rounded-2xl bg-white p-8 sm:p-10 border border-[rgba(212,175,55,0.2)] shadow-sm">
            <div className="h-10 w-48 animate-pulse rounded-full bg-gray-200" />
            <div className="mt-8 space-y-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="h-14 w-14 animate-pulse rounded-2xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded-full bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-8 sm:p-10 border border-[rgba(212,175,55,0.25)] shadow-sm">
            <div className="h-10 w-48 animate-pulse rounded-full bg-gray-200" />
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="h-14 animate-pulse rounded-xl bg-gray-200" />
              <div className="h-14 animate-pulse rounded-xl bg-gray-200" />
            </div>
            <div className="mt-5 h-14 animate-pulse rounded-xl bg-gray-200" />
            <div className="mt-5 h-14 animate-pulse rounded-xl bg-gray-200" />
            <div className="mt-5 h-36 animate-pulse rounded-xl bg-gray-200" />
            <div className="mt-8 h-14 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </section>
  );
}
