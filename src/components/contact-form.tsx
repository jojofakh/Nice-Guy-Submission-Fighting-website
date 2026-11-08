import { useState } from "react";
import { programs } from "@/lib/classes";
import { site } from "@/lib/site";
import { FieldGroup, Input, Label, Select, Textarea } from "@/components/field";
import { Button } from "@/components/ui";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const initial = {
  name: "",
  email: "",
  phone: "",
  interest: "",
  message: "",
};

/**
 * Free-class enquiry form. Every field is controlled state. Validation runs in
 * the browser; there is no mail server in this prototype, so a valid message
 * is "sent" after a short pause to show the loading and success states.
 */
const MAX_MESSAGE = 2000;

/** Same rules as the real site's /api/contact endpoint. Returns the first problem, if any. */
function validate(values: typeof initial): string | undefined {
  if (!values.name.trim()) return "Tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) return "Enter a valid email address.";
  if (values.message.length > MAX_MESSAGE) return `Keep your message under ${MAX_MESSAGE} characters.`;
  return undefined;
}

export function ContactForm() {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const set = (key: keyof typeof initial) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "sending" });

    const problem = validate(values);
    if (problem) {
      setStatus({ kind: "error", message: problem });
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    setValues(initial);
    setStatus({ kind: "sent" });
  }

  if (status.kind === "sent") {
    return (
      <div className="border border-blood bg-surface p-10 text-center">
        <p className="kicker">Message received</p>
        <h2 className="mt-4 text-3xl">See you on the mats</h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ash">
          We will get back to you shortly to set up your free class.
        </p>
        <Button
          variant="secondary"
          className="mt-8"
          onClick={() => setStatus({ kind: "idle" })}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-surface p-8 sm:p-10">
      <p className="kicker">Book a free class</p>
      <h2 className="mt-3 text-2xl sm:text-3xl">Have us contact you</h2>
      <p className="mt-4 text-sm leading-relaxed text-ash">
        Tell us what you want to train and we will point you at the right class to start with.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
            placeholder="Jordan Reyes"
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            placeholder="you@example.com"
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="contact-phone" hint="optional">
            Phone
          </Label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={set("phone")}
            placeholder="(812) 000-0000"
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="contact-interest">I want to train</Label>
          <Select
            id="contact-interest"
            name="interest"
            value={values.interest}
            onChange={set("interest")}
          >
            <option value="">Not sure yet</option>
            {programs.map((p) => (
              <option key={p.slug} value={p.name}>
                {p.name}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <div className="sm:col-span-2">
          <FieldGroup>
            <Label htmlFor="contact-message" hint="optional">
              Anything else
            </Label>
            <Textarea
              id="contact-message"
              name="message"
              rows={4}
              maxLength={2000}
              value={values.message}
              onChange={set("message")}
              placeholder="Total beginner, looking to train two evenings a week."
            />
          </FieldGroup>
        </div>
      </div>

      {status.kind === "error" ? (
        <p
          role="alert"
          className="mt-6 border border-blood bg-ink px-5 py-4 text-sm leading-relaxed text-ash"
        >
          {status.message} Or call{" "}
          <a
            href={site.phoneHref}
            className="text-bone underline decoration-blood underline-offset-4"
          >
            {site.phone}
          </a>
        </p>
      ) : null}

      <Button type="submit" disabled={status.kind === "sending"} className="mt-8 w-full">
        {status.kind === "sending" ? "Sending…" : "Send it"}
      </Button>

      <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-wider text-ash-dim">
        We only use your details to get back to you about training. No lists, no spam.
      </p>
    </form>
  );
}
