import "./globals.css";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/providers/QueryProvider";
import SocketProvider from "@/providers/SocketProvider";
import ScrollToTop from "@/components/common/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://astrarp.xyz"),
  title: {
    default: "Astra Roleplay",
    template: "%s | Astra Roleplay",
  },
  description:
    "Astra Roleplay is India's premium FiveM roleplay community built on OP Framework. Join a realistic, immersive and community-driven RP experience.",
  keywords: [
    "Astra Roleplay",
    "FiveM",
    "FiveM India",
    "India Roleplay",
    "GTA RP",
    "OP Framework",
    "Roleplay Server",
    "FiveM Server",
    "Whitelist",
    "Astra RP",
  ],
  authors: [
    {
      name: "Astra Roleplay",
    },
  ],
  creator: "Astra Roleplay",
  publisher: "Astra Roleplay",
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Astra Roleplay",
    description: "India's premium FiveM roleplay community. Craft your legacy.",
    url: "https://astrarp.xyz",
    siteName: "Astra Roleplay",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Astra Roleplay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Astra Roleplay",
    description: "India's premium FiveM roleplay community. Craft your legacy.",
    images: ["/about/AboutImage.png"],
  },
  themeColor: "#090909",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#090909] text-white antialiased`}
      >
        <NextTopLoader
          color="#8c1218"
          initialPosition={0.08}
          crawl
          crawlSpeed={200}
          height={3}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #8c1218,0 0 5px #8c1218"
        />

        <AuthProvider>
          <QueryProvider>
            <SocketProvider>
              {children}
              <ScrollToTop />
            <Toaster richColors position="top-right" theme="dark" closeButton />
            </SocketProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
