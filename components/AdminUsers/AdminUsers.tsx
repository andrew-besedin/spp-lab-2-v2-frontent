'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getAdminUsers, updateUserRole } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { AdminUser, AssignableRole } from '@/lib/types';
import styles from './AdminUsers.module.scss';

const ROLE_OPTIONS: { value: AssignableRole; label: string }[] = [
    { value: 'user', label: 'User' },
    { value: 'moderator', label: 'Moderator' },
];

interface Props {
    initialUsers: AdminUser[];
}

export default function AdminUsers({ initialUsers }: Props) {
    const [users, setUsers] = useState<AdminUser[]>(initialUsers);
    const [query, setQuery] = useState('');
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const normalizedQuery = query.trim().toLowerCase();
    const visibleUsers = normalizedQuery
        ? users.filter(
              (u) =>
                  u.username.toLowerCase().includes(normalizedQuery) ||
                  u.displayName.toLowerCase().includes(normalizedQuery),
          )
        : users;

    function showError(message: string) {
        setError(message);
        setTimeout(() => setError(null), 3000);
    }

    async function refresh() {
        const res = await getAdminUsers();

        if (!res.success) {
            showError(getErrorMessage(res.data));
            return;
        }

        setUsers(res.data);
    }

    async function handleRoleChange(user: AdminUser, role: AssignableRole) {
        if (user.role === role || pendingId !== null) return;

        setPendingId(user.id);
        const res = await updateUserRole(user.id, role);
        setPendingId(null);

        if (res.success) {
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, role: res.data.role } : u)),
            );
            return;
        }

        showError(getErrorMessage(res.data));

        if (res.data === 'USER_NOT_FOUND' || res.data === 'ADMIN_ROLE_LOCKED') {
            await refresh();
        }
    }

    return (
        <section className={styles.users}>
            <div className={styles.users__head}>
                <div>
                    <h3>Users</h3>
                    <p>Promote users to moderators or revoke moderator access.</p>
                </div>
                <input
                    className={styles.users__search}
                    type="search"
                    placeholder="Search by name or username"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {error && <div className={styles.users__error}>{error}</div>}

            <ul className={styles.users__list}>
                {visibleUsers.map((user) => (
                    <li key={user.id} className={styles.users__row}>
                        <div className={styles.users__identity}>
                            <Image
                                src={user.avatarUrl}
                                alt={user.displayName}
                                width={36}
                                height={36}
                                unoptimized
                            />
                            <div className={styles.users__names}>
                                <span className={styles.users__displayName}>
                                    {user.displayName}
                                </span>
                                <span className={styles.users__username}>@{user.username}</span>
                            </div>
                        </div>

                        <span className={styles.users__joined}>
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>

                        {user.role === 'admin' ? (
                            <span className={styles.users__adminBadge}>Admin</span>
                        ) : (
                            <div
                                className={styles.users__roles}
                                role="radiogroup"
                                aria-label={`Role of ${user.username}`}
                            >
                                {ROLE_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="radio"
                                        aria-checked={user.role === option.value}
                                        disabled={pendingId !== null}
                                        className={
                                            user.role === option.value
                                                ? `${styles.users__role} ${styles['users__role--active']}`
                                                : styles.users__role
                                        }
                                        onClick={() => handleRoleChange(user, option.value)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {visibleUsers.length === 0 && <p className={styles.users__empty}>No users found.</p>}
        </section>
    );
}
