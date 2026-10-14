import { FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRIMARY_CONTACT, waLink } from "@/data/business";
import { departmentById, type Product } from "@/data/catalog";
import { inquiryMessage } from "@/lib/quote";

const SIZES = "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

export function ProductCard({
  product,
  onQuote,
}: {
  product: Product;
  onQuote: (p: Product) => void;
}) {
  const dept = departmentById(product.department);
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <div className="aspect-[4/3] overflow-hidden bg-secondary">
        {/* Representative category photo — decorative, the product name is the real content. */}
        <img
          src={product.image.src}
          srcSet={product.image.srcSet}
          sizes={SIZES}
          alt=""
          loading="lazy"
          decoding="async"
          width={product.image.width}
          height={product.image.height}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="text-primary">{dept.short}</span> · {product.subcategory}
        </p>
        <h3 className="mt-1.5 text-lg font-bold leading-snug">{product.name}</h3>
        {product.description && (
          <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
        )}
        {product.specs && (
          <dl className="mt-3 space-y-2">
            {product.specs.map((g) => (
              <div key={g.label}>
                <dt className="text-xs font-medium text-muted-foreground">{g.label}</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {g.options.map((o) => (
                    <span
                      key={o}
                      className="rounded border border-border bg-secondary px-2 py-0.5 text-xs font-medium"
                    >
                      {o}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-auto flex flex-col gap-2 pt-4">
          <Button onClick={() => onQuote(product)}>
            <FileText aria-hidden="true" /> Request a Quote
            <span className="sr-only"> for {product.name}</span>
          </Button>
          <Button variant="whatsapp" asChild>
            <a
              href={waLink(PRIMARY_CONTACT.wa, inquiryMessage(product))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle aria-hidden="true" /> Inquire on WhatsApp
              <span className="sr-only"> about {product.name} (opens in a new tab)</span>
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
