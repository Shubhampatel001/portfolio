import type { Metadata } from "next";
import { zen } from "@/lib/fonts";
import { profile } from "@/data/resume";
import { PERSONA_IDS } from "@/lib/personas";
import "./globals.css";

const themeScript = `try{var t=localStorage.getItem("theme");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t;if(localStorage.getItem("fx")==="calm")document.documentElement.dataset.fx="calm";var p=localStorage.getItem("persona");var ids=${JSON.stringify(PERSONA_IDS)};if(!p||(p!=="pixel"&&ids.indexOf(p)<0))document.documentElement.dataset.intro="1";else if(ids.indexOf(p)>-1)document.documentElement.dataset.persona=p}catch(e){document.documentElement.dataset.intro="1"}`;

const siteUrl = "https://shubhampatel.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.summary,
  keywords: [
    "Shubham Patel",
    "Software Engineer",
    "Full-Stack Developer",
    "Guidewire PolicyCenter",
    "Spring Boot",
    "React Developer",
    "RAG",
    "GenAI",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${profile.name} — ${profile.role}`,
    description: profile.summary,
    siteName: `${profile.name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.summary,
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${zen.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
