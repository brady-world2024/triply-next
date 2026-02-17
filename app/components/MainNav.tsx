"use client";

import Link from "next/link";
import Image from "next/image";

export default function MainNav() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Trip Easily"
            width={64}
            height={32}
            className="h-8 w-8 rounded"
            priority
          />
          <span className="text-base font-semibold tracking-tight">
            Trip Easily
          </span>
        </Link>
      </div>
    </header>
  );
}
