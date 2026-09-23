import SermonsLoading from "@/app/sermons/loading";

export default function HomeLoading() {
  return (
    <div>
      <div className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden bg-gray-200">
        <div className="absolute inset-0 animate-pulse bg-gray-300" />
      </div>
      <div className="bg-[#f9f7f2] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-10 w-48 animate-pulse rounded-full bg-[rgba(212,175,55,0.15)]" />
            <div className="mx-auto mt-5 h-12 w-96 animate-pulse rounded-2xl bg-gray-200" />
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="overflow-hidden rounded-2xl bg-white p-8 shadow-sm">
                <div className="mx-auto h-16 w-16 animate-pulse rounded-2xl bg-gray-200" />
                <div className="mt-5 h-6 w-32 animate-pulse rounded-full bg-gray-200" />
                <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <SermonsLoading />
    </div>
  );
}
