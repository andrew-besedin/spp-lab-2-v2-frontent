import { Card, Comment, Priority, User } from "./types";
import { ColumnStatus } from "./columns";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    let res: Response;

    try {
        res = await fetch(`${API_URL}/api${path}`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            ...options,
        });
    } catch {
        return { success: false, data: null as T };
    }

    if (res.status === 401) {
        return { success: false, data: null as T };
    }

    return res.json();
}

export function getMe() {
    return apiFetch<User | null>("/auth/me");
}

export function logout() {
    return apiFetch<null>("/auth/logout", { method: "POST" });
}

export function getCards() {
    return apiFetch<Card[]>("/cards");
}

export function getCard(id: number) {
    return apiFetch<Card>(`/cards/${id}`);
}

export interface CreateCardInput {
    title: string;
    description?: string;
    priority?: Priority;
    assigneeId?: number | null;
}

export function createCard(input: CreateCardInput) {
    return apiFetch<Card>("/cards", {
        method: "POST",
        body: JSON.stringify(input),
    });
}

export interface UpdateCardInput {
    title?: string;
    description?: string;
    priority?: Priority;
    assigneeId?: number | null;
    status?: ColumnStatus;
    position?: number;
}

export function updateCard(id: number, input: UpdateCardInput) {
    return apiFetch<Card>(`/cards/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
    });
}

export function addComment(cardId: number, body: string) {
    return apiFetch<Comment>(`/cards/${cardId}/comments`, {
        method: "POST",
        body: JSON.stringify({ body }),
    });
}

export function getUsers() {
    return apiFetch<User[]>("/users");
}

export function githubLoginUrl() {
    return `${API_URL}/api/auth/github`;
}
