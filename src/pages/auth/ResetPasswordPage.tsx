import { AuthShell, authLink } from "@/components/auth-shell";
import { ResetPasswordForm } from "@/components/auth-forms";
import { RequireUser } from "@/components/guards";
import { Link, useDocumentTitle } from "@/lib/router";

/** Signed-in members change their password here. */
export default function ResetPasswordPage() {
  useDocumentTitle("Choose a new password — NGSF");

  return (
    <RequireUser>
      {(profile) => (
        <AuthShell
          panel={{
            kicker: "Account security",
            title: (
              <>
                New
                <br />
                <span className="text-blood">password.</span>
              </>
            ),
            intro: "Pick something long and unique. You will stay signed in on this device.",
          }}
          kicker="Account"
          title="Choose a new password"
          intro={`For ${profile.email}.`}
          footer={
            <Link href="/dashboard" className={authLink}>
              &larr; Back to dashboard
            </Link>
          }
        >
          <ResetPasswordForm />
        </AuthShell>
      )}
    </RequireUser>
  );
}
