import { ClassTable } from "@/components/portal/class-table";
import { FormSuccess } from "@/components/field";
import { Card, ButtonLink, PortalHeader } from "@/components/portal/ui";
import { useDocumentTitle, useSearchParams } from "@/lib/router";
import { useData } from "@/lib/store";

const savedMessages: Record<string, string> = {
  added: "Class added to the schedule.",
  updated: "Class updated.",
};

export default function ManageClassesPage() {
  useDocumentTitle("Manage classes — NGSF admin");
  const saved = useSearchParams().get("saved");
  const { classes } = useData();

  return (
    <div className="space-y-8">
      <PortalHeader
        kicker="Admin portal"
        title="Manage classes"
        intro="Create, update, or cancel classes on the gym schedule."
        actions={<ButtonLink href="/admin/classes/new">+ Add Class</ButtonLink>}
      />

      {typeof saved === "string" ? <FormSuccess message={savedMessages[saved]} /> : null}

      <Card
        title="Weekly class list"
        footer="Cancelled classes stay on the list, so attendance history keeps its class. Members see them marked as cancelled."
      >
        <ClassTable classes={classes} />
      </Card>
    </div>
  );
}
