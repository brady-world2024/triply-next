// app/layout.tsx
import "./globals.css";
import MainNav from "./components/MainNav";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MainNav />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
