import { ColumnStatus } from './columns';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
    id: number;
    username: string;
    displayName: string;
    avatarUrl: string;
}

export interface Comment {
    id: number;
    cardId: number;
    userId: number;
    body: string;
    createdAt: string;
    author: User;
}

export type ActivityAction =
    | 'created'
    | 'title_changed'
    | 'description_changed'
    | 'priority_changed'
    | 'assignee_changed'
    | 'status_changed';

export interface ActivityLogEntry {
    id: number;
    cardId: number;
    userId: number;
    action: ActivityAction;
    meta: Record<string, unknown> | null;
    createdAt: string;
    author: User;
}

export interface Card {
    id: number;
    title: string;
    description: string;
    priority: Priority;
    status: ColumnStatus;
    position: number;
    assigneeId: number | null;
    creatorId: number;
    assignee: User | null;
    creator: User;
    createdAt: string;
    updatedAt: string;
    comments?: Comment[];
    activityLog?: ActivityLogEntry[];
}
