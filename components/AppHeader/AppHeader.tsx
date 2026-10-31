'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout as apiLogout } from '@/lib/api';
import { CurrentUser, UserRole } from '@/lib/types';
import styles from './AppHeader.module.scss';

const ROLE_LABELS: Record<UserRole, string> = {
    user: 'User',
    moderator: 'Moderator',
    admin: 'Admin',
};

interface Props {
    user: CurrentUser;
}

export default function AppHeader({ user }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Board' },
        ...(user.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
    ];

    async function handleLogout() {
        await apiLogout();
        router.replace('/login');
        router.refresh();
    }

    return (
        <header className={styles.header}>
            <div className={styles.header__left}>
                <h1>Kanban</h1>
                {links.length > 1 && (
                    <nav className={styles.header__nav}>
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={
                                    pathname === link.href
                                        ? `${styles.header__link} ${styles['header__link--active']}`
                                        : styles.header__link
                                }
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
            <div className={styles.header__user}>
                <Image
                    src={user.avatarUrl}
                    alt={user.displayName}
                    width={28}
                    height={28}
                    unoptimized
                />
                <span>{user.displayName}</span>
                {user.role !== 'user' && (
                    <span
                        className={`${styles.header__role} ${styles[`header__role--${user.role}`]}`}
                    >
                        {ROLE_LABELS[user.role]}
                    </span>
                )}
                <button onClick={handleLogout}>Logout</button>
            </div>
        </header>
    );
}
