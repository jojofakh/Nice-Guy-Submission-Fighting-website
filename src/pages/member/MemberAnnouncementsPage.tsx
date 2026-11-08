import { Badge, Card, EmptyRow, FilterTabs, PortalHeader, Toolbar } from "@/components/portal/ui";
import { formatTimestamp } from "@/lib/gym-time";
import { announcementCategories, categoryLabel, isAnnouncementCategory } from "@/lib/portal";
import { useDocumentTitle, useSearchParams } from "@/lib/router";
import { useData } from "@/lib/store";

export default function MemberAnnouncementsPage() {
  useDocumentTitle("Announcements — NGSF members");
  const category = useSearchParams().get("category");
  const active = isAnnouncementCategory(category) ? category : "all";

  const all = useData().announcements;
  const latestId = all[0]?.id;
  const shown = active === "all" ? all : all.filter((a) => a.category === active);

  // Only offer tabs for categories that have posts (plus whichever is selected).
  const tabs = [
    { key: "all", label: "All updates", href: "/dashboard/announcements" },
    ...announcementCategories
      .filter((c) => c.key === active || all.some((a) => a.category === c.key))
      .map((c) => ({ key: c.key, label: c.plural, href: `/dashboard/announcements?category=${c.key}` })),
  ];

  return (
    <div className="space-y-8">
      <PortalHeader
        kicker="Member portal"
        title="Announcements"
        intro="Important gym updates, schedule changes, and competition news."
      />

      <Toolbar>
        <FilterTabs label="Filter announcements" tabs={tabs} active={active} />
        <p className="font-mono text-xs tracking-wider text-ash-dim" aria-live="polite">
          {shown.length} {shown.length === 1 ? "announcement" : "announcements"}
        </p>
      </Toolbar>

      {shown.length === 0 ? (
        <Card>
          <EmptyRow>Nothing posted here yet. Check back soon.</EmptyRow>
        </Card>
      ) : (
        <ul className="space-y-px border border-line bg-line">
          {shown.map((a) => {
            const isLatest = a.id === latestId;
            return (
              <li key={a.id} className="relative bg-surface px-6 py-8 sm:px-8">
                {isLatest ? <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-blood" /> : null}
                <article>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge tone={a.category === "closure" ? "blood" : "default"}>{categoryLabel(a.category)}</Badge>
                    {isLatest ? <Badge tone="solid">Latest</Badge> : null}
                    <span className="font-mono text-[10px] tracking-wider text-ash-dim">
                      {formatTimestamp(a.publishedAt)}
                      {a.updatedAt ? ` · updated ${formatTimestamp(a.updatedAt)}` : ""}
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl leading-tight sm:text-3xl">{a.title}</h2>
                  <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-relaxed text-ash">{a.body}</p>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
