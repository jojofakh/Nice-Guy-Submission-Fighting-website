import { ClassForm } from "@/components/portal/class-form";
import { Card, PortalHeader, quietLink } from "@/components/portal/ui";
import { Link, useDocumentTitle } from "@/lib/router";

export default function NewClassPage() {
  useDocumentTitle("Add class — NGSF admin");

  return (
    <div className="space-y-8">
      <Link href="/admin/classes" className={quietLink}>
        &larr; All classes
      </Link>
      <PortalHeader kicker="Admin portal" title="Add a class" intro="It repeats every week on the day you pick." />
      <Card title="Class details" className="max-w-3xl">
        <ClassForm />
      </Card>
    </div>
  );
}
