import { redirect } from "next/navigation";
import { getServerUser, getServerCards, getServerUsers } from "@/lib/server-api";
import HomeView from "@/components/HomeView/HomeView";

export default async function Home() {
  const userRes = await getServerUser();

  if (!userRes.success || !userRes.data) {
    redirect("/login");
  }

  const [cardsRes, usersRes] = await Promise.all([getServerCards(), getServerUsers()]);

  return (
    <HomeView
      user={userRes.data}
      initialCards={cardsRes.success ? cardsRes.data : []}
      initialUsers={usersRes.success ? usersRes.data : []}
    />
  );
}
