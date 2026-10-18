import { ShieldCheck } from "lucide-react";

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#070914]">
      <div className="relative grid size-24 place-items-center">
        <span
          className="absolute inset-0 animate-spin rounded-[1.75rem] p-0.5 animation-duration-[1.6s]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, transparent 55%, #8b5cf6 80%, #bef264 100%)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        <div className="grid size-16 place-items-center rounded-2xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-[0_0_50px_rgba(139,92,246,0.45)]">
          <ShieldCheck size={30} className="text-white" />
        </div>
      </div>
    </div>
  );
}

/* import { ShieldCheck } from "lucide-react";

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#090b18]">
      <div className="grid size-16 animate-pulse place-items-center rounded-2xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-[0_0_40px_rgba(139,92,246,0.4)]">
        <ShieldCheck size={32} className="text-white" />
      </div>
    </div>
  );
}
*/
