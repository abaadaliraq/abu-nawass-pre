import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مشروع تأهيل واستثمار الشارع التراثي في أبو نؤاس",
  description:
    "رؤية متكاملة للحفاظ العمراني والتنمية السياحية والاستثمارية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
