import { connection } from "next/server";
import { BuyButton } from "@/components/buy-button";
import { Button } from "@/components/ui/button";
import { getBillingConfig } from "@/lib/billing/config";

/** Reads billing env at request time so a static build cannot freeze "coming soon". */
export async function PurchaseActions() {
  await connection();
  const enabled = getBillingConfig().checkoutEnabled;

  return (
    <div className="flex flex-col items-start gap-3">
      <p className="max-w-xl text-sm leading-6 text-muted-foreground">
        Lifetime access is $149 USD, paid once. Module 1 and the glossary stay
        free.
      </p>
      {enabled ? (
        <BuyButton />
      ) : (
        <Button type="button" disabled>
          Coming soon
        </Button>
      )}
    </div>
  );
}
