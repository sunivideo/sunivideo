'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
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
        <div className={styles.logo}>suni<span>video</span></div>
        <button className={styles.navCta}>Ücretsiz Dene</button>
      </nav>

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
          <button
            className={styles.demoBtn}
            onClick={handleGenerate}
            disabled={loading || !script}
          >
            {loading ? 'Üretiliyor... (1-2 dakika)' : 'Video Üret'}
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
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepTitle}>Metnini yaz</div>
            <div className={styles.stepText}>Karakterinin ne söyleyeceğini birkaç cümleyle anlat.</div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepTitle}>Karakterini seç</div>
            <div className={styles.stepText}>Hazır karakterlerden birini seç ya da kendi görselini yükle.</div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepTitle}>İndir ve paylaş</div>
            <div className={styles.stepText}>Videon hazır olduğunda doğrudan telefonuna indir, dakikalar içinde paylaş.</div>
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
