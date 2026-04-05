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
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative min-h-screen">
            <GridPattern
              width={40}
              height={40}
              strokeDasharray="0"
              className="fixed inset-0 -z-10 stroke-gray-200/50 fill-gray-200/50 [mask-image:radial-gradient(100%_100%_at_center,white,transparent)] dark:stroke-gray-800/50 dark:fill-gray-800/50"
            />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
