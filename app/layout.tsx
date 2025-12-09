import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "./lib/registry";

export const metadata: Metadata = {
  title: "TripAI - Plan Your Perfect Trip",
  description: "Plan, organize, and discover your dream destinations with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeRegistry>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md">
            Skip to main content
          </a>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
