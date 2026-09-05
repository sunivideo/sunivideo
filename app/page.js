'use client';
import { useState } from 'react';

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
    <main style={{ maxWidth: 600, margin: '60px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1>sunivideo — Test Sürümü</h1>
      <p style={{ color: '#555' }}>
        Bir konuşma metni yazın, sistem sesli ve konuşan bir video üretsin (test amaçlı, ödeme sistemi henüz yok).
      </p>
      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Örn: Merhaba, ben konuşan kedi Pamuk!"
        rows={4}
        style={{ width: '100%', padding: 10, fontSize: 16 }}
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !script}
        style={{ marginTop: 12, padding: '10px 20px', fontSize: 16, cursor: 'pointer' }}
      >
        {loading ? 'Video üretiliyor... (1-2 dakika sürebilir)' : 'Video Üret'}
      </button>

      {error && <p style={{ color: 'red', marginTop: 20 }}>Hata: {error}</p>}
      {videoUrl && (
        <div style={{ marginTop: 20 }}>
          <p>Video hazır:</p>
          <video src={videoUrl} controls style={{ width: '100%' }} />
        </div>
      )}
    </main>
  );
}
