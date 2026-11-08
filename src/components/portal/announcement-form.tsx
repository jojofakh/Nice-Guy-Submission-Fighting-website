import { Link } from "@/lib/router";
import { useActionState } from "react";
import { useActions } from "@/lib/store";
import { announcementCategories, type ActionState, type Announcement } from "@/lib/portal";
import {
  invalidProps,
  FieldGroup,
  FieldError,
  FormError,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/field";
import { Button, buttonClass, rowActionDanger } from "@/components/portal/ui";

export function AnnouncementForm({ announcement }: { announcement?: Announcement }) {
  const { saveAnnouncement } = useActions();
  const [state, action, pending] = useActionState(saveAnnouncement, {} as ActionState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5 px-5 py-6 sm:px-7" noValidate>
      {announcement ? <input type="hidden" name="id" value={announcement.id} /> : null}

      <FieldGroup>
        <Label htmlFor="ann-category">Category</Label>
        <Select
          id="ann-category"
          name="category"
          defaultValue={announcement?.category ?? "general"}
          {...invalidProps("ann-category", errors.category)}
        >
          {announcementCategories.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </Select>
        <FieldError id="ann-category-error" message={errors.category} />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="ann-title">Title</Label>
        <Input
          id="ann-title"
          name="title"
          required
          maxLength={120}
          defaultValue={announcement?.title}
          placeholder="Enter announcement title"
          {...invalidProps("ann-title", errors.title)}
        />
        <FieldError id="ann-title-error" message={errors.title} />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="ann-body">Message</Label>
        <Textarea
          id="ann-body"
          name="body"
          required
          rows={7}
          maxLength={2000}
          defaultValue={announcement?.body}
          placeholder="Write the message members will see…"
          {...invalidProps("ann-body", errors.body)}
        />
        <FieldError id="ann-body-error" message={errors.body} />
      </FieldGroup>

      <FormError message={state.error} />

      <div className="flex justify-end gap-3">
        <Link href="/admin/announcements" className={buttonClass("secondary")}>
          Cancel
        </Link>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : announcement ? "Save changes" : "Publish"}
        </Button>
      </div>
    </form>
  );
}

/** Delete with a browser confirm, since it cannot be undone. */
export function DeleteAnnouncementButton({ id, title }: { id: string; title: string }) {
  const { deleteAnnouncement } = useActions();
  return (
    <form
      action={deleteAnnouncement}
      onSubmit={(e) => {
        if (!window.confirm(`Delete “${title}”? Members will no longer see it.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={rowActionDanger}>
        Delete
      </button>
    </form>
  );
}
