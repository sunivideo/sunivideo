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

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <svg className={styles.logoMark} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z"/></svg>
          suni<span>video</span>
        </div>
        <div className={styles.navRight}>
          <div className={styles.langSwitch}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={`${styles.langBtn} ${lang === l.code ? styles.langBtnActive : ''}`}
                onClick={() => setLang(l.code)}
              >
                {l.label}
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
        </div>

        <div className={styles.demoCard} id="demo">
          <div style={{ fontWeight: 600 }}>{t.demoLabel}</div>
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
        <div>suni<span style={{ color: 'var(--lime)' }}>video</span> — Bakı</div>
        <div>© 2026 sunivideo.az</div>
      </footer>
    </div>
  );
}
