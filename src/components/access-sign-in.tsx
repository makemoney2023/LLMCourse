"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AccessSignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [codeMessage, setCodeMessage] = useState<string | null>(null);
  const [emailPending, setEmailPending] = useState(false);
  const [codePending, setCodePending] = useState(false);

  async function sendLink(event: React.FormEvent) {
    event.preventDefault();
    setEmailPending(true);
    setEmailMessage(null);
    try {
      const response = await fetch("/api/access/magic-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        delivery?: string;
      };
      if (!response.ok || data.delivery === "unavailable") {
        setEmailMessage(
          "Email sign-in isn't available yet. Use the access code from your purchase confirmation.",
        );
      } else {
        setEmailMessage(
          "If this email has lifetime access, we sent a sign-in link. It expires in 30 minutes.",
        );
      }
    } catch {
      setEmailMessage(
        "Email sign-in isn't available yet. Use the access code from your purchase confirmation.",
      );
    } finally {
      setEmailPending(false);
    }
  }

  async function redeem(event: React.FormEvent) {
    event.preventDefault();
    setCodePending(true);
    setCodeMessage(null);
    try {
      const response = await fetch("/api/access/redeem", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: code }),
      });
      if (!response.ok) {
        setCodeMessage(
          response.status === 503
            ? "Sign-in isn't available until payments are configured."
            : "That access code didn't match a paid account.",
        );
        setCodePending(false);
        return;
      }
      router.push("/modules");
      router.refresh();
    } catch {
      setCodeMessage("Sign-in isn't available until payments are configured.");
      setCodePending(false);
    }
  }

  return (
    <div className="grid gap-10">
      <form className="space-y-3" onSubmit={sendLink}>
        <div>
          <Label htmlFor="signin-email">Checkout email</Label>
          <Input
            id="signin-email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 bg-background"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <Button type="submit" variant="outline" disabled={emailPending}>
          {emailPending ? "Sending…" : "Email me a sign-in link"}
        </Button>
        {emailMessage ? (
          <p className="text-sm leading-6 text-muted-foreground">{emailMessage}</p>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            We will email a link if this address has lifetime access.
          </p>
        )}
      </form>

      <form className="space-y-3" onSubmit={redeem}>
        <div>
          <Label htmlFor="access-code">Access code</Label>
          <Input
            id="access-code"
            required
            autoComplete="off"
            className="mt-2 bg-background font-mono text-xs"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </div>
        <Button type="submit" variant="outline" disabled={codePending}>
          {codePending ? "Checking…" : "Sign in with access code"}
        </Button>
        {codeMessage ? (
          <p className="text-sm leading-6 text-muted-foreground">{codeMessage}</p>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            The code is on the confirmation page after checkout. Save it — it
            is how you get back in on another device.
          </p>
        )}
      </form>
    </div>
  );
}
