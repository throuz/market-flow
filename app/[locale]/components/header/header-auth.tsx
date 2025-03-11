import { Link } from "@/i18n/navigation";

import { User } from "@supabase/supabase-js";
import { signOutAction } from "@/app/[locale]/actions";

import { Button } from "../../../../components/ui/button";
import LocaleSwitcherSelect from "./locale-switcher";

interface HeaderAuthProps {
  user: User | null;
}

export default function HeaderAuth({ user }: HeaderAuthProps) {
  return user ? (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <LocaleSwitcherSelect />
      Hey, {user.email}
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex flex-col sm:flex-row gap-2">
      <LocaleSwitcherSelect />
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
