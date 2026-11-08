import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { useActions } from "@/lib/store";
import type { ActionState } from "@/lib/portal";
import type { Profile } from "@/lib/auth";
import {
  FieldError,
  FieldGroup,
  FormError,
  FormSuccess,
  Input,
  Label,
  invalidProps,
} from "@/components/field";
import { Avatar, Button, rowActionDanger } from "@/components/portal/ui";

type Details = Pick<
  Profile,
  "fullName" | "email" | "birthDate" | "phone" | "emergencyContactName" | "emergencyContactPhone"
>;

export function ProfileForm({ profile, maxDate }: { profile: Details; maxDate: string }) {
  const { saveProfile } = useActions();
  const [state, action, pending] = useActionState(saveProfile, {} as ActionState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5 px-5 py-6 sm:px-7" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="pf-name">Full name</Label>
          <Input
            id="pf-name"
            name="fullName"
            required
            maxLength={120}
            autoComplete="name"
            defaultValue={profile.fullName}
            {...invalidProps("pf-name", errors.fullName)}
          />
          <FieldError id="pf-name-error" message={errors.fullName} />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="pf-email" hint="Contact the gym to change">
            Email
          </Label>
          <Input id="pf-email" type="email" value={profile.email} disabled readOnly />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="pf-birth">Birth date</Label>
          <Input
            id="pf-birth"
            name="birthDate"
            type="date"
            min="1900-01-01"
            max={maxDate}
            autoComplete="bday"
            defaultValue={profile.birthDate ?? ""}
            {...invalidProps("pf-birth", errors.birthDate)}
          />
          <FieldError id="pf-birth-error" message={errors.birthDate} />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="pf-phone">Phone</Label>
          <Input
            id="pf-phone"
            name="phone"
            type="tel"
            maxLength={30}
            autoComplete="tel"
            placeholder="(812) 000-0000"
            defaultValue={profile.phone}
            {...invalidProps("pf-phone", errors.phone)}
          />
          <FieldError id="pf-phone-error" message={errors.phone} />
        </FieldGroup>
      </div>

      <fieldset className="space-y-5 border-t border-line pt-5">
        <legend className="kicker pr-3">Emergency contact</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <FieldGroup>
            <Label htmlFor="pf-em-name">Name</Label>
            <Input
              id="pf-em-name"
              name="emergencyName"
              maxLength={120}
              placeholder="Who should we call?"
              defaultValue={profile.emergencyContactName}
              {...invalidProps("pf-em-name", errors.emergencyName)}
            />
            <FieldError id="pf-em-name-error" message={errors.emergencyName} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="pf-em-phone">Phone</Label>
            <Input
              id="pf-em-phone"
              name="emergencyPhone"
              type="tel"
              maxLength={30}
              placeholder="(812) 000-0000"
              defaultValue={profile.emergencyContactPhone}
              {...invalidProps("pf-em-phone", errors.emergencyPhone)}
            />
            <FieldError id="pf-em-phone-error" message={errors.emergencyPhone} />
          </FieldGroup>
        </div>
      </fieldset>

      <FormError message={state.error} />
      <FormSuccess message={state.ok ? state.message : undefined} />

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}

const PHOTO_SIZE = 512;

/** Centre-crop to a square and re-encode as a small JPEG. Also strips EXIF (including GPS). */
async function toSquareJpeg(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = PHOTO_SIZE;
  canvas.height = PHOTO_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    PHOTO_SIZE,
    PHOTO_SIZE,
  );
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Encode failed"))), "image/jpeg", 0.85),
  );
}

export function PhotoForm({ name, url }: { name: string; url: string | null }) {
  const { savePhoto, removePhoto } = useActions();
  const [state, action, pending] = useActionState(savePhoto, {} as ActionState);
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setLocalError(undefined);
    if (!file.type.startsWith("image/")) {
      setLocalError("Choose an image file (JPG, PNG, or similar).");
      return;
    }
    try {
      const blob = await toSquareJpeg(file);
      setPreview(URL.createObjectURL(blob));
      const data = new FormData();
      data.set("photo", new File([blob], "avatar.jpg", { type: "image/jpeg" }));
      startTransition(() => action(data));
    } catch {
      setLocalError("That image could not be read. Try a JPG or PNG.");
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 px-5 py-6 text-center sm:px-7">
      {/* The local preview covers the upload; afterwards the page re-renders with the stored photo. */}
      <Avatar url={pending && preview ? preview : url} name={name} size="lg" />
      <input
        ref={inputRef}
        id="pf-photo"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onPick}
        disabled={pending}
      />
      <div className="flex flex-col items-center gap-3">
        <Button type="button" variant="secondary" disabled={pending} onClick={() => inputRef.current?.click()}>
          {pending ? "Uploading…" : url ? "Change photo" : "Upload photo"}
        </Button>
        {url && !pending ? (
          <form
            action={removePhoto}
            onSubmit={(e) => {
              if (!window.confirm("Remove your profile photo?")) e.preventDefault();
            }}
          >
            <button type="submit" className={rowActionDanger}>
              Remove photo
            </button>
          </form>
        ) : null}
      </div>
      <p className="text-xs text-ash-dim">Square crop, any image format. In this prototype the photo stays in your browser.</p>
      <FormError message={localError ?? state.error} />
      <FormSuccess message={state.ok ? state.message : undefined} />
    </div>
  );
}
