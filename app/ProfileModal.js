'use client';
import styles from './page.module.css';
import { TRANSLATIONS } from './translations';

export default function ProfileModal({ lang, user, balance, displayName, history, onClose, onSignOut }) {
  const t = TRANSLATIONS[lang];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>

        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            {(displayName || user.email || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className={styles.profileName}>{displayName || t.defaultUserName}</div>
            <div className={styles.profileEmail}>{user.email}</div>
          </div>
        </div>

        <div className={styles.profileSection}>
          <div className={styles.profileSectionLabel}>{t.balanceLabel}</div>
          <div className={styles.profileBalance}>{balance ?? '...'} AZN</div>
        </div>

        <div className={styles.profileSection}>
          <div className={styles.profileSectionLabel}>{t.yourVideos}</div>
          {history.length === 0 ? (
            <div className={styles.profileEmpty}>{t.noVideosYet}</div>
          ) : (
            <div className={styles.historyBox}>
              {history.map((v, i) => (
                <a key={i} href={v.video_url} target="_blank" rel="noreferrer" className={styles.historyItem}>
                  {v.script?.slice(0, 40)}{v.script?.length > 40 ? '…' : ''} · {v.duration}s
                </a>
              ))}
            </div>
          )}
        </div>

        <div className={styles.profileSection}>
          <button className={styles.signOutBtn} onClick={onSignOut}>{t.signOut}</button>
        </div>
      </div>
    </div>
  );
}
