"use client";

import { Priority, User } from "@/lib/types";
import styles from "./CardForm.module.scss";

export interface CardFormValues {
  title: string;
  description: string;
  priority: Priority;
  assigneeId: number | null;
}

interface Props {
  values: CardFormValues;
  onChange: (values: CardFormValues) => void;
  users: User[];
}

export default function CardForm({ values, onChange, users }: Props) {
  return (
    <div className={styles.form}>
      <label>
        Title
        <input
          value={values.title}
          onChange={(e) => onChange({ ...values, title: e.target.value })}
        />
      </label>
      <label>
        Description
        <textarea
          value={values.description}
          onChange={(e) => onChange({ ...values, description: e.target.value })}
        />
      </label>
      <label>
        Priority
        <select
          value={values.priority}
          onChange={(e) => onChange({ ...values, priority: e.target.value as Priority })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </label>
      <label>
        Assignee
        <select
          value={values.assigneeId ?? ""}
          onChange={(e) =>
            onChange({ ...values, assigneeId: e.target.value ? Number(e.target.value) : null })
          }
        >
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.displayName}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
