"use client";

import { DragEvent } from "react";
import { Card } from "@/lib/types";
import { ColumnStatus } from "@/lib/columns";
import CardItem from "../CardItem/CardItem";
import styles from "./Column.module.scss";

interface Props {
  status: ColumnStatus;
  title: string;
  cards: Card[];
  onDropCard: (cardId: number, status: ColumnStatus, index: number) => void;
  onCardClick: (id: number) => void;
  onAddCard?: () => void;
}

export default function Column({ status, title, cards, onDropCard, onCardClick, onAddCard }: Props) {
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: DragEvent, index: number) {
    e.preventDefault();
    e.stopPropagation();
    const cardId = Number(e.dataTransfer.getData("text/plain"));
    if (!cardId) return;
    onDropCard(cardId, status, index);
  }

  return (
    <div className={styles.column}>
      <div className={styles.column__header}>
        <h2>{title}</h2>
        <span className={styles.column__count}>{cards.length}</span>
        {onAddCard && (
          <button className={styles.column__addButton} onClick={onAddCard} title="Add card">
            +
          </button>
        )}
      </div>
      <div className={styles.column__cards} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, cards.length)}>
        {cards.map((card, index) => (
          <div key={card.id} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index)}>
            <CardItem card={card} onClick={() => onCardClick(card.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
