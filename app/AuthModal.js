'use client';
import { useState } from 'react';
import { supabase } from './lib/supabaseClient';
import styles from './page.module.css';

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: name } },
        });
        if (error) throw error;
        setInfo('Qeydiyyat uğurlu oldu! E-poçtunu yoxla və linki təsdiqlə, sonra giriş et.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        <div className={styles.modalTabs}>
          <button
            className={`${styles.modalTab} ${mode === 'signup' ? styles.modalTabActive : ''}`}
            onClick={() => setMode('signup')}
          >
            Qeydiyyat
          </button>
          <button
            className={`${styles.modalTab} ${mode === 'login' ? styles.modalTabActive : ''}`}
            onClick={() => setMode('login')}
          >
            Giriş
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <input
              className={styles.modalInput}
              type="text"
              placeholder="Adın"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            className={styles.modalInput}
            type="email"
            placeholder="E-poçt"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={styles.modalInput}
            type="password"
            placeholder="Şifrə (ən az 6 simvol)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          {error && <p className={styles.errorText}>{error}</p>}
          {info && <p className={styles.infoText}>{info}</p>}
          <button className={styles.demoBtn} type="submit" disabled={loading}>
            {loading ? '...' : mode === 'signup' ? 'Qeydiyyatdan keç' : 'Giriş et'}
          </button>
        </form>
      </div>
    </div>
  );
}
