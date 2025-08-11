import type React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth/auth-provider';
import { NextIntlClientProvider } from 'next-intl';
import '../app/[locale]/globals.css';
import NotFounContent from './notFounContent';



export const metadata: Metadata = {
  title: 'Page Not Found | تاجر',
  description: 'منصة تاجر هي سوق الجملة الأول للتجار والشركات',
  icons: {
    icon: '/tajer-logo.svg',
  },
};

export default async function RootLayou() {

  return (
      <div className=" h-auto bg-background" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <NextIntlClientProvider>
              <Header />
              <main className="flex items-center justify-center">
              <NotFounContent />
              </main>
              <Footer />
            </NextIntlClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </div>
  );
};