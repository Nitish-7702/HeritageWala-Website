import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/features/CartDrawer";
import FloatingOrderButton from "@/components/features/FloatingOrderButton";
import ModernBackground from "@/components/layout/ModernBackground";
import { env } from "@/lib/env";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Heritage Wala | Premium Hyderabad Cuisine",
  description:
    "Experience the authentic flavors of Hyderabad in a premium, modern setting.",
  metadataBase: env.NEXT_PUBLIC_APP_URL
    ? new URL(env.NEXT_PUBLIC_APP_URL)
    : undefined,
  openGraph: {
    title: "Heritage Wala | Premium Hyderabad Cuisine",
    description:
      "Authentic Hyderabadi flavors, premium ambience, and a royal dining experience.",
    url: env.NEXT_PUBLIC_APP_URL,
    siteName: "Heritage Wala",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Heritage Wala | Premium Hyderabad Cuisine",
    description:
      "Authentic Hyderabadi flavors, premium ambience, and a royal dining experience.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${playfair.variable} antialiased text-stone-100 font-sans`}
      >
        <CartProvider>
          <ModernBackground />
          <Header />
          <CartDrawer />
          <FloatingOrderButton />
          <main className="min-h-screen pt-16 relative z-10">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
