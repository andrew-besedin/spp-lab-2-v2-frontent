import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/server-api";
import { githubLoginUrl } from "@/lib/api";
import styles from "./page.module.scss";

export default async function LoginPage() {
  const userRes = await getServerUser();

  if (userRes.success && userRes.data) {
    redirect("/");
  }

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
