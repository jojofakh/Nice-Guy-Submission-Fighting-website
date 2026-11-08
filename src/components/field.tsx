import type { ComponentProps, ReactNode } from "react";

const controlClass =
  "w-full border border-line bg-ink px-4 py-3 text-sm text-bone placeholder:text-ash-dim/70 transition-colors focus:border-blood focus:outline-none disabled:cursor-not-allowed disabled:opacity-45 aria-[invalid=true]:border-blood [color-scheme:dark]";

export function Label({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-ash"
    >
      <span>{children}</span>
      {hint ? <span className="text-ash-dim normal-case tracking-normal">{hint}</span> : null}
    </label>
  );
}

export function Input({ className = "", ...rest }: ComponentProps<"input">) {
  return <input className={`${controlClass} ${className}`} {...rest} />;
}

export function Textarea({ className = "", ...rest }: ComponentProps<"textarea">) {
  return <textarea className={`${controlClass} ${className}`} {...rest} />;
}

export function Select({ className = "", ...rest }: ComponentProps<"select">) {
  return <select className={`${controlClass} ${className}`} {...rest} />;
}

export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export function Checkbox({ className = "", ...rest }: ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 shrink-0 cursor-pointer accent-blood [color-scheme:dark] ${className}`}
      {...rest}
    />
  );
}

/** Error under a control; give the control `invalidProps(id, message)`. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs text-blood-bright">
      {message}
    </p>
  );
}

/** aria wiring for a control whose error renders in <FieldError id={`${id}-error`}>. */
export function invalidProps(id: string, message?: string) {
  return message ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` } : {};
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="border border-blood bg-ink px-5 py-4 text-sm leading-relaxed text-ash">
      {message}
    </p>
  );
}

export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="status" className="border-l-2 border-blood bg-surface-2 px-5 py-4 text-sm text-bone">
      {message}
    </p>
  );
}
