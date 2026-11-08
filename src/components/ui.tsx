import { Link } from "@/lib/router";
import type { ComponentProps, ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>
  );
}

export function Section({
  children,
  className = "",
  flush = false,
  ...rest
}: ComponentProps<"section"> & {
  /** Drops the top rule and top padding, for the section directly under a PageHeader. */
  flush?: boolean;
}) {
  // Composed as one string rather than layering `pt-0` on top of `py-20
  // sm:py-28`, which would lose to the media query at sm and above.
  const spacing = flush ? "pb-20 sm:pb-28" : "border-t border-line py-20 sm:py-28";
  return (
    <section className={`${spacing} ${className}`} {...rest}>
      {children}
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  intro,
  align = "left",
}: {
  kicker?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h2 className="mt-3 text-3xl leading-[0.95] sm:text-5xl">{title}</h2>
      {intro ? <p className="mt-5 text-base leading-relaxed text-ash">{intro}</p> : null}
    </div>
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const buttonVariants = {
  primary:
    "bg-blood px-6 py-3.5 text-bone hover:bg-blood-bright active:bg-blood",
  secondary:
    "border border-line-bright px-6 py-3.5 text-bone hover:border-bone hover:bg-surface-2",
  ghost: "px-2 py-1 text-ash hover:text-bone",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

/** Button styling for elements that are not a Button or ButtonLink. */
export function buttonClass(variant: ButtonVariant = "primary") {
  return `${buttonBase} ${buttonVariants[variant]}`;
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  ...rest
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return (
    <Link
      href={href}
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Small outlined metadata chip (levels, ages, mat numbers). */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ash-dim">
      {children}
    </span>
  );
}
