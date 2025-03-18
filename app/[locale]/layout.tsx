import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";

import { Geist } from "next/font/google";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { CartStoreProvider } from "@/providers/shopping-cart-provider";

import Header from "./components/header";
import Footer from "./components/footer";

import "./globals.css";
import { Locale } from "@/i18n/types";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Market Flow",
  description: "Find the freshest vegetables and fruits for your kitchen",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={geistSans.className}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <CartStoreProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </CartStoreProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
