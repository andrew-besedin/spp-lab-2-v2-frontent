"use client";

import { DragEvent } from "react";
import { Card } from "@/lib/types";
import styles from "./CardItem.module.scss";

const PRIORITY_LABELS: Record<Card["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export default function CardItem({ card, onClick }: { card: Card; onClick: () => void }) {
  function handleDragStart(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("text/plain", String(card.id));
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <div className={styles.card} draggable onDragStart={handleDragStart} onClick={onClick}>
      <div className={styles.title}>{card.title}</div>
      <div className={styles.meta}>
        <span className={`${styles.priority} ${styles[card.priority]}`}>
          {PRIORITY_LABELS[card.priority]}
        </span>
        {card.assignee && (
          <span className={styles.assignee} title={card.assignee.displayName}>
            <img src={card.assignee.avatarUrl} alt={card.assignee.displayName} />
          </span>
        )}
      </div>
    </div>
  );
}
