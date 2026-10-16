
import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cardamom House | Brunch & Coffee in Lisbon",
  description:
    "Discover the brunch menu, fresh coffee, and daily specials at Cardamom House in Lisbon, Portugal.",
  applicationName: "Cardamom House",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F3E9" },
    { media: "(prefers-color-scheme: dark)", color: "#211915" },
  ],
  colorScheme: "light dark",
};

/**
 * Renders the root layout and applies the saved theme before the page paints.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem("cardamom-house-theme");
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const theme = savedTheme || (prefersDark ? "dark" : "light");

                document.documentElement.classList.toggle("dark", theme === "dark");
              } catch (error) {
                document.documentElement.classList.remove("dark");
              }
            `,
          }}
        />
      </head>
      <body className={`${dmSans.variable} ${fraunces.variable}`}>
        {children}
      </body>
    </html>
  );
}
