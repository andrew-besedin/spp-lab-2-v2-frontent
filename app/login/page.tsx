import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/server-api";
import { githubLoginUrl } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import styles from "./page.module.scss";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const userRes = await getServerUser();

  if (userRes.success && userRes.data) {
    redirect("/");
  }

  if (!userRes.success && userRes.data !== "UNAUTHORIZED") {
    throw new Error(`Failed to load user: ${userRes.data}`);
  }

  return (
    <div className={styles.login}>
      <div className={styles.login__card}>
        <h1>Kanban</h1>
        <p>Sign in to view the board</p>
        {error && <p className={styles.login__error}>{getErrorMessage(error)}</p>}
        <a className={styles.login__button} href={githubLoginUrl()}>
          Sign in with GitHub
        </a>
      </div>
    </div>
  );
}
