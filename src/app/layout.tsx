import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "كدّاد",
  description: "كل رحلة فرصة توصيل",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}