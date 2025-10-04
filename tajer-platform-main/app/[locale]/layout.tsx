import type React from "react";
import { Suspense } from "react";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getLangDir } from "rtl-detect";
import { Toaster } from "react-hot-toast";
import LoadingAnimation from "@/components/common/Loading";

const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
});

declare global {
  var __: (key: string) => string;
}

if (typeof global !== 'undefined') {
  (global as any).__ = (key: string) => key;
}

type Locale = (typeof routing.locales)[number];

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string }; 
}

export async function generateMetadata({ params }: RootLayoutProps) {
  const { locale } = params;
  
  if (!routing.locales.includes(locale as Locale)) {
    return {
      title: "Tajer Platform",
      description: "منصة تاجر هي سوق الجملة الأول للتجار والشركات",
    };
  }

  try {
    const t = await getTranslations({ 
      locale: locale as Locale, 
      namespace: "common" 
    });

    return {
      title: t("title"),
      description: "منصة تاجر هي سوق الجملة الأول للتجار والشركات",
      icons: {
        icon: "/tajer-logo.svg",
      },
    };
  } catch {
    return {
      title: "Tajer Platform",
      description: "منصة تاجر هي سوق الجملة الأول للتجار والشركات",
    };
  }
}

export default async function RootLayout({ 
  children, 
  params 
}: RootLayoutProps) {
  const { locale } = params;
  
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const direction = getLangDir(locale);

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      dir={direction}
      className={cairo.variable}
    >
      <body
        className="min-h-screen bg-background font-cairo antialiased"
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.__ = window.__ || function(key) { 
                  console.warn('Translation function called before load:', key);
                  return key; 
                };
              }
            `,
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <NextIntlClientProvider locale={locale as Locale}>
              <Suspense fallback={<LoadingAnimation />}>
                <Header />
                <main className="min-h-screen">
                  {children}
                  <Toaster 
                    toastOptions={{
                      className: "bg-primary text-primary-foreground",
                    }}
                    position="top-right" 
                    reverseOrder={false} 
                  />
                </main>
                <Footer />
              </Suspense>
            </NextIntlClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}