"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { githubLoginUrl } from "@/lib/api";
import styles from "./page.module.scss";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Kanban</h1>
        <p>Sign in to view the board</p>
        <a className={styles.button} href={githubLoginUrl()}>
          Sign in with GitHub
        </a>
      </div>
    </div>
  );
}
