import React, { useState } from 'react';
import { habitacionApi } from '../../entities/habitacion/api';
import type { AmaDeLlavesDto } from '../../entities/amaDeLlaves/types';
import styles from './AsignarHabitacionModal.module.css';

interface Props {
  ama: AmaDeLlavesDto;
  onClose: () => void;
  onSuccess: () => void;
}

interface ApiErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string;
    } | string;
  };
  message?: string;
}

export const AsignarHabitacionModal: React.FC<Props> = ({ ama, onClose, onSuccess }) => {
  const [habitacionId, setHabitacionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const idNum = parseInt(habitacionId, 10);
    
    if (isNaN(idNum) || idNum <= 0) {
      setError('Por favor, introduce un número de habitación válido.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await habitacionApi.asignarAmaDeLlaves(idNum, ama.id);
      onSuccess();
    } catch (err: unknown) {
      console.error('ERROR DETALLADO DEL BACKEND:', err);
      
      const errorObj = err as ApiErrorResponse;
      const status = errorObj?.response?.status;
      const message = errorObj?.message || '';
      const rawData = errorObj?.response?.data;
      
      const combinedText = `${message} ${typeof rawData === 'string' ? rawData : JSON.stringify(rawData || '')}`.toLowerCase();

      if (status === 409 || combinedText.includes('409') || combinedText.includes('ya esta asignada')) {
        setError('Esta ama de llaves ya se encuentra asignada a esta habitación.');
      } else if (status === 404 || combinedText.includes('404') || combinedText.includes('no existe')) {
        setError('La habitación o el personal especificado no existe.');
      } else {
        setError('No se pudo completar la asignación. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔑</span>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Asignar Habitación</h3>
        </div>
        <p style={{ color: '#8b949e', fontSize: '0.9rem', margin: 0 }}>
          Personal: <strong style={{ color: '#f0f6fc' }}>{ama.nombreApellidos}</strong>
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className={styles.formGroup}>
            <label>Número de Habitación</label>
            <input
              type="number"
              value={habitacionId}
              onChange={(e) => setHabitacionId(e.target.value)}
              placeholder="Ej. 31"
              min="1"
              required
            />
            <small style={{ color: '#8b949e', fontSize: '0.75rem', marginTop: '4px' }}>
              Introduce el número de la habitación que deseas asignar.
            </small>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} disabled={loading} className={styles.cancelBtn}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Asignando...' : 'Asignar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};