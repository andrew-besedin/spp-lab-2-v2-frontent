'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getCard, updateCard, addComment } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { ActivityLogEntry, Card, CurrentUser, User } from '@/lib/types';
import { COLUMN_ORDER, COLUMN_LABELS, canTransition, ColumnStatus } from '@/lib/columns';
import { canManageCard } from '@/lib/permissions';
import Modal from '../Modal/Modal';
import CardForm, { CardFormValues } from '../CardForm/CardForm';
import styles from './CardDetailModal.module.scss';

interface Props {
    cardId: number;
    currentUser: CurrentUser;
    users: User[];
    onClose: () => void;
    onChanged: () => void;
}

function describeActivity(entry: ActivityLogEntry, userNames: Map<number, string>): string {
    const meta = (entry.meta ?? {}) as Record<string, string | number | null>;

    switch (entry.action) {
        case 'created':
            return 'created this card';
        case 'title_changed':
            return `changed the title to "${meta.to}"`;
        case 'description_changed':
            return 'updated the description';
        case 'priority_changed':
            return `changed priority from ${meta.from} to ${meta.to}`;
        case 'assignee_changed': {
            const from = meta.from ? (userNames.get(Number(meta.from)) ?? 'someone') : 'Unassigned';
            const to = meta.to ? (userNames.get(Number(meta.to)) ?? 'someone') : 'Unassigned';
            return `changed assignee from ${from} to ${to}`;
        }
        case 'status_changed':
            return `moved the card from ${COLUMN_LABELS[String(meta.from) as ColumnStatus]} to ${COLUMN_LABELS[String(meta.to) as ColumnStatus]}`;
        default:
            return entry.action;
    }
}

export default function CardDetailModal({ cardId, currentUser, users, onClose, onChanged }: Props) {
    const [card, setCard] = useState<Card | null>(null);
    const [values, setValues] = useState<CardFormValues | null>(null);
    const [commentBody, setCommentBody] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    async function load() {
        const res = await getCard(cardId);

        if (!res.success) {
            setLoadError(getErrorMessage(res.data));
            return;
        }

        setLoadError(null);
        setCard(res.data);
        setValues({
            title: res.data.title,
            description: res.data.description,
            priority: res.data.priority,
            assigneeId: res.data.assigneeId,
        });
    }

    function handleFailure(code: string) {
        setError(getErrorMessage(code));

        if (code === 'CARD_NOT_FOUND') {
            onChanged();
        }

        if (code === 'FORBIDDEN') {
            load();
            onChanged();
        }
    }

    useEffect(() => {
        (async () => {
            await load();
        })();
    }, [cardId]);

    async function handleSave() {
        if (!values) return;

        setError(null);
        setSaving(true);
        const res = await updateCard(cardId, values);
        setSaving(false);

        if (res.success) {
            await load();
            onChanged();
        } else {
            handleFailure(res.data);
        }
    }

    async function handleMove(target: ColumnStatus) {
        setError(null);
        const res = await updateCard(cardId, { status: target, position: 0 });

        if (res.success) {
            await load();
            onChanged();
        } else {
            handleFailure(res.data);

            if (res.data === 'INVALID_TRANSITION') {
                await load();
                onChanged();
            }
        }
    }

    async function handleAddComment() {
        if (!commentBody.trim()) return;

        setError(null);
        const res = await addComment(cardId, commentBody);

        if (res.success) {
            setCommentBody('');
            await load();
        } else {
            handleFailure(res.data);
        }
    }

    if (loadError) {
        return (
            <Modal onClose={onClose}>
                <p className={styles.cardDetail__error}>{loadError}</p>
                <div className={styles.cardDetail__actions}>
                    <button onClick={load}>Try again</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </Modal>
        );
    }

    if (!card || !values) {
        return (
            <Modal onClose={onClose}>
                <p>Loading…</p>
            </Modal>
        );
    }

    const userNames = new Map(users.map((u) => [u.id, u.displayName]));
    const timeline = [
        ...(card.comments ?? []).map((c) => ({
            type: 'comment' as const,
            date: c.createdAt,
            item: c,
        })),
        ...(card.activityLog ?? []).map((a) => ({
            type: 'activity' as const,
            date: a.createdAt,
            item: a,
        })),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const canEdit = canManageCard(currentUser, card);
    const currentIndex = COLUMN_ORDER.indexOf(card.status);
    const prevStatus = currentIndex > 0 ? COLUMN_ORDER[currentIndex - 1] : null;
    const nextStatus =
        currentIndex < COLUMN_ORDER.length - 1 ? COLUMN_ORDER[currentIndex + 1] : null;

    return (
        <Modal onClose={onClose}>
            <div className={styles.cardDetail__header}>
                <h2>Card #{card.id}</h2>
                <span className={styles.cardDetail__status}>{COLUMN_LABELS[card.status]}</span>
            </div>

            <CardForm values={values} onChange={setValues} users={users} disabled={!canEdit} />

            {!canEdit && (
                <p className={styles.cardDetail__readonly}>
                    Only the card&apos;s creator, its assignee, or a moderator can edit or move this
                    card. You can still leave a comment.
                </p>
            )}

            {error && <p className={styles.cardDetail__error}>{error}</p>}

            <div className={styles.cardDetail__actions}>
                {canEdit && prevStatus && canTransition(card.status, prevStatus) && (
                    <button onClick={() => handleMove(prevStatus)}>
                        ← {COLUMN_LABELS[prevStatus]}
                    </button>
                )}
                {canEdit && nextStatus && canTransition(card.status, nextStatus) && (
                    <button onClick={() => handleMove(nextStatus)}>
                        {COLUMN_LABELS[nextStatus]} →
                    </button>
                )}
                {canEdit && (
                    <button onClick={handleSave} disabled={saving}>
                        Save
                    </button>
                )}
                <button onClick={onClose}>Close</button>
            </div>

            <div className={styles.cardDetail__timeline}>
                <h3>Activity &amp; comments</h3>
                {timeline.map((entry) =>
                    entry.type === 'comment' ? (
                        <div
                            key={`comment-${entry.item.id}`}
                            className={styles.cardDetail__comment}
                        >
                            <Image
                                src={entry.item.author.avatarUrl}
                                alt={entry.item.author.displayName}
                                width={28}
                                height={28}
                                unoptimized
                            />
                            <div>
                                <div className={styles.cardDetail__commentHeader}>
                                    <strong>{entry.item.author.displayName}</strong>
                                    <span>{new Date(entry.date).toLocaleString()}</span>
                                </div>
                                <p>{entry.item.body}</p>
                            </div>
                        </div>
                    ) : (
                        <div
                            key={`activity-${entry.item.id}`}
                            className={styles.cardDetail__activity}
                        >
                            <strong>{entry.item.author.displayName}</strong>{' '}
                            {describeActivity(entry.item, userNames)}
                            {' · '}
                            {new Date(entry.date).toLocaleString()}
                        </div>
                    ),
                )}
            </div>

            <div className={styles.cardDetail__commentForm}>
                <textarea
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    placeholder="Add a comment"
                />
                <button onClick={handleAddComment}>Comment</button>
            </div>
        </Modal>
    );
}
