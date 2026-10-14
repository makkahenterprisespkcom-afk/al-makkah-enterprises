import { useId, useState } from "react";
import { Check, Copy, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS, PRIMARY_CONTACT, telHref, waLink } from "@/data/business";
import { DEPARTMENTS, PRODUCTS, type Product } from "@/data/catalog";
import {
  EMPTY_QUOTE,
  mailtoHref,
  quoteMessage,
  validateQuote,
  type QuoteErrors,
  type QuoteFields,
} from "@/lib/quote";
import { cn } from "@/lib/utils";

const OTHER = "__other";

/** Opens a link in a new tab from inside a user gesture (avoids popup blockers). */
function openInNewTab(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

interface QuoteFormProps {
  /** Pre-select a catalog product; its specification options appear as tappable chips. */
  product?: Product | null;
  /** Pre-fill a free-text product name (e.g. from a search that found nothing). */
  productName?: string;
  /** Show a catalog product picker (used on the Contact page). */
  showPicker?: boolean;
}

type Sent = "whatsapp" | "email" | null;

export function QuoteForm({ product = null, productName = "", showPicker = false }: QuoteFormProps) {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const [selected, setSelected] = useState<Product | null>(product);
  const [pickerValue, setPickerValue] = useState<string>(product ? product.id : "");
  const [f, setF] = useState<QuoteFields>({
    ...EMPTY_QUOTE,
    product: product?.name ?? productName,
  });
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [contact, setContact] = useState<string>(PRIMARY_CONTACT.wa);
  const [sent, setSent] = useState<Sent>(null);
  const [copied, setCopied] = useState<"yes" | "no" | null>(null);

  const set =
    (k: keyof QuoteFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setF((s) => ({ ...s, [k]: e.target.value }));
      setSent(null);
      setCopied(null);
    };

  const message = quoteMessage(f, picked);
  const waHref = waLink(contact, message);
  const mailHref = mailtoHref(`Quotation request: ${f.product.trim() || "product enquiry"}`, message);

  const showProductInput = !showPicker || pickerValue === OTHER;

  /** Validates; on failure focuses the first invalid field and returns false. */
  const check = (): boolean => {
    const e = validateQuote(f);
    if (showPicker && !pickerValue) e.product = "Please choose a product, or select “Other”.";
    setErrors(e);
    const order: (keyof QuoteFields)[] = ["name", "phone", "email", "product", "qty"];
    const first = order.find((k) => e[k]);
    if (first) {
      const target = first === "product" && showPicker && !showProductInput ? "picker" : first;
      document.getElementById(id(target))?.focus();
      return false;
    }
    return true;
  };

  const onPick = (value: string) => {
    setPickerValue(value);
    setPicked({});
    setSent(null);
    if (value === OTHER || !value) {
      setSelected(null);
      setF((s) => ({ ...s, product: "" }));
      return;
    }
    const p = PRODUCTS.find((x) => x.id === value) ?? null;
    setSelected(p);
    setF((s) => ({ ...s, product: p?.name ?? "" }));
  };

  const copyMessage = async () => {
    if (!check()) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied("yes");
    } catch {
      setCopied("no");
    }
  };

  const contactName = BUSINESS.contacts.find((c) => c.wa === contact)?.name;

  return (
    <form
      noValidate
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        // WhatsApp is the submit action, so pressing Enter in any field sends via WhatsApp.
        e.preventDefault();
        if (!check()) return;
        setSent("whatsapp");
        openInNewTab(waHref);
      }}
    >
      <p className="text-xs text-muted-foreground sm:col-span-2">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required. We don’t list prices online —
        send your requirement and we will share price and availability.
      </p>

      <TextField
        id={id("name")}
        label="Customer Name"
        required
        autoComplete="name"
        maxLength={100}
        value={f.name}
        onChange={set("name")}
        error={errors.name}
      />
      <TextField
        id={id("company")}
        label="Company or Organization"
        autoComplete="organization"
        maxLength={120}
        value={f.company}
        onChange={set("company")}
      />
      <TextField
        id={id("phone")}
        label="Phone Number"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="03XX-XXXXXXX"
        maxLength={24}
        value={f.phone}
        onChange={set("phone")}
        error={errors.phone}
      />
      <TextField
        id={id("email")}
        label="Email Address (optional)"
        type="email"
        autoComplete="email"
        maxLength={120}
        value={f.email}
        onChange={set("email")}
        error={errors.email}
      />

      {showPicker && (
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={id("picker")}>
            Product<span aria-hidden="true" className="text-destructive"> *</span>
          </Label>
          <select
            id={id("picker")}
            value={pickerValue}
            onChange={(e) => onPick(e.target.value)}
            aria-required="true"
            aria-invalid={errors.product && !showProductInput ? true : undefined}
            aria-describedby={errors.product && !showProductInput ? id("product-error") : undefined}
            className="h-10 w-full rounded-md border border-input bg-card px-3 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive md:text-sm"
          >
            <option value="" disabled>
              Choose a product…
            </option>
            {DEPARTMENTS.map((d) => (
              <optgroup key={d.id} label={d.name}>
                {PRODUCTS.filter((p) => p.department === d.id).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value={OTHER}>Other / not listed</option>
          </select>
          {errors.product && !showProductInput && (
            <p id={id("product-error")} className="text-sm text-destructive">
              {errors.product}
            </p>
          )}
        </div>
      )}

      {showProductInput && (
        <TextField
          className="sm:col-span-2"
          id={id("product")}
          label={showPicker ? "Product Name (not listed)" : "Product Name"}
          required
          maxLength={160}
          value={f.product}
          onChange={set("product")}
          error={errors.product}
        />
      )}

      {selected?.specs?.map((g, gi) => {
        const gid = id(`spec-${gi}`);
        return (
          <div
            key={g.label}
            role="group"
            aria-labelledby={gid}
            className="space-y-1.5 sm:col-span-2"
          >
            <p id={gid} className="text-sm font-medium leading-none">
              {g.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {g.options.map((o) => {
                const on = picked[g.label] === o;
                return (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setPicked((p) => ({ ...p, [g.label]: on ? "" : o }));
                      setSent(null);
                    }}
                    className={cn(
                      "min-h-9 cursor-pointer rounded-md border px-3 py-1 text-sm transition-colors",
                      on
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-card hover:bg-secondary",
                    )}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <TextField
        className="sm:col-span-2"
        id={id("spec")}
        label="Required Specification or Size"
        placeholder="Type, capacity, model, range…"
        maxLength={200}
        value={f.spec}
        onChange={set("spec")}
      />
      <TextField
        id={id("qty")}
        label="Quantity"
        required
        maxLength={60}
        value={f.qty}
        onChange={set("qty")}
        error={errors.qty}
      />

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={id("extra")}>Additional Requirements</Label>
        <Textarea
          id={id("extra")}
          rows={3}
          maxLength={600}
          value={f.extra}
          onChange={set("extra")}
        />
      </div>

      <fieldset className="space-y-1.5 sm:col-span-2">
        <legend className="mb-1.5 text-sm font-medium leading-none">Send via WhatsApp to</legend>
        <div className="flex flex-wrap gap-2">
          {BUSINESS.contacts.map((c) => (
            <label key={c.wa} className="cursor-pointer">
              <input
                type="radio"
                name={id("contact")}
                value={c.wa}
                checked={contact === c.wa}
                onChange={() => setContact(c.wa)}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-9 items-center rounded-md border border-input bg-card px-3 py-1 text-sm transition-colors hover:bg-secondary peer-checked:border-primary peer-checked:bg-secondary peer-checked:font-medium peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring">
                {c.name} · {c.phone}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row">
        <Button type="submit" variant="whatsapp" size="lg" className="flex-1">
          <MessageCircle aria-hidden="true" /> Send on WhatsApp
        </Button>
        <Button variant="outline" size="lg" className="flex-1" asChild>
          <a
            href={mailHref}
            onClick={(e) => {
              if (!check()) e.preventDefault();
              else setSent("email");
            }}
          >
            <Mail aria-hidden="true" /> Send by Email
          </a>
        </Button>
      </div>

      <div className="space-y-2 text-sm sm:col-span-2">
        <div aria-live="polite" className="space-y-2">
          {sent === "whatsapp" && (
            <p className="flex items-start gap-2 rounded-md bg-secondary p-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                WhatsApp should now be open with your request ready for {contactName}. Press send
                there to deliver it. Nothing opened? Call{" "}
                {BUSINESS.contacts.map((c, i) => (
                  <span key={c.wa}>
                    {i > 0 && " or "}
                    <a className="font-medium text-primary underline" href={telHref(c)}>
                      {c.name} ({c.phone})
                    </a>
                  </span>
                ))}
                .
              </span>
            </p>
          )}
          {sent === "email" && (
            <p className="flex items-start gap-2 rounded-md bg-secondary p-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                Your email app should now be open with your request ready to send to{" "}
                {BUSINESS.email}. No email app on this device? Use “Copy request text” and paste it
                into any email or chat.
              </span>
            </p>
          )}
          {copied === "yes" && <p className="text-primary">Request text copied to clipboard.</p>}
          {copied === "no" && (
            <p className="text-destructive">
              Couldn’t copy automatically — please use WhatsApp or email instead.
            </p>
          )}
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={copyMessage}>
          <Copy aria-hidden="true" /> Copy request text
        </Button>
        <p className="text-xs text-muted-foreground">
          Your request opens in WhatsApp or your email app with all details filled in — nothing is
          sent until you press send there.
        </p>
      </div>
    </form>
  );
}

interface TextFieldProps extends Omit<React.ComponentProps<"input">, "id"> {
  id: string;
  label: string;
  required?: boolean;
  error?: string | undefined;
}

function TextField({ id, label, required, error, className, ...rest }: TextFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required && (
          <span aria-hidden="true" className="text-destructive">
            {" "}
            *
          </span>
        )}
      </Label>
      <Input
        id={id}
        aria-required={required ? true : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
