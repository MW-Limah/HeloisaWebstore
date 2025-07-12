'use client';

import styles from './confirmModal.module.css';

interface ConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationModal({ onConfirm, onCancel }: ConfirmationModalProps) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>Confirme seu pedido</h3>
                <p>Você revisou todas as informações do pedido?</p>
                <div className={styles.actions}>
                    <button className={styles.confirm} onClick={onConfirm}>
                        Confirmar
                    </button>
                    <button className={styles.cancel} onClick={onCancel}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
