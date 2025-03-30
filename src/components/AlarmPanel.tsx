"use client"
import { useState, useEffect, ChangeEvent, JSX } from 'react';
import styles from '../../styles/AlarmPanel.module.css';

type AlarmStatus = 'armed' | 'disarmed' | 'unknown';
type AlarmCommand = 'ARM' | 'DISARM';

export default function AlarmPanel(): JSX.Element {
  const [code, setCode] = useState<string>('');
  const [status, setStatus] = useState<AlarmStatus>('unknown');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  // Récupérer le numéro de téléphone du localStorage au chargement du composant
  useEffect(() => {
    const savedPhone = localStorage.getItem('alarmPhoneNumber');
    if (savedPhone) {
      setPhoneNumber(savedPhone);
    }
  }, []);

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // Limiter à 4 chiffres
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setCode(value);
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // Accepter uniquement les chiffres, +, et espaces
    const value = e.target.value.replace(/[^0-9+\s]/g, '');
    setPhoneNumber(value);
    

  };

  const sendCommand = async (command: AlarmCommand): Promise<void> => {
    if (code.length !== 4) {
      setError('Le code doit contenir 4 chiffres');
      return;
    }
    
    if (!phoneNumber) {
      setError('Veuillez saisir un numéro de téléphone');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Ici, vous devrez implémenter l'appel à votre API SMS
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          command,
          to: phoneNumber,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
            // Sauvegarder dans localStorage à chaque changement
        localStorage.setItem('alarmPhoneNumber', phoneNumber);
        setStatus(command === 'ARM' ? 'armed' : 'disarmed');
      } else {
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Impossible de communiquer avec le serveur');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.statusIndicator}>
        <div className={`${styles.statusLight} ${styles[status]}`}></div>
        <p className={styles.statusText}>
          {status === 'armed' && 'Système Armé'}
          {status === 'disarmed' && 'Système Désarmé'}
          {status === 'unknown' && 'État Inconnu'}
        </p>
      </div>

      <div className={styles.codeInput}>
        <label htmlFor="securityCode">Code de sécurité (4 chiffres)</label>
        <input
          type="password"
          id="securityCode"
          value={code}
          onChange={handleCodeChange}
          placeholder="****"
          maxLength={4}
          pattern="[0-9]*"
          inputMode="numeric"
        />
      </div>
      
      <div className={styles.codeInput}>
        <label htmlFor="phoneNumber">Numéro de téléphone</label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="+33 6 12 34 56 78"
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.armButton}`}
          onClick={() => sendCommand('ARM')}
          disabled={loading || code.length !== 4}
        >
          {loading ? 'Envoi...' : 'Armer'}
        </button>
        <button
          className={`${styles.button} ${styles.disarmButton}`}
          onClick={() => sendCommand('DISARM')}
          disabled={loading || code.length !== 4}
        >
          {loading ? 'Envoi...' : 'Désarmer'}
        </button>
      </div>
    </div>
  );
} 