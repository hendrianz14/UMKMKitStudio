import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Nav from "@/components/marketing/Nav";
import { AuthProvider } from "@/components/AuthProvider";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import "@/app/globals.css";
import "@/app/main.css";

export const dynamic = 'force-dynamic';

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontInter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "UMKM KitStudio — AI Content Suite for F&B Brands",
  description: "Automate your product content creation with AI templates, pro-grade editing, and simple workflows.",
  metadataBase: new URL("https://kitstudio.vercel.app"),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
    title: "UMKM KitStudio — AI Content Suite for F&B Brands",
    description: "Automate your product content creation with AI templates, pro-grade editing, and simple workflows.",
    images: ['/og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "UMKM KitStudio — AI Content Suite for F&B Brands",
    description: "Automate your product content creation with AI templates, pro-grade editing, and simple workflows.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1220",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: object) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: object) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "UMKM KitStudio",
        "url": "https://kitstudio.vercel.app",
        "logo": "https://kitstudio.vercel.app/logo.png",
        "sameAs": []
      },
      {
        "@type": "Product",
        "name": "UMKM KitStudio",
        "description": "AI product content generation and workflow tools for small businesses.",
        "brand": { "@type": "Brand", "name": "UMKM KitStudio" }
      }
    ]
  };

  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0B1220" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="UMKM, AI, product content, templates, marketing" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${fontSans.variable} ${fontInter.variable} font-sans antialiased`}>
        <AuthProvider initialSession={session}>
          <Nav />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
