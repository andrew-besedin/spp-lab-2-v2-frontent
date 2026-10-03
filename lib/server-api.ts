import axios from "axios";
import { cookies } from "next/headers";
import { Card, User } from "./types";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const client = axios.create({
    baseURL: `${API_URL}/api`,
    validateStatus: () => true,
});

type ApiResponse<T> = {
    success: true;
    data: T;
} | {
    success: false;
    data: string;
}

async function serverApiFetch<T>(path: string): Promise<ApiResponse<T>> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    try {
        const res = await client.get<ApiResponse<T>>(path, {
            headers: token ? { Cookie: `token=${token}` } : {},
        });

        if (res.status === 401) {
            return { success: false, data: "UNAUTHORIZED" };
        }

        return res.data;
    } catch {
        return { success: false, data: "NETWORK_ERROR" };
    }
}

export function getServerUser() {
    return serverApiFetch<User | null>("/auth/me");
}

export function getServerCards() {
    return serverApiFetch<Card[]>("/cards");
}

export function getServerUsers() {
    return serverApiFetch<User[]>("/users");
}
