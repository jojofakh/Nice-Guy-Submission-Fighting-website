import { AuthShell, authLink } from "@/components/auth-shell";
import { RegisterForm } from "@/components/auth-forms";
import { Link, useDocumentTitle } from "@/lib/router";

export default function RegisterPage() {
  useDocumentTitle("Create an account — NGSF");

  return (
    <AuthShell
      panel={{
        kicker: "Join the team",
        title: (
          <>
            Build skill.
            <br />
            <span className="text-blood">Find community.</span>
          </>
        ),
        intro: "Create your member account to stay informed and keep track of your training.",
        footnote: "Member registration only · Admin access is assigned by staff",
      }}
      kicker="Member registration"
      title="Create your account"
      intro="Enter your details to set up membership access."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className={authLink}>
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
