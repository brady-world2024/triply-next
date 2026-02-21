"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getAccessToken, logoutClient } from "@/app/lib/authClient";

export default function MainNav() {
  const router = useRouter();

  // Lazy initialization: The first render directly reads localStorage (only effective on the client side)
  const [authed, setAuthed] = useState(() => !!getAccessToken());

  useEffect(() => {
    // Listen for two types of events:

    // 1) Manually dispatched "triply:auth" events within the same tab

    // 2) Changes to localStorage across tabs ("storage")
    const sync = () => setAuthed(!!getAccessToken());

    window.addEventListener("triply:auth", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("triply:auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const onLogout = () => {
    logoutClient();
    setAuthed(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Trip Easily"
            width={96}
            height={48}
            className="h-12 w-24 rounded"
            priority
          />
          <span className="text-base font-semibold tracking-tight">
            Trip Easily
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/">New trip</Link>
          </Button>

          <Button asChild variant="ghost">
            <Link href="/trips">History</Link>
          </Button>

          {authed ? (
            <Button variant="secondary" onClick={onLogout}>
              Logout
            </Button>
          ) : (
            <Button asChild variant="secondary">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
