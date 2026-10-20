"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function BuyButton() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onClick() {
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/checkout", { method: "POST" });
      const data = (await response.json().catch(() => ({}))) as { url?: string };
      if (!response.ok || typeof data.url !== "string") {
        setMessage("Checkout isn't available right now.");
        setPending(false);
        return;
      }
      window.location.assign(data.url);
    } catch {
      setMessage("Checkout isn't available right now.");
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button type="button" onClick={onClick} disabled={pending}>
        {pending ? "Opening checkout…" : "Buy lifetime access — $149"}
      </Button>
      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
    </div>
  );
}
