import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/footer";
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
export const metadata: Metadata = {
  metadataBase: new URL("https://project-javohir.netlify.app/"),
  title: "Netflix clone | Javohir Xamdamboyev",
  description: "Notion is a Notion clone built by Javohir",
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Netflix clone",
    description: "Netflix clone is a Netflix clone built by Javohir",
    type: "website",
    url: "https://project-javohir.netlify.app/",
    locale: "uz_UZ",
    images: "https://pmo.kg/wp-content/uploads/2025/03/sayt-skl-77-e1742934926854-1024x565.jpg",
    countryName: "Uzbekistan",
    siteName: "Netflix clone - Clone",
    emails: "userjon800@gmail.com",
  },
  keywords:
    "Netflix, Netflix web, netflix clone, netflix web application, Ilon, Ilon Mask, Javohir Xamdamboyev",
  authors: [
    {
      name: "Javohir Xamdamboyev",
      url: "https://project-javohir.netlify.app/",
    },
  ],
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className}`}>
        <Toaster />
        {children}
        <Footer />
      </body>
    </html>
  );
}