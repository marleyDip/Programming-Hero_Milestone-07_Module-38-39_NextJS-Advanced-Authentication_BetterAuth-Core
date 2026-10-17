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
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
