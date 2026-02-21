import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-md items-center gap-3 px-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Trip Easily"
              width={96}
              height={48}
              className="h-12 w-24 rounded"
              priority
            />
            <span className="text-lg font-semibold tracking-tight">
              Trip Easily
            </span>
          </Link>
        </div>
      </header>
      {children}
    </>
  );
}
