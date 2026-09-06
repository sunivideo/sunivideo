'use client';
import { useState } from 'react';
import styles from './page.module.css';
import { DURATION_OPTIONS } from './pricing';

export default function Home() {
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
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu');
      setVideoUrl(data.videoUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <svg className={styles.logoMark} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z"/></svg>
          suni<span>video</span>
        </div>
        <button className={styles.navCta}>Ücretsiz Dene</button>
      </nav>

      <div className={styles.glow1} />
      <div className={styles.glow2} />

      <section className={styles.hero}>
        <div>
          <div className={styles.eyebrow}>Yapay zeka ile video üretimi</div>
          <h1 className={styles.headline}>
            Cümlen, <em>60 saniyede</em> konuşan bir video olsun.
          </h1>
          <p className={styles.subhead}>
            Metnini yaz, karakterinin sesi ve videosu otomatik oluşsun. Düzenleme yok,
            kamera yok, tek tık — YouTube ve Instagram'da paylaşmaya hazır.
          </p>
          <div className={styles.heroCtas}>
            <button className={styles.primaryBtn} onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })}>
              Hemen Dene
            </button>
            <span className={styles.ghostNote}>Kredi kartı gerekmez</span>
          </div>
        </div>

        <div className={styles.demoCard} id="demo">
          <div style={{ fontWeight: 600 }}>Videonu üret</div>
          <textarea
            className={styles.demoTextarea}
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Örn: Merhaba, ben konuşan kedi Pamuk!"
            rows={4}
          />

          <div className={styles.durationRow}>
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.seconds}
                className={`${styles.durationChip} ${duration === opt.seconds ? styles.durationChipActive : ''}`}
                onClick={() => opt.available && setDuration(opt.seconds)}
                disabled={!opt.available}
                title={opt.available ? '' : 'Yakında'}
              >
                {opt.seconds} sn
              </button>
            ))}
          </div>

          <div className={styles.priceLine}>
            Bu video ~<strong>{selected.priceAzn} AZN</strong>'ye mal olacak
          </div>

          <button
            className={styles.demoBtn}
            onClick={handleGenerate}
            disabled={loading || !script}
          >
            {loading ? 'Üretiliyor... (1-2 dakika)' : `Video Üret (${selected.priceAzn} AZN)`}
          </button>
          {error && <p className={styles.errorText}>Hata: {error}</p>}
          {videoUrl && (
            <div className={styles.videoWrap}>
              <video src={videoUrl} controls />
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Üç adımda videon hazır</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            <div className={styles.stepNum}>Adım 1</div>
            <div className={styles.stepTitle}>Metnini yaz</div>
            <div className={styles.stepText}>Karakterinin ne söyleyeceğini birkaç cümleyle anlat.</div>
          </div>
          <div className={styles.step}>
            <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
            <div className={styles.stepNum}>Adım 2</div>
            <div className={styles.stepTitle}>Karakterini seç</div>
            <div className={styles.stepText}>Hazır karakterlerden birini seç ya da kendi görselini yükle.</div>
          </div>
          <div className={styles.step}>
            <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 19h16"/></svg>
            <div className={styles.stepNum}>Adım 3</div>
            <div className={styles.stepTitle}>İndir ve paylaş</div>
            <div className={styles.stepText}>Videon hazır olduğunda doğrudan telefonuna indir, dakikalar içinde paylaş.</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sosyal medyada böyle görünür</h2>
        <div className={styles.showcase}>
          <div className={styles.reelCard} style={{ background: 'linear-gradient(160deg, #ff5ca8, #7b3fb8)' }}>
            <svg className={styles.reelPlay} viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="11" opacity="0.25"/><path d="M10 8l6 4-6 4V8z"/></svg>
            <span className={styles.reelLabel}>Reels</span>
          </div>
          <div className={styles.reelCard} style={{ background: 'linear-gradient(160deg, #e8ff6b, #2fa38a)' }}>
            <svg className={styles.reelPlay} viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="11" opacity="0.25"/><path d="M10 8l6 4-6 4V8z"/></svg>
            <span className={styles.reelLabel}>Shorts</span>
          </div>
          <div className={styles.reelCard} style={{ background: 'linear-gradient(160deg, #6ba8ff, #ff5ca8)' }}>
            <svg className={styles.reelPlay} viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="11" opacity="0.25"/><path d="M10 8l6 4-6 4V8z"/></svg>
            <span className={styles.reelLabel}>TikTok</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Basit, şeffaf fiyatlandırma</h2>
        <div className={styles.plans}>
          <div className={styles.plan}>
            <div className={styles.planName}>Başlangıç</div>
            <div className={styles.planPrice}>10 AZN<span>/ay</span></div>
            <div className={styles.planDesc}>10 video/ay. Denemeye başlamak için ideal.</div>
          </div>
          <div className={`${styles.plan} ${styles.planFeatured}`}>
            <div className={styles.planName}>İçerik Üretici</div>
            <div className={styles.planPrice}>29 AZN<span>/ay</span></div>
            <div className={styles.planDesc}>40 video/ay. Düzenli paylaşım yapanlar için.</div>
          </div>
          <div className={styles.plan}>
            <div className={styles.planName}>Stüdyo</div>
            <div className={styles.planPrice}>79 AZN<span>/ay</span></div>
            <div className={styles.planDesc}>150 video/ay + öncelikli üretim.</div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>suni<span style={{ color: 'var(--lime)' }}>video</span> — Bakü</div>
        <div>© 2026 sunivideo.az</div>
      </footer>
    </div>
  );
}
