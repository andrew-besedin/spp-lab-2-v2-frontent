'use client';

import { DragEvent } from 'react';
import Image from 'next/image';
import { Card } from '@/lib/types';
import styles from './CardItem.module.scss';

const PRIORITY_LABELS: Record<Card['priority'], string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
};

export default function CardItem({ card, onClick }: { card: Card; onClick: () => void }) {
    function handleDragStart(e: DragEvent<HTMLDivElement>) {
        e.dataTransfer.setData('text/plain', String(card.id));
        e.dataTransfer.effectAllowed = 'move';
    }

    return (
        <div className={styles.cardItem} draggable onDragStart={handleDragStart} onClick={onClick}>
            <div className={styles.cardItem__title}>{card.title}</div>
            <div className={styles.cardItem__meta}>
                <span
                    className={`${styles.cardItem__priority} ${styles[`cardItem__priority--${card.priority}`]}`}
                >
                    {PRIORITY_LABELS[card.priority]}
                </span>
                {card.assignee && (
                    <span className={styles.cardItem__assignee} title={card.assignee.displayName}>
                        <Image
                            src={card.assignee.avatarUrl}
                            alt={card.assignee.displayName}
                            width={22}
                            height={22}
                            unoptimized
                        />
                    </span>
                )}
            </div>
        </div>
    );
}
