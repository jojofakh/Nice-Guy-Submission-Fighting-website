import { AuthShell, authLink } from "@/components/auth-shell";
import { ForgotPasswordForm } from "@/components/auth-forms";
import { Link, useDocumentTitle } from "@/lib/router";

export default function ForgotPasswordPage() {
  useDocumentTitle("Reset your password — NGSF");

  return (
    <AuthShell
      panel={{
        kicker: "Train. Learn. Improve.",
        title: (
          <>
            Back on the
            <br />
            <span className="text-blood">mats soon.</span>
          </>
        ),
        intro: "We will email you a secure link to choose a new password.",
      }}
      kicker="Account"
      title="Forgot password?"
      intro="Enter the email on your account and we will send you a reset link."
      footer={
        <Link href="/login" className={authLink}>
          &larr; Back to log in
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
