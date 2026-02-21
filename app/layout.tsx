// app/layout.tsx
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}