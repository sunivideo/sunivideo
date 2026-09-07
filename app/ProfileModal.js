'use client';
import styles from './page.module.css';

export default function ProfileModal({ user, balance, displayName, history, onClose, onSignOut }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>

        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            {(displayName || user.email || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className={styles.profileName}>{displayName || 'İstifadəçi'}</div>
            <div className={styles.profileEmail}>{user.email}</div>
          </div>
        </div>

        <div className={styles.profileSection}>
          <div className={styles.profileSectionLabel}>Balans</div>
          <div className={styles.profileBalance}>{balance ?? '...'} AZN</div>
        </div>

        <div className={styles.profileSection}>
          <div className={styles.profileSectionLabel}>Videoların</div>
          {history.length === 0 ? (
            <div className={styles.profileEmpty}>Hələ heç bir video yaratmamısan.</div>
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
          <button className={styles.signOutBtn} onClick={onSignOut}>Çıxış et</button>
        </div>
      </div>
    </div>
  );
}
