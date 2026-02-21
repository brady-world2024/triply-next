import MainNav from "@/app/components/MainNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-red-500 text-white text-center text-xs py-1">
        APP LAYOUT ACTIVE
      </div>
      <MainNav />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </>
  );
}
