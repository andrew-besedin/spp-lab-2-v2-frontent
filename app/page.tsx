import { redirect } from 'next/navigation';
import { getServerUser, getServerCards, getServerUsers } from '@/lib/server-api';
import HomeView from '@/components/HomeView/HomeView';

export default async function Home() {
    const userRes = await getServerUser();

    if (!userRes.success) {
        if (userRes.data === 'UNAUTHORIZED') {
            redirect('/login');
        }

        throw new Error(`Failed to load user: ${userRes.data}`);
    }

    if (!userRes.data) {
        redirect('/login');
    }

    const [cardsRes, usersRes] = await Promise.all([getServerCards(), getServerUsers()]);

    if (!cardsRes.success) {
        throw new Error(`Failed to load cards: ${cardsRes.data}`);
    }

    if (!usersRes.success) {
        throw new Error(`Failed to load users: ${usersRes.data}`);
    }

    return (
        <HomeView user={userRes.data} initialCards={cardsRes.data} initialUsers={usersRes.data} />
    );
}
