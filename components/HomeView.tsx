"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { logout as apiLogout } from "@/lib/api";
import { Card, User } from "@/lib/types";
import Board from "@/components/Board";
import styles from "@/app/page.module.scss";

interface Props {
  user: User;
  initialCards: Card[];
  initialUsers: User[];
}

export default function HomeView({ user, initialCards, initialUsers }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await apiLogout();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Kanban</h1>
        <div className={styles.user}>
          <Image src={user.avatarUrl} alt={user.displayName} width={28} height={28} />
          <span>{user.displayName}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <Board initialCards={initialCards} initialUsers={initialUsers} />
    </div>
  );
}
