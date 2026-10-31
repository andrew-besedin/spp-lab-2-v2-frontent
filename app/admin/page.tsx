import { redirect } from 'next/navigation';
import { getServerAdminUsers, getServerUser } from '@/lib/server-api';
import AdminView from '@/components/AdminView/AdminView';

export default async function AdminPage() {
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

    if (userRes.data.role !== 'admin') {
        redirect('/');
    }

    const usersRes = await getServerAdminUsers();

    if (!usersRes.success) {
        throw new Error(`Failed to load users: ${usersRes.data}`);
    }

    return <AdminView user={userRes.data} initialUsers={usersRes.data} />;
}
