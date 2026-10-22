// app/profile/loading.jsx  (server component, no "use client")

function Bone({ className = "" }) {
  return <div className={`pf-bone rounded-xl bg-white/6 ${className}`} />;
}

function FieldSkeleton() {
  return (
    <div>
      <Bone className="mb-2 h-3.5 w-28" />
      <Bone className="h-12 w-full rounded-2xl" />
    </div>
  );
}

export default function ProfileLoading() {
  return (
    <main
      role="status"
      aria-busy="true"
      aria-label="Loading your profile"
      className="relative isolate min-h-screen overflow-hidden bg-[#05060a] text-white"
    >
      <span className="sr-only">Loading your profile...</span>

      {/* Aurora background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-1/4 -top-1/4 size-[55vw] rounded-full bg-violet-600/25 blur-[120px]" />

        <div className="absolute -right-1/4 top-1/3 size-[45vw] rounded-full bg-lime-400/10 blur-[130px]" />

        <div className="absolute -bottom-1/3 left-1/3 size-[50vw] rounded-full bg-cyan-500/15 blur-[130px]" />
      </div>

      {/* Top bar */}
      <header className="border-b border-white/10 bg-[#05060a]/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Bone className="size-10 rounded-xl" />
            <Bone className="hidden h-4 w-32 sm:block" />
            <Bone className="h-8 w-20 rounded-full" />
          </div>

          <Bone className="h-10 w-28 rounded-full sm:w-36" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        {/* Hero card */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/3 backdrop-blur-2xl">
          <div className="pf-bone h-32 bg-linear-to-br from-violet-600/25 via-indigo-600/15 to-cyan-500/10 sm:h-40" />

          <div className="px-6 pb-7 sm:px-8">
            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end">
              <div className="self-start rounded-full bg-[#05060a] p-1.5">
                <Bone className="size-24 rounded-full sm:size-28" />
              </div>

              <div className="flex-1 space-y-3 sm:pb-1">
                <Bone className="h-7 w-52 sm:w-64" />
                <Bone className="h-4 w-44 sm:w-56" />
              </div>

              <div className="flex gap-2 sm:pb-2">
                <Bone className="h-8 w-28 rounded-full" />
                <Bone className="hidden h-8 w-36 rounded-full sm:block" />
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[290px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="flex gap-2 overflow-hidden rounded-3xl border border-white/10 bg-white/3 p-2 lg:flex-col">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex shrink-0 items-center gap-3 rounded-2xl px-3.5 py-3 lg:w-full"
                >
                  <Bone className="size-10 shrink-0" />

                  <div className="space-y-2">
                    <Bone className="h-3.5 w-20" />
                    <Bone className="hidden h-3 w-28 lg:block" />
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden rounded-3xl border border-white/10 bg-white/3 p-5 lg:block">
              <div className="flex items-center gap-4">
                <Bone className="size-20 shrink-0 rounded-full" />

                <div className="flex-1 space-y-2">
                  <Bone className="h-4 w-28" />
                  <Bone className="h-3 w-24" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Bone className="size-5 rounded-full" />
                    <Bone className="h-3.5 w-36" />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Panel */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0b12]/80 p-6 backdrop-blur-2xl sm:p-8">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-lime-300/40 to-transparent" />

            <div className="mb-7 flex items-start gap-4">
              <Bone className="size-12 shrink-0 rounded-2xl" />

              <div className="flex-1 space-y-2.5">
                <Bone className="h-5 w-44" />
                <Bone className="h-3.5 w-64 max-w-full" />
              </div>
            </div>

            <div className="space-y-6">
              <FieldSkeleton />
              <FieldSkeleton />
              <Bone className="h-12 w-40 rounded-2xl bg-lime-300/15" />
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <Bone className="h-3 w-28" />
              <div className="mt-3 flex gap-2">
                <Bone className="h-8 w-36 rounded-full" />
                <Bone className="h-8 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pf-shimmer {
          0%   { opacity: 0.55; }
          50%  { opacity: 1; }
          100% { opacity: 0.55; }
        }
        .pf-bone { animation: pf-shimmer 1.6s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .pf-bone { animation: none; }
        }
      `}</style>
    </main>
  );
}
