import { Playfair_Display, Inter } from "next/font/google";
import { getMessages } from "next-intl/server";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import IntlProvider from "@/components/IntlProvider";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import PWAProvider from "@/components/PWAProvider";
import { organizationJsonLd, webSiteJsonLd, localBusinessJsonLd } from "@/lib/json-ld";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" />
        <meta name="theme-color" content="#b8860b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ahongan Komlavi" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={webSiteJsonLd()} />
        <JsonLd data={localBusinessJsonLd()} />
      </head>
      <body className="min-h-screen flex flex-col">
        <IntlProvider locale="fr" messages={messages} timeZone="Africa/Lome">
          <a href="#main-content" className="skip-to-content">
            Aller au contenu principal
          </a>
          <Header />
          <Analytics />
          <PWAProvider />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <BackToTop />
        </IntlProvider>
      </body>
    </html>
  );
}
