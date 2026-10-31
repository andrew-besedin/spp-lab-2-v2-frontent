import { Card, CurrentUser, User } from '@/lib/types';
import AppHeader from '@/components/AppHeader/AppHeader';
import Board from '@/components/Board/Board';
import styles from '@/app/page.module.scss';

interface Props {
    user: CurrentUser;
    initialCards: Card[];
    initialUsers: User[];
}

export default function HomeView({ user, initialCards, initialUsers }: Props) {
    return (
        <div className={styles.page}>
            <AppHeader user={user} />
            <Board initialCards={initialCards} initialUsers={initialUsers} />
        </div>
    );
}
