'use client';
import { useState } from 'react';
import styles from './page.module.css';
import { DURATION_OPTIONS } from './pricing';
import { LANGS, TRANSLATIONS } from './translations';

export default function Home() {
  const [lang, setLang] = useState('az');
  const t = TRANSLATIONS[lang];

  const [script, setScript] = useState('');
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);

  const selected = DURATION_OPTIONS.find((d) => d.seconds === duration);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, duration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setVideoUrl(data.videoUrl);
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
                {l.flag} {l.label}
              </button>
            ))}
          </div>
          <button className={styles.navCta}>{t.navCta}</button>
        </div>
      </nav>

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
            <span className={styles.ghostNote}>{t.ghostNote}</span>
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
          <div className={styles.reelCard}>
            <video className={styles.reelVideo} src="/showcase/reel-1.mp4" autoPlay loop muted playsInline />
            <span className={styles.reelLabel}>Reels</span>
          </div>
          <div className={styles.reelCard}>
            <video className={styles.reelVideo} src="/showcase/reel-2.mp4" autoPlay loop muted playsInline />
            <span className={styles.reelLabel}>Shorts</span>
          </div>
          <div className={styles.reelCard}>
            <video className={styles.reelVideo} src="/showcase/reel-3.mp4" autoPlay loop muted playsInline />
            <span className={styles.reelLabel}>TikTok</span>
          </div>
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
