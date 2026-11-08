import { AuthShell, authLink } from "@/components/auth-shell";
import { LoginForm } from "@/components/auth-forms";
import { DEMO_PASSWORD, initialProfiles } from "@/data/mock-data";
import { safeNextPath } from "@/lib/auth";
import { Link, useDocumentTitle, useSearchParams } from "@/lib/router";

const demoAccounts = initialProfiles.filter((p) => p.id === "user-jordan" || p.id === "user-alex");

export default function LoginPage() {
  useDocumentTitle("Log in — NGSF");
  const next = useSearchParams().get("next");

  return (
    <AuthShell
      panel={{
        kicker: "Train. Learn. Improve.",
        title: (
          <>
            Your training
            <br />
            <span className="text-blood">starts here.</span>
          </>
        ),
        intro: "Access class schedules, gym updates, and your attendance history in one place.",
      }}
      kicker="Member access"
      title="Welcome back"
      intro="Log in to your NGSF member account."
      footer={
        <>
          New to NGSF?{" "}
          <Link href="/register" className={authLink}>
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm next={next ? safeNextPath(next) : undefined} />

      <div className="mt-10 border border-dashed border-line-bright p-5">
        <p className="kicker">Prototype demo accounts</p>
        <ul className="mt-4 space-y-2 font-mono text-xs text-ash">
          {demoAccounts.map((p) => (
            <li key={p.id} className="flex flex-wrap justify-between gap-2">
              <span className="uppercase tracking-[0.14em] text-blood">{p.role}</span>
              <span className="text-bone">{p.email}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[11px] tracking-wider text-ash-dim">
          Password for both: <span className="text-bone">{DEMO_PASSWORD}</span>
        </p>
      </div>
    </AuthShell>
  );
}
