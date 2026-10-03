'use client';

import { useEffect } from 'react';
import styles from './error.module.scss';

interface Props {
    error: Error & { digest?: string };
    unstable_retry: () => void;
}

export default function ErrorPage({ error, unstable_retry }: Props) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className={styles.error}>
            <div className={styles.error__card}>
                <h1>Something went wrong</h1>
                <p>We couldn&apos;t load the board. The server may be unavailable right now.</p>
                <button onClick={() => unstable_retry()}>Try again</button>
            </div>
        </div>
    );
}
