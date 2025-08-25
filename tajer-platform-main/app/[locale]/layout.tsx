import type React from "react";
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

const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
});

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "common" });

  return {
    title: t("title"),
    description: "منصة تاجر هي سوق الجملة الأول للتجار والشركات",
    icons: {
      icon: "/tajer-logo.svg",
    },
  };
};
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const direction = getLangDir(locale);

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  };
  return (
    <html suppressHydrationWarning lang={locale} dir={direction} className={cairo.variable}>
      <body className="min-h-screen bg-background font-cairo" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <NextIntlClientProvider locale={locale}>
              <Header />
              <main>{children}</main>
              <Footer />
            </NextIntlClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};