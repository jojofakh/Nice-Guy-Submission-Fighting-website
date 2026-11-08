import { AnnouncementForm, DeleteAnnouncementButton } from "@/components/portal/announcement-form";
import { FormSuccess } from "@/components/field";
import { Badge, ButtonLink, Card, EmptyRow, PortalHeader, rowAction } from "@/components/portal/ui";
import { formatTimestamp } from "@/lib/gym-time";
import { categoryLabel } from "@/lib/portal";
import { Link, useDocumentTitle, useSearchParams } from "@/lib/router";
import { useData } from "@/lib/store";

const savedMessages: Record<string, string> = {
  published: "Announcement published. Members can see it now.",
  updated: "Announcement updated.",
  deleted: "Announcement deleted.",
};

export default function ManageAnnouncementsPage() {
  useDocumentTitle("Manage announcements — NGSF admin");
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved");
  const edit = searchParams.get("edit");

  const { announcements } = useData();
  const editing = typeof edit === "string" ? announcements.find((a) => a.id === edit) : undefined;

  return (
    <div className="space-y-8">
      <PortalHeader
        kicker="Admin portal"
        title="Manage announcements"
        intro="Publish and maintain updates for all gym members."
        actions={<ButtonLink href="/admin/announcements#announcement-form">+ New announcement</ButtonLink>}
      />

      {typeof saved === "string" ? <FormSuccess message={savedMessages[saved]} /> : null}

      <div className="grid items-start gap-6 lg:grid-cols-[3fr_2fr]">
        <Card title="Published announcements">
          {announcements.length === 0 ? (
            <EmptyRow>Nothing published yet. Use the form to post the first one.</EmptyRow>
          ) : (
            <ul className="divide-y divide-line">
              {announcements.map((a) => (
                <li
                  key={a.id}
                  className={`flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-start sm:px-7 ${
                    a.id === editing?.id ? "bg-surface-2" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge tone={a.category === "closure" ? "blood" : "default"}>{categoryLabel(a.category)}</Badge>
                      <span className="font-mono text-[10px] tracking-wider text-ash-dim">{formatTimestamp(a.publishedAt)}</span>
                    </div>
                    <p className="mt-3 text-sm text-bone">{a.title}</p>
                    <p className="mt-1 line-clamp-2 whitespace-pre-line text-sm text-ash">{a.body}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-5">
                    <Link
                      href={`/admin/announcements?edit=${a.id}#announcement-form`}
                      className={rowAction}
                    >
                      Edit
                    </Link>
                    <DeleteAnnouncementButton id={a.id} title={a.title} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div id="announcement-form" className="scroll-mt-8">
          <Card
            title={editing ? "Edit announcement" : "New announcement"}
            footer="Announcements are visible to all members as soon as they are published."
          >
            {/* key: switching between "new" and "edit X" resets the fields. */}
            <AnnouncementForm key={editing?.id ?? "new"} announcement={editing} />
          </Card>
        </div>
      </div>
    </div>
  );
}
