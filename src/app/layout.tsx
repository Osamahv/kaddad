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
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
        <style>{`*{box-sizing:border-box;margin:0;padding:0}body{margin:0;background:#E2EAED}::-webkit-scrollbar{width:0}input,textarea,button,select{font-family:'Tajawal',sans-serif}`}</style>
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}