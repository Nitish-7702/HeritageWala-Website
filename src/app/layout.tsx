import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/features/CartDrawer";
import FloatingOrderButton from "@/components/features/FloatingOrderButton";
import ModernBackground from "@/components/layout/ModernBackground";

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
  description: "Experience the authentic flavors of Hyderabad in a premium, modern setting.",
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
