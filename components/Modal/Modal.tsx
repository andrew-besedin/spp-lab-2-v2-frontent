'use client';

import { ReactNode } from 'react';
import styles from './Modal.module.scss';

export default function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
    return (
        <div className={styles.modal__overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}
