import { Link } from "@/lib/router";
import { useActionState } from "react";
import { useActions, type AuthFormState } from "@/lib/store";
import {
  invalidProps,
  Checkbox,
  FieldGroup,
  FieldError,
  FormError,
  Input,
  Label,
} from "@/components/field";
import { Button } from "@/components/ui";

const empty: AuthFormState = {};

function Notice({ message }: { message: string }) {
  return (
    <div role="status" className="border border-blood bg-surface p-8">
      <p className="kicker">Request received</p>
      <h2 className="mt-4 text-3xl">Check your inbox</h2>
      <p className="mt-4 text-sm leading-relaxed text-ash">{message}</p>
      <p className="mt-6 font-mono text-[10px] leading-relaxed tracking-wider text-ash-dim">
        Prototype: no email is actually sent. Use a demo account to sign in.
      </p>
    </div>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const { signIn } = useActions();
  const [state, action, pending] = useActionState(signIn, empty);
  const error = state.error;

  return (
    <form action={action} className="space-y-6" noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <FieldGroup>
        <Label htmlFor="login-email">Email address</Label>
        <Input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.email}
          placeholder="you@example.com"
        />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Enter your password"
        />
      </FieldGroup>

      <div className="flex items-center justify-between gap-4">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-ash">
          <Checkbox name="remember" />
          Remember me
        </label>
        <Link
          href="/forgot-password"
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash-dim transition-colors hover:text-bone"
        >
          Forgot password?
        </Link>
      </div>

      <FormError message={error} />

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}

export function RegisterForm() {
  const { signUp } = useActions();
  const [state, action, pending] = useActionState(signUp, empty);
  const errors = state.fieldErrors ?? {};

  if (state.notice) return <Notice message={state.notice} />;

  return (
    <form action={action} className="space-y-6" noValidate>
      <FieldGroup>
        <Label htmlFor="register-name">Full name</Label>
        <Input
          id="register-name"
          name="fullName"
          required
          maxLength={120}
          autoComplete="name"
          defaultValue={state.fullName}
          placeholder="Jordan Davis"
          {...invalidProps("register-name", errors.fullName)}
        />
        <FieldError id="register-name-error" message={errors.fullName} />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="register-email">Email address</Label>
        <Input
          id="register-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.email}
          placeholder="you@example.com"
          {...invalidProps("register-email", errors.email)}
        />
        <FieldError id="register-email-error" message={errors.email} />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          {...invalidProps("register-password", errors.password)}
        />
        <FieldError id="register-password-error" message={errors.password} />
      </FieldGroup>

      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ash">
          <Checkbox name="agree" required className="mt-1" {...invalidProps("register-agree", errors.agree)} />
          <span>I agree to the gym policies and membership terms.</span>
        </label>
        <FieldError id="register-agree-error" message={errors.agree} />
      </div>

      <FormError message={state.error} />

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const { requestPasswordReset } = useActions();
  const [state, action, pending] = useActionState(requestPasswordReset, empty);
  const errors = state.fieldErrors ?? {};

  if (state.notice) return <Notice message={state.notice} />;

  return (
    <form action={action} className="space-y-6" noValidate>
      <FieldGroup>
        <Label htmlFor="forgot-email">Email address</Label>
        <Input
          id="forgot-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.email}
          placeholder="you@example.com"
          {...invalidProps("forgot-email", errors.email)}
        />
        <FieldError id="forgot-email-error" message={errors.email} />
      </FieldGroup>

      <FormError message={state.error} />

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const { updatePassword } = useActions();
  const [state, action, pending] = useActionState(updatePassword, empty);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-6" noValidate>
      <FieldGroup>
        <Label htmlFor="reset-password">New password</Label>
        <Input
          id="reset-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          {...invalidProps("reset-password", errors.password)}
        />
        <FieldError id="reset-password-error" message={errors.password} />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="reset-confirm">Confirm new password</Label>
        <Input
          id="reset-confirm"
          name="confirm"
          type="password"
          required
          autoComplete="new-password"
          {...invalidProps("reset-confirm", errors.confirm)}
        />
        <FieldError id="reset-confirm-error" message={errors.confirm} />
      </FieldGroup>

      <FormError message={state.error} />

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : "Save new password"}
      </Button>
    </form>
  );
}
