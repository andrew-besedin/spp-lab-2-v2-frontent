import { Card, CurrentUser, UserRole } from './types';

const CARD_MANAGER_ROLES: UserRole[] = ['moderator', 'admin'];

export function canManageCard(user: CurrentUser, card: Card): boolean {
    return (
        CARD_MANAGER_ROLES.includes(user.role) ||
        card.creatorId === user.id ||
        card.assigneeId === user.id
    );
}
