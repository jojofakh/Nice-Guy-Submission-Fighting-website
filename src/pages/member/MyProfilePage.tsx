import { PhotoForm, ProfileForm } from "@/components/portal/profile-form";
import { Card, PortalHeader } from "@/components/portal/ui";
import { avatarUrl } from "@/lib/auth";
import { formatTimestamp, gymToday } from "@/lib/gym-time";
import { useDocumentTitle } from "@/lib/router";
import { useCurrentProfile } from "@/lib/store";

export default function MyProfilePage() {
  useDocumentTitle("My profile — NGSF members");
  const profile = useCurrentProfile();
  if (!profile) return null;
  const photo = avatarUrl(profile.avatarPath);
  const name = profile.fullName || profile.email;

  return (
    <div className="space-y-8">
      <PortalHeader
        kicker="Member portal"
        title="My profile"
        intro="Keep your details up to date so the coaches know who you are and who to call in an emergency."
      />

      <div className="grid items-start gap-8 lg:grid-cols-[18rem_1fr]">
        <Card
          title="Photo"
          footer={`Member since ${formatTimestamp(profile.createdAt, { month: "long", year: "numeric" })}`}
        >
          <PhotoForm name={name} url={photo} />
        </Card>

        <Card title="Your details">
          <ProfileForm profile={profile} maxDate={gymToday()} />
        </Card>
      </div>
    </div>
  );
}
