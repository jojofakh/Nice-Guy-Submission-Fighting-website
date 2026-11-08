import { ClassForm } from "@/components/portal/class-form";
import { Card, PortalHeader, quietLink } from "@/components/portal/ui";
import { formatTime, weekdayName } from "@/lib/gym-time";
import { Link, useDocumentTitle } from "@/lib/router";
import { useData } from "@/lib/store";
import NotFoundPage from "@/pages/NotFoundPage";

export default function EditClassPage({ id }: { id: string }) {
  useDocumentTitle("Edit class — NGSF admin");
  const gymClass = useData().classes.find((c) => c.id === id);
  if (!gymClass) return <NotFoundPage />;

  return (
    <div className="space-y-8">
      <Link href="/admin/classes" className={quietLink}>
        &larr; All classes
      </Link>
      <PortalHeader
        kicker="Admin portal"
        title={`Edit ${gymClass.name}`}
        intro={`${weekdayName(gymClass.day)} · ${formatTime(gymClass.startsAt)}`}
      />
      <Card title="Class details" className="max-w-3xl">
        <ClassForm gymClass={gymClass} />
      </Card>
    </div>
  );
}
