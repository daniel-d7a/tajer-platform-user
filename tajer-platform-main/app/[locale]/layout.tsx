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
import "@/lib/global-fix";
import GlobalLoader from "@/components/common/GlobalLoader";
import Start from "@/components/common/Start";
const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
});

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
      namespace: "common",
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
  params,
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <NextIntlClientProvider locale={locale as Locale}>
              <GlobalLoader />
              <Suspense fallback={<LoadingAnimation />}>
                <Start />
                <Header />
                <main className="min-h-screen">
                  <Suspense fallback={<LoadingAnimation />}>
                    {children}
                  </Suspense>
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
