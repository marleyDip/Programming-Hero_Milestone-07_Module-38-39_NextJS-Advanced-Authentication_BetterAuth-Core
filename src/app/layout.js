import {
  CircleCheck,
  CircleX,
  Info,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import { Toaster } from "sonner";

import SplashScreen from "@/components/splash-screen";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://your-domain.com"),

  title: {
    default: "NextAuth Pro | Secure Authentication",
    template: "%s | NextAuth Pro",
  },

  description:
    "A modern, secure, and scalable authentication solution built with Next.js and BetterAuth, featuring social login, email verification, password recovery, and profile management.",
  applicationName: "NextAuth Pro",
  keywords: [
    "Next.js Authentication",
    "BetterAuth",
    "Google OAuth",
    "GitHub OAuth",
    "Email Password Authentication",
    "Email Verification",
    "Password Recovery",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Sofian Hasan", url: "https://marleydip.netlify.app/" }],
  creator: "Sofian Hasan",

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "NextAuth Pro",
    title: "NextAuth Pro | Secure Authentication",
    description:
      "Modern authentication with Next.js and BetterAuth, featuring social login, email verification, password recovery, and secure profile management.",
    url: "https://your-domain.com",
  },

  twitter: {
    card: "summary_large_image",
    title: "NextAuth Pro | Secure Authentication",
    description:
      "A modern Next.js authentication application powered by BetterAuth.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="bg-background text-foreground">
        <SplashScreen />

        {children}

        {/* <Toaster
          theme="dark"
          position="bottom-right"
          closeButton
          gap={12}
          icons={{
            loading: (
              <LoaderCircle
                size={18}
                className="animate-spin text-violet-300"
              />
            ),

            success: <CircleCheck size={18} className="text-emerald-300" />,

            error: <CircleX size={18} className="text-red-300" />,

            warning: <TriangleAlert size={18} className="text-amber-300" />,

            info: <Info size={18} className="text-sky-300" />,
          }}
          toastOptions={{
            classNames: {
              // Base: glass card with a left accent bar
              toast:
                "group relative overflow-hidden !border !border-white/10 !bg-linear-to-br !from-[#14111f]/95 !to-[#0b0c0e]/95 !text-[#f5f6f2] !shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_48px_rgba(0,0,0,0.5)] !backdrop-blur-2xl before:absolute before:inset-y-4 before:left-0 before:w-1 before:rounded-r-full",

              default: "before:!bg-white/30",

              // Loading: violet, with a pulsing accent bar
              loading:
                "!border-violet-400/25 !from-violet-950/80 before:!bg-violet-400 before:animate-pulse !shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_48px_rgba(0,0,0,0.5),0_0_30px_rgba(139,92,246,0.18)]",

              success:
                "!border-emerald-400/25 !from-emerald-950/80 before:!bg-emerald-400",

              error: "!border-red-400/25 !from-red-950/80 before:!bg-red-400",

              warning:
                "!border-amber-400/25 !from-amber-950/80 before:!bg-amber-400",

              info: "!border-sky-400/25 !from-sky-950/80 before:!bg-sky-400",

              icon: "!mr-1 !grid !size-9 !place-content-center !place-items-center !rounded-xl !border !border-white/10 !bg-white/5",

              title: "!text-sm !font-semibold !tracking-tight !text-[#f5f6f2]",

              description: "!text-xs !leading-5 !text-[#9da6a1]",

              // closeButton: "!border-white/10 !bg-[#14111f] !text-slate-300 hover:!bg-white/10",

              closeButton:
                "!left-auto !-right-1 !top-1 !border-white/15 !bg-[#14111f] !text-slate-300 !shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:!border-violet-400/40 hover:!bg-[#211a35] hover:!text-white",

              // closeButton: "!left-auto !right-2 !top-5 !translate-x-0 !translate-y-0 !border-white/15 !bg-[#14111f] !text-slate-300 hover:!bg-white/10",

              actionButton:
                "!bg-[#ccff00] !text-[#0b0c0e] !font-semibold hover:!bg-[#d9ff4d]",

              cancelButton: "!bg-white/5 !text-[#9da6a1] hover:!bg-white/10",
            },

            style: {
              borderRadius: "18px",
              padding: "14px 16px",
            },
          }}
        /> */}

        <Toaster
          theme="dark"
          position="bottom-right"
          closeButton
          gap={12}
          icons={{
            loading: (
              <LoaderCircle
                size={18}
                className="animate-spin text-violet-300"
              />
            ),

            success: <CircleCheck size={18} className="text-emerald-300" />,

            error: <CircleX size={18} className="text-red-300" />,

            warning: <TriangleAlert size={18} className="text-amber-300" />,

            info: <Info size={18} className="text-sky-300" />,
          }}
          toastOptions={{
            classNames: {
              toast:
                "group relative overflow-hidden !border !text-[#f5f6f2] !backdrop-blur-2xl !shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_48px_rgba(0,0,0,0.5)] before:absolute before:inset-y-0 before:left-0 before:w-1",

              default:
                "!border-white/10 !bg-linear-to-br !from-[#14111f]/95 !to-[#0b0c0e]/95 before:bg-white/30",

              loading:
                "!border-violet-400/25 !bg-linear-to-br !from-violet-950/90 !to-[#0b0c0e]/95 before:animate-pulse before:bg-violet-400 !shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_48px_rgba(0,0,0,0.5),0_0_30px_rgba(139,92,246,0.2)] [&_[data-title]]:!text-violet-100 [&_[data-description]]:!text-violet-200/70 [&_[data-icon]]:!border-violet-400/20 [&_[data-icon]]:!bg-violet-400/10",

              success:
                "!border-emerald-400/25 !bg-linear-to-br !from-emerald-950/90 !to-[#0b0c0e]/95 before:bg-emerald-400 [&_[data-title]]:!text-emerald-100 [&_[data-description]]:!text-emerald-200/70 [&_[data-icon]]:!border-emerald-400/20 [&_[data-icon]]:!bg-emerald-400/10 [&_[data-close-button]]:!border-emerald-400/30 [&_[data-close-button]]:!bg-emerald-400/10 [&_[data-close-button]]:!text-emerald-200 [&_[data-close-button]:hover]:!bg-emerald-400/25 [&_[data-close-button]:hover]:!text-white [&_[data-button]:not([data-cancel])]:!bg-emerald-400 [&_[data-button]:not([data-cancel])]:!text-emerald-950 [&_[data-button]:not([data-cancel])]:!shadow-[0_4px_14px_rgba(52,211,153,0.25)] [&_[data-button]:not([data-cancel]):hover]:!bg-emerald-300 [&_[data-cancel]]:!border-emerald-400/20 [&_[data-cancel]]:!bg-emerald-400/5 [&_[data-cancel]]:!text-emerald-200 [&_[data-cancel]:hover]:!bg-emerald-400/15",

              error:
                "!border-red-400/25 !bg-linear-to-br !from-red-950/90 !to-[#0b0c0e]/95 before:bg-red-400 [&_[data-title]]:!text-red-100 [&_[data-description]]:!text-red-200/70 [&_[data-icon]]:!border-red-400/20 [&_[data-icon]]:!bg-red-400/10 [&_[data-close-button]]:!border-red-400/30 [&_[data-close-button]]:!bg-red-400/10 [&_[data-close-button]]:!text-red-200 [&_[data-close-button]:hover]:!bg-red-400/25 [&_[data-close-button]:hover]:!text-white [&_[data-button]:not([data-cancel])]:!bg-red-400 [&_[data-button]:not([data-cancel])]:!text-red-950 [&_[data-button]:not([data-cancel])]:!shadow-[0_4px_14px_rgba(248,113,113,0.25)] [&_[data-button]:not([data-cancel]):hover]:!bg-red-300 [&_[data-cancel]]:!border-red-400/20 [&_[data-cancel]]:!bg-red-400/5 [&_[data-cancel]]:!text-red-200 [&_[data-cancel]:hover]:!bg-red-400/15",

              warning:
                "!border-amber-400/25 !bg-linear-to-br !from-amber-950/90 !to-[#0b0c0e]/95 before:bg-amber-400 [&_[data-title]]:!text-amber-100 [&_[data-description]]:!text-amber-200/70 [&_[data-icon]]:!border-amber-400/20 [&_[data-icon]]:!bg-amber-400/10 [&_[data-close-button]]:!border-amber-400/30 [&_[data-close-button]]:!bg-amber-400/10 [&_[data-close-button]]:!text-amber-200 [&_[data-close-button]:hover]:!bg-amber-400/25 [&_[data-close-button]:hover]:!text-white [&_[data-button]:not([data-cancel])]:!bg-amber-400 [&_[data-button]:not([data-cancel])]:!text-amber-950 [&_[data-button]:not([data-cancel])]:!shadow-[0_4px_14px_rgba(251,191,36,0.25)] [&_[data-button]:not([data-cancel]):hover]:!bg-amber-300 [&_[data-cancel]]:!border-amber-400/20 [&_[data-cancel]]:!bg-amber-400/5 [&_[data-cancel]]:!text-amber-200 [&_[data-cancel]:hover]:!bg-amber-400/15",

              info: "!border-sky-400/25 !bg-linear-to-br !from-sky-950/90 !to-[#0b0c0e]/95 before:bg-sky-400 [&_[data-title]]:!text-sky-100 [&_[data-description]]:!text-sky-200/70 [&_[data-icon]]:!border-sky-400/20 [&_[data-icon]]:!bg-sky-400/10 [&_[data-close-button]]:!border-sky-400/30 [&_[data-close-button]]:!bg-sky-400/10 [&_[data-close-button]]:!text-sky-200 [&_[data-close-button]:hover]:!bg-sky-400/25 [&_[data-close-button]:hover]:!text-white [&_[data-button]:not([data-cancel])]:!bg-sky-400 [&_[data-button]:not([data-cancel])]:!text-sky-950 [&_[data-button]:not([data-cancel])]:!shadow-[0_4px_14px_rgba(56,189,248,0.25)] [&_[data-button]:not([data-cancel]):hover]:!bg-sky-300 [&_[data-cancel]]:!border-sky-400/20 [&_[data-cancel]]:!bg-sky-400/5 [&_[data-cancel]]:!text-sky-200 [&_[data-cancel]:hover]:!bg-sky-400/15",

              icon: "!mr-1 !grid !size-9 !place-content-center !place-items-center !rounded-xl !border !border-white/10 !bg-white/5",

              title: "!text-sm !font-semibold !tracking-tight",

              description: "!text-xs !leading-5 !text-[#9da6a1]",

              closeButton:
                "!left-auto !right-2 !top-2 !size-6 !transform-none !rounded-full !border !border-white/15 !bg-white/5 !text-slate-300 !opacity-100 !backdrop-blur-md !transition-all !duration-200 hover:!scale-110 hover:!border-white/30 hover:!bg-white/10 hover:!text-white active:!scale-95",

              actionButton:
                "!h-8 !rounded-lg !bg-[#ccff00] !px-3 !text-xs !font-semibold !text-[#0b0c0e] !shadow-[0_4px_14px_rgba(204,255,0,0.18)] !transition-all !duration-200 hover:!-translate-y-0.5 hover:!bg-[#d9ff4d] active:!translate-y-0 active:!scale-95",

              cancelButton:
                "!h-8 !rounded-lg !border !border-white/10 !bg-white/5 !px-3 !text-xs !font-medium !text-slate-300 !transition-all !duration-200 hover:!bg-white/10 hover:!text-white active:!scale-95",
            },

            style: {
              borderRadius: "18px",
              padding: "14px 40px 14px 18px",
            },
          }}
        />
      </body>
    </html>
  );
}
