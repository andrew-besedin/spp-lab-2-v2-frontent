import axios from "axios";
import { Card, Comment, Priority, User } from "./types";
import { ColumnStatus } from "./columns";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const client = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true,
});

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

async function apiFetch<T>(path: string, options?: { method?: string; body?: unknown }): Promise<ApiResponse<T>> {
    try {
        const res = await client.request<ApiResponse<T>>({
            url: path,
            method: options?.method ?? "GET",
            data: options?.body,
        });

        if (res.status === 401) {
            return { success: false, data: null as T };
        }

        return res.data;
    } catch {
        return { success: false, data: null as T };
    }
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
        body: input,
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
        body: input,
    });
}

export function addComment(cardId: number, body: string) {
    return apiFetch<Comment>(`/cards/${cardId}/comments`, {
        method: "POST",
        body: { body },
    });
}

export function getUsers() {
    return apiFetch<User[]>("/users");
}

export function githubLoginUrl() {
    return `${API_URL}/api/auth/github`;
}
