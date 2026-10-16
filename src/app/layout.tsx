
import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

/**
 * Configure DM Sans as the primary font for body text.
 * The CSS variable makes the font available throughout the application.
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/**
 * Configure Fraunces for expressive café-style headings.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

/**
 * Define page metadata used by browsers and search engines.
 * We will refine the description and social metadata as the site develops.
 */
export const metadata: Metadata = {
  title: "Cardamom House | Brunch & Coffee in Lisbon",
  description:
    "Discover the brunch menu, fresh coffee, and daily specials at Cardamom House in Lisbon, Portugal.",
  applicationName: "Cardamom House",
};

/**
 * Configure browser theme colors and supported color schemes.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F3E9" },
    { media: "(prefers-color-scheme: dark)", color: "#241A16" },
  ],
  colorScheme: "light dark",
};

/**
 * Root layout shared by every route in the Next.js App Router.
 * The children prop represents the active page, such as app/page.tsx.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable}`}>
        {children}
      </body>
    </html>
  );
}
