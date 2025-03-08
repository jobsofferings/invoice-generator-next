import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import NavigationBar from "@/components/navigation-bar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Invoice Generator by FLIGHTDEV.CO",
  description: "The all-in-one solution for your business, community, or personal project.",
  keywords: ["flight", "development", "next.js", "typescript", "invoice", "generator"],
  authors: [{ name: "Ajnabe" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Flight Development",
    description: "The all-in-one solution for your business, community, or personal project.",
    url: "https://invoice.flightdev.co",
    type: "website",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "Invoice Generator by FLIGHTDEV.CO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@flightdev",
    title: "Invoice Generator by FLIGHTDEV.CO",
    description: "The all-in-one solution for your business, community, or personal project.",
    images: ["/banner.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavigationBar />
          {children}
          {/* <a
            className="flex w-full justify-center p-2"
            href="https://flightdev.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-center p-2 px-6 rounded-md font-medium text-sm text-muted-foreground">
              Designed and Created By{" "}
              <div className="font-black text-lg">FLIGHTDEV.CO</div>
            </div>
          </a> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
