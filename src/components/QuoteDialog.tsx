import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuoteForm } from "@/components/QuoteForm";
import type { Product } from "@/data/catalog";

/** What the dialog is asking a quote for: a catalog product, or free text (e.g. a failed search). */
export interface QuoteTarget {
  key: string;
  product?: Product;
  productName?: string;
}

interface Props {
  target: QuoteTarget | null;
  onOpenChange: (open: boolean) => void;
}

export function QuoteDialog({ target, onOpenChange }: Props) {
  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92dvh] overflow-y-auto sm:max-w-xl"
        // Move focus to the dialog itself rather than the first field, so phones don't pop the
        // keyboard over the form the moment it opens.
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          (e.currentTarget as HTMLElement).focus();
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-display">Request a Quote</DialogTitle>
          <DialogDescription>
            {target?.product
              ? `${target.product.name} — ${target.product.subcategory}`
              : "Tell us what you need and we will share price and availability."}
          </DialogDescription>
        </DialogHeader>
        {target && (
          <QuoteForm
            key={target.key}
            product={target.product ?? null}
            productName={target.productName ?? ""}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
