"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Board from "@/components/Board";
import styles from "./page.module.scss";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className={styles.loading}>Loading…</div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Kanban</h1>
        <div className={styles.user}>
          <Image src={user.avatarUrl} alt={user.displayName} width={28} height={28} />
          <span>{user.displayName}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <Board />
    </div>
  );
}
