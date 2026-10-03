"use client";

import { useState } from "react";
import { getCards, getUsers, updateCard } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { Card, User } from "@/lib/types";
import { COLUMN_ORDER, COLUMN_LABELS, ColumnStatus, canTransition } from "@/lib/columns";
import Column from "../Column/Column";
import CreateCardModal from "../CreateCardModal/CreateCardModal";
import CardDetailModal from "../CardDetailModal/CardDetailModal";
import styles from "./Board.module.scss";

interface Props {
  initialCards: Card[];
  initialUsers: User[];
}

export default function Board({ initialCards, initialUsers }: Props) {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  async function refresh() {
    const [cardsRes, usersRes] = await Promise.all([getCards(), getUsers()]);

    if (!cardsRes.success) {
      showError(getErrorMessage(cardsRes.data));
      return;
    }

    if (!usersRes.success) {
      showError(getErrorMessage(usersRes.data));
      return;
    }

    setCards(cardsRes.data);
    setUsers(usersRes.data);
  }

  function showError(message: string) {
    setError(message);
    setTimeout(() => setError(null), 3000);
  }

  async function handleDrop(cardId: number, targetStatus: ColumnStatus, targetIndex: number) {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    if (!canTransition(card.status, targetStatus)) {
      showError(getErrorMessage("INVALID_TRANSITION"));
      return;
    }

    const res = await updateCard(cardId, { status: targetStatus, position: targetIndex });

    if (!res.success) {
      showError(getErrorMessage(res.data));
    }

    if (res.success || res.data === "CARD_NOT_FOUND" || res.data === "INVALID_TRANSITION") {
      await refresh();
    }
  }

  return (
    <div className={styles.board}>
      {error && <div className={styles.board__error}>{error}</div>}
      <div className={styles.board__columns}>
        {COLUMN_ORDER.map((status) => (
          <Column
            key={status}
            status={status}
            title={COLUMN_LABELS[status]}
            cards={cards.filter((c) => c.status === status).sort((a, b) => a.position - b.position)}
            onDropCard={handleDrop}
            onCardClick={setSelectedCardId}
            onAddCard={status === "backlog" ? () => setCreating(true) : undefined}
          />
        ))}
      </div>

      {creating && (
        <CreateCardModal
          users={users}
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            refresh();
          }}
        />
      )}

      {selectedCardId !== null && (
        <CardDetailModal
          cardId={selectedCardId}
          users={users}
          onClose={() => setSelectedCardId(null)}
          onChanged={refresh}
        />
      )}
    </div>
  );
}
