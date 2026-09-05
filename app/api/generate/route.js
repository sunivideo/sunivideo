import { fal } from '@fal-ai/client';

// fal.ai anahtarını ortam değişkeninden okur (asla kod içine yazmayın)
fal.config({ credentials: process.env.FAL_KEY });

export async function POST(request) {
  try {
    const { script } = await request.json();
    if (!script || script.trim().length === 0) {
      return Response.json({ error: 'Metin boş olamaz' }, { status: 400 });
    }

    // 1) ElevenLabs ile seslendirme üret (test amaçlı, videoya henüz bağlanmıyor)
    const voiceRes = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: script,
          model_id: 'eleven_multilingual_v2',
        }),
      }
    );
    if (!voiceRes.ok) {
      const errText = await voiceRes.text();
      throw new Error('ElevenLabs hatası: ' + errText);
    }
    // Ses üretildi (şu an sadece doğrulama amaçlı; ileride videoya senkronize edeceğiz)

    // 2) fal.ai ile metinden video üret (basit test modeli)
    const result = await fal.subscribe('fal-ai/kling-video/v1/standard/text-to-video', {
      input: { prompt: script },
      logs: false,
    });

    const videoUrl = result?.data?.video?.url;
    if (!videoUrl) throw new Error('fal.ai video döndürmedi');

    return Response.json({ videoUrl });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
