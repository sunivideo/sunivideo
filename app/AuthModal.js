'use client';
import { useState } from 'react';
import { supabase } from './lib/supabaseClient';
import styles from './page.module.css';
import { TRANSLATIONS } from './translations';

export default function AuthModal({ lang, onClose, onSuccess }) {
  const t = TRANSLATIONS[lang];
  const [mode, setMode] = useState('signup');
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
        setInfo(t.signupSuccess);
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
            {t.signupTab}
          </button>
          <button
            className={`${styles.modalTab} ${mode === 'login' ? styles.modalTabActive : ''}`}
            onClick={() => setMode('login')}
          >
            {t.loginTab}
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <input
              className={styles.modalInput}
              type="text"
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            className={styles.modalInput}
            type="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={styles.modalInput}
            type="password"
            placeholder={t.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          {error && <p className={styles.errorText}>{error}</p>}
          {info && <p className={styles.infoText}>{info}</p>}
          <button className={styles.demoBtn} type="submit" disabled={loading}>
            {loading ? '...' : mode === 'signup' ? t.signupBtn : t.loginBtn}
          </button>
        </form>
      </div>
    </div>
  );
}
