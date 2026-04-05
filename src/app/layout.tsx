import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { GridPattern } from "@/components/ui/grid-pattern";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AUSH Relay | Intake forms that fill themselves",
  description: "Multi-step intake form with client-side document OCR auto-fill",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/cal-sans@1.0.1/index.css"
        />
      </head>
      <body className="relative min-h-full flex flex-col">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <GridPattern
            width={40}
            height={40}
            className="stroke-gray-200/70 fill-transparent dark:stroke-gray-800/50 [mask-image:radial-gradient(ellipse_at_center,white_40%,transparent_100%)]"
          />
        </div>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
