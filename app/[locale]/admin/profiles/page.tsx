import { createClient } from "@/lib/supabase/server";

import ProfileCard from "./components/ProfileCard";
import ProfileTitle from "./components/ProfileTitle";
import { updateProfile } from "./actions";

export default async function AdminProfilesPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("*");

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <ProfileTitle />
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {profiles?.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onUpdate={updateProfile}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
