"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

type BaseProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "type" | "inputMode" | "pattern"
>;

export type CurrencyInputIDRProps = BaseProps & {
  // Controlled numeric value (Rupiah, no decimals). Use null or undefined for empty.
  value?: number | null;
  // Uncontrolled initial numeric value.
  defaultValue?: number;
  // Callback with parsed numeric value (or null when empty)
  onValueChange?: (value: number | null) => void;
  // If provided, a hidden input with this name will submit the numeric value
  hiddenInputName?: string;
  // Allow negative values (default false)
  allowNegative?: boolean;
  // Standard onChange event, called after onValueChange
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatIDR(n: number) {
  return idrFormatter.format(n);
}

function parseIDRToNumber(raw: string, allowNegative = false): number | null {
  if (!raw) return null;
  const isNeg = allowNegative && raw.includes("-");
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  const num = Number(digits);
  return isNeg ? -num : num;
}

export const CurrencyInputIDR = React.forwardRef<
  HTMLInputElement,
  CurrencyInputIDRProps
>(function CurrencyInputIDR(
  {
    value,
    defaultValue,
    onValueChange,
    hiddenInputName,
    allowNegative = false,
    onChange,
    name, // we avoid passing name to the visible input if hiddenInputName is used
    ...rest
  },
  ref,
) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  // Initialize from controlled or default value
  const [numValue, setNumValue] = React.useState<number | null>(() => {
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return defaultValue;
    return null;
  });
  const [display, setDisplay] = React.useState<string>(() => {
    if (value !== undefined) return value == null ? "" : formatIDR(value);
    if (defaultValue !== undefined) return formatIDR(defaultValue);
    return "";
  });

  // Sync when controlled value changes
  React.useEffect(() => {
    if (value === undefined) return;
    setNumValue(value ?? null);
    setDisplay(value == null ? "" : formatIDR(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsed = parseIDRToNumber(raw, allowNegative);
    setNumValue(parsed);
    setDisplay(parsed == null ? "" : formatIDR(parsed));

    // Bubble numeric value first
    onValueChange?.(parsed);
    // Then bubble the original change event for any external listeners
    onChange?.(e);

    // Keep caret towards the end to reduce jumpiness post-format
    if (inputRef.current) {
      const el = inputRef.current;
      requestAnimationFrame(() => {
        const len = (el.value ?? "").length;
        el.setSelectionRange(len, len);
      });
    }
  };

  return (
    <>
      <Input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        aria-label={rest["aria-label"] ?? "Amount in Indonesian Rupiah"}
        // If a hidden input will submit the numeric value, avoid submitting the formatted string
        {...(hiddenInputName ? { name: undefined } : { name })}
        {...rest}
      />
      {hiddenInputName ? (
        <input
          type="hidden"
          name={hiddenInputName}
          value={numValue == null ? "" : String(numValue)}
        />
      ) : null}
    </>
  );
});

export default CurrencyInputIDR;
