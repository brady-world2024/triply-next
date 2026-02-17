// app/components/ShareBar.tsx
"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Copy, Mail, Share2, Printer } from "lucide-react";

export default function ShareBar({
  shareUrl,
  title,
}: {
  shareUrl: string;
  title: string;
}) {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const onEmail = () => {
    const subject = encodeURIComponent(`Trip plan: ${title}`);
    const body = encodeURIComponent(
      `Here is the trip plan link:\n\n${shareUrl}\n`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const onWhatsApp = () => {
    const text = encodeURIComponent(`Trip plan: ${title}\n${shareUrl}`);
    // wa.me works on desktop web & mobile
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const onPrint = () => window.print();

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <Button variant="secondary" onClick={onPrint}>
        <Printer className="mr-2 h-4 w-4" />
        Export A4 (Print/PDF)
      </Button>

      <Button variant="outline" onClick={onCopy}>
        <Copy className="mr-2 h-4 w-4" />
        Copy link
      </Button>

      <Button variant="outline" onClick={onEmail}>
        <Mail className="mr-2 h-4 w-4" />
        Email
      </Button>

      <Button variant="outline" onClick={onWhatsApp}>
        <Share2 className="mr-2 h-4 w-4" />
        WhatsApp
      </Button>
    </div>
  );
}
