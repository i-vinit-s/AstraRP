import ProfileHero from "@/components/profile/ProfileHero";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileDanger from "@/components/profile/ProfileDanger";

export const metadata = {
  title: "My Profile | Astra Roleplay",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#090909] pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#c92a2a]">
            Account
          </p>

          <h1 className="mt-3 text-5xl font-bold">My Profile</h1>

          <p className="mt-4 max-w-2xl text-zinc-400 leading-8">
            Manage your Astra Roleplay account, view your profile information
            and monitor your activity.
          </p>
        </div>

        <div className="space-y-8">
          <ProfileHero />

          <ProfileStats />

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <ProfileInfo />

            <ProfileDanger />
          </div>
        </div>
      </div>
    </main>
  );
}
