"use client";

import { useEffect, useState } from "react";
import { getCards, getUsers, updateCard } from "@/lib/api";
import { Card, User } from "@/lib/types";
import { COLUMN_ORDER, COLUMN_LABELS, ColumnStatus, canTransition } from "@/lib/columns";
import Column from "./Column";
import CreateCardModal from "./CreateCardModal";
import CardDetailModal from "./CardDetailModal";
import styles from "./Board.module.scss";

export default function Board() {
  const [cards, setCards] = useState<Card[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  async function refresh() {
    const [cardsRes, usersRes] = await Promise.all([getCards(), getUsers()]);
    if (cardsRes.success) setCards(cardsRes.data);
    if (usersRes.success) setUsers(usersRes.data);
  }

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, []);

  function showError(message: string) {
    setError(message);
    setTimeout(() => setError(null), 3000);
  }

  async function handleDrop(cardId: number, targetStatus: ColumnStatus, targetIndex: number) {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    if (!canTransition(card.status, targetStatus)) {
      showError("That move isn't allowed: columns can't be skipped and cards can't leave Done.");
      return;
    }

    const res = await updateCard(cardId, { status: targetStatus, position: targetIndex });

    if (res.success) {
      await refresh();
    } else {
      showError(String(res.data));
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading board…</div>;
  }

  return (
    <div className={styles.board}>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.columns}>
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
