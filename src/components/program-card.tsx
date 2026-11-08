import { Link } from "@/lib/router";
import type { ClassProgram } from "@/lib/classes";
import { Tag } from "@/components/ui";

export function ProgramCard({
  program,
  variant = "compact",
  index,
}: {
  program: ClassProgram;
  variant?: "compact" | "full";
  index?: number;
}) {
  return (
    <article className="group relative flex h-full flex-col border border-line bg-surface p-7 transition-colors duration-300 hover:border-line-bright hover:bg-surface-2 sm:p-8">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-blood transition-transform duration-400 group-hover:scale-x-100"
      />

      {typeof index === "number" ? (
        <span className="font-mono text-[10px] tracking-[0.2em] text-ash-dim">
          {String(index + 1).padStart(2, "0")}
        </span>
      ) : null}

      <h3 className="mt-3 text-2xl sm:text-3xl">{program.name}</h3>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-blood">
        {program.blurb}
      </p>

      <p className="mt-5 flex-1 text-sm leading-relaxed text-ash">
        {variant === "full" ? program.body : program.body.split(". ")[0] + "."}
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-2">
        <Tag>{program.level}</Tag>
        <Tag>{program.ages}</Tag>
      </div>

      <Link
        href={`/schedule?class=${program.slug}`}
        className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
      >
        Class times
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          &rarr;
        </span>
      </Link>
    </article>
  );
}
