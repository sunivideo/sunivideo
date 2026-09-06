import { fal } from '@fal-ai/client';

// fal.ai anahtarını ortam değişkeninden okur (asla kod içine yazmayın)
fal.config({ credentials: process.env.FAL_KEY });

export async function POST(request) {
  try {
    const { script, duration } = await request.json();
    if (!script || script.trim().length === 0) {
      return Response.json({ error: 'Metin boş olamaz' }, { status: 400 });
    }

    const dur = Number(duration) || 5;
    if (dur !== 5 && dur !== 10) {
      return Response.json(
        { error: 'Şu an sadece 5 veya 10 saniyelik videolar üretilebiliyor.' },
        { status: 400 }
      );
    }

    // NOT: ElevenLabs (seslendirme) şimdilik devre dışı — sadece fal.ai video
    // üretimini test ediyoruz. ElevenLabs'e geri dönmek için bu yorumu kaldırıp
    // üstteki kodu geri getirin.

    // fal.ai ile metinden video üret (basit test modeli, sessiz)
    const result = await fal.subscribe('fal-ai/kling-video/v1/standard/text-to-video', {
      input: { prompt: script, duration: String(dur) },
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
