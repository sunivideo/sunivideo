'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { DURATION_OPTIONS } from './pricing';
import { LANGS, TRANSLATIONS } from './translations';
import { supabase } from './lib/supabaseClient';
import AuthModal from './AuthModal';
import ProfileModal from './ProfileModal';

export default function Home() {
  const [lang, setLang] = useState('az');
  const t = TRANSLATIONS[lang];

  const [script, setScript] = useState('');
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [history, setHistory] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const selected = DURATION_OPTIONS.find((d) => d.seconds === duration);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) loadUser(data.session.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) loadUser(session.user);
      else {
        setUser(null);
        setBalance(null);
        setHistory([]);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function loadUser(u) {
    setUser(u);
    const { data: profile } = await supabase.from('profiles').select('wallet_balance, display_name').eq('id', u.id).single();
    if (profile) {
      setBalance(profile.wallet_balance);
      setDisplayName(profile.display_name);
    }
    const { data: videos } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    setHistory(videos || []);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  async function handleGenerate() {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        body: JSON.stringify({ script, duration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setVideoUrl(data.videoUrl);
      setBalance(data.newBalance);
      setHistory((h) => [{ script, duration, price_azn: selected.priceAzn, video_url: data.videoUrl, created_at: new Date().toISOString() }, ...h]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function scrollToDemo() {
    document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
  }

  const Logo = ({ small }) => (
    <div className={`${styles.logo} ${small ? styles.logoSmall : ''}`}>
      Sun<span className={styles.logoSun}>🌞</span>İVideo
    </div>
  );

  const FLAG_PATHS = {
    az: (
      <g>
        <rect width="20" height="14" fill="#00b5e2" />
        <rect y="4.67" width="20" height="4.67" fill="#ef3340" />
        <rect y="9.33" width="20" height="4.67" fill="#509e2f" />
        <circle cx="10.5" cy="7" r="2.1" fill="#fff" />
        <circle cx="11.3" cy="7" r="1.7" fill="#ef3340" />
        <polygon points="13.3,7 14.4,7.35 13.7,6.45 13.7,7.55 14.4,6.65" fill="#fff" />
      </g>
    ),
    tr: (
      <g>
        <rect width="20" height="14" fill="#e30a17" />
        <circle cx="8.2" cy="7" r="3" fill="#fff" />
        <circle cx="9.2" cy="7" r="2.4" fill="#e30a17" />
        <polygon points="12,7 13.3,7.4 12.4,6.4 12.4,7.6 13.3,6.6" fill="#fff" />
      </g>
    ),
    en: (
      <g>
        <rect width="20" height="14" fill="#012169" />
        <path d="M0,0 L20,14 M20,0 L0,14" stroke="#fff" strokeWidth="2.4" />
        <path d="M0,0 L20,14 M20,0 L0,14" stroke="#c8102e" strokeWidth="1" />
        <path d="M10,0 V14 M0,7 H20" stroke="#fff" strokeWidth="4" />
        <path d="M10,0 V14 M0,7 H20" stroke="#c8102e" strokeWidth="2" />
      </g>
    ),
    ru: (
      <g>
        <rect width="20" height="14" fill="#fff" />
        <rect y="4.67" width="20" height="4.67" fill="#0039a6" />
        <rect y="9.33" width="20" height="4.67" fill="#d52b1e" />
      </g>
    ),
  };

  const Flag = ({ code }) => (
    <svg className={styles.flagIcon} viewBox="0 0 20 14">{FLAG_PATHS[code]}</svg>
  );

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Logo />
        <div className={styles.navRight}>
          <div className={styles.langSwitch}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={`${styles.langBtn} ${lang === l.code ? styles.langBtnActive : ''}`}
                onClick={() => setLang(l.code)}
              >
                <Flag code={l.code} /> {l.label}
              </button>
            ))}
          </div>
          {user ? (
            <div className={styles.accountBox}>
              <button className={styles.balanceTag} onClick={() => setShowProfile(true)}>
                {displayName || user.email?.split('@')[0]} · {balance ?? '...'} AZN
              </button>
            </div>
          ) : (
            <button className={styles.navCta} onClick={() => setShowAuth(true)}>{t.authCta}</button>
          )}
        </div>
      </nav>

      {showProfile && (
        <ProfileModal
          lang={lang}
          user={user}
          balance={balance}
          displayName={displayName}
          history={history}
          onClose={() => setShowProfile(false)}
          onSignOut={() => {
            handleSignOut();
            setShowProfile(false);
          }}
        />
      )}

      {showAuth && (
        <AuthModal
          lang={lang}
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}

      <div className={styles.glow1} />
      <div className={styles.glow2} />

      <section className={styles.hero}>
        <div>
          <div className={styles.eyebrow}>{t.eyebrow}</div>
          <h1 className={styles.headline}>
            {t.headlinePre}<em>{t.headlineEm}</em>{t.headlinePost}
          </h1>
          <p className={styles.subhead}>{t.subhead}</p>
          <div className={styles.heroCtas}>
            <button className={styles.primaryBtn} onClick={scrollToDemo}>
              {t.heroBtn}
            </button>
          </div>
          <div className={styles.socialRow}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.5V8.5L15.8 12l-6.2 3.5z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.7 0 3.1 0 4.1.06 1.1.05 1.8.21 2.5.46a5 5 0 0 1 1.8 1.17 5 5 0 0 1 1.17 1.8c.25.7.41 1.4.46 2.5.05 1 .06 1.4.06 4.1s0 3.1-.06 4.1c-.05 1.1-.21 1.8-.46 2.5a5 5 0 0 1-1.17 1.8 5 5 0 0 1-1.8 1.17c-.7.25-1.4.41-2.5.46-1 .05-1.4.06-4.1.06s-3.1 0-4.1-.06c-1.1-.05-1.8-.21-2.5-.46a5 5 0 0 1-1.8-1.17 5 5 0 0 1-1.17-1.8c-.25-.7-.41-1.4-.46-2.5C2 15.1 2 14.7 2 12s0-3.1.06-4.1c.05-1.1.21-1.8.46-2.5a5 5 0 0 1 1.17-1.8A5 5 0 0 1 5.5 2.5c.7-.25 1.4-.41 2.5-.46C8.9 2 9.3 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.3a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm5.2-8.5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.8a4.6 4.6 0 0 1-2.9-3.4h-3.1v13.4a2.6 2.6 0 1 1-1.9-2.5V9.9a5.9 5.9 0 1 0 5 5.8V9.4a7.7 7.7 0 0 0 4.5 1.4V7.6a4.6 4.6 0 0 1-1.6-1.8z"/></svg>
          </div>
        </div>

        <div className={styles.demoCard} id="demo">
          <Logo small />
          <div style={{ fontWeight: 600, marginTop: 12 }}>{t.demoLabel}</div>
          <textarea
            className={styles.demoTextarea}
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder={t.placeholder}
            rows={4}
          />

          <div className={styles.durationRow}>
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.seconds}
                className={`${styles.durationChip} ${duration === opt.seconds ? styles.durationChipActive : ''}`}
                onClick={() => opt.available && setDuration(opt.seconds)}
                disabled={!opt.available}
              >
                {opt.seconds}s
              </button>
            ))}
          </div>

          <div className={styles.priceLine}>
            {t.priceLine1}<strong>{selected.priceAzn} AZN</strong>{t.priceLine2}
          </div>

          <button
            className={styles.demoBtn}
            onClick={handleGenerate}
            disabled={loading || !script}
          >
            {loading ? t.genBtnLoading : `${t.genBtn} (${selected.priceAzn} AZN)`}
          </button>
          {error && <p className={styles.errorText}>{t.errorPrefix} {error}</p>}
          {videoUrl && (
            <div className={styles.videoWrap}>
              <video src={videoUrl} controls />
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.stepsTitle}</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            <div className={styles.stepTitle}>{t.step1Title}</div>
            <div className={styles.stepText}>{t.step1Text}</div>
          </div>
          <div className={styles.step}>
            <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
            <div className={styles.stepTitle}>{t.step2Title}</div>
            <div className={styles.stepText}>{t.step2Text}</div>
          </div>
          <div className={styles.step}>
            <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 19h16"/></svg>
            <div className={styles.stepTitle}>{t.step3Title}</div>
            <div className={styles.stepText}>{t.step3Text}</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.showcaseTitle}</h2>
        <div className={styles.showcase}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div className={styles.reelCard} key={n}>
              <video className={styles.reelVideo} src={`/showcase/reel-${n}.mp4`} autoPlay loop muted playsInline />
              <span className={styles.reelLabel}>{['Reels', 'Shorts', 'TikTok'][(n - 1) % 3]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.faqTitle}</h2>
        <div className={styles.faqList}>
          {t.faq.map(([q, a], i) => (
            <details className={styles.faqItem} key={i}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <h2 className={styles.sectionTitle}>{t.finalCtaTitle}</h2>
        <button className={styles.primaryBtn} onClick={scrollToDemo}>
          {t.heroBtn}
        </button>
      </section>

      <footer className={styles.footer}>
        <Logo />
        <div>© 2026 sunivideo.az</div>
      </footer>
    </div>
  );
}
