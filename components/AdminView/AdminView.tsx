import { AdminUser, CurrentUser } from '@/lib/types';
import AppHeader from '@/components/AppHeader/AppHeader';
import AdminUsers from '@/components/AdminUsers/AdminUsers';
import pageStyles from '@/app/page.module.scss';
import styles from './AdminView.module.scss';

interface Props {
    user: CurrentUser;
    initialUsers: AdminUser[];
}

export default function AdminView({ user, initialUsers }: Props) {
    return (
        <div className={pageStyles.page}>
            <AppHeader user={user} />
            <main className={styles.admin}>
                <div className={styles.admin__inner}>
                    <h2 className={styles.admin__title}>Admin panel</h2>
                    <AdminUsers initialUsers={initialUsers} />
                </div>
            </main>
        </div>
    );
}
