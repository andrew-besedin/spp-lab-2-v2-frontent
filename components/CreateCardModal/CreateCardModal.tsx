"use client";

import { useState } from "react";
import { createCard } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { User } from "@/lib/types";
import Modal from "../Modal/Modal";
import CardForm, { CardFormValues } from "../CardForm/CardForm";
import styles from "./CreateCardModal.module.scss";

interface Props {
  users: User[];
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateCardModal({ users, onClose, onCreated }: Props) {
  const [values, setValues] = useState<CardFormValues>({
    title: "",
    description: "",
    priority: "medium",
    assigneeId: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!values.title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    const res = await createCard(values);
    setSaving(false);

    if (res.success) {
      onCreated();
    } else {
      setError(getErrorMessage(res.data));
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2>New card</h2>
      <CardForm values={values} onChange={setValues} users={users} />
      {error && <p className={styles.createCardModal__error}>{error}</p>}
      <div className={styles.createCardModal__actions}>
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSubmit} disabled={saving}>
          Create
        </button>
      </div>
    </Modal>
  );
}
