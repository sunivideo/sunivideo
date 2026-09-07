import { fal } from '@fal-ai/client';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { DURATION_OPTIONS } from '../../pricing';

fal.config({ credentials: process.env.FAL_KEY });

export async function POST(request) {
  try {
    // 1) Kullanıcının giriş yapmış olduğunu doğrula
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return Response.json({ error: 'Bu əməliyyat üçün hesabına giriş etməlisən.' }, { status: 401 });
    }
    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !userData?.user) {
      return Response.json({ error: 'Giriş doğrulanmadı, yenidən giriş et.' }, { status: 401 });
    }
    const userId = userData.user.id;

    const { script, duration } = await request.json();
    if (!script || script.trim().length === 0) {
      return Response.json({ error: 'Mətn boş ola bilməz' }, { status: 400 });
    }

    const dur = Number(duration) || 5;
    if (dur !== 5 && dur !== 10) {
      return Response.json(
        { error: 'Hazırda yalnız 5 və ya 10 saniyəlik video yaradıla bilər.' },
        { status: 400 }
      );
    }

    const option = DURATION_OPTIONS.find((d) => d.seconds === dur);
    const price = option.priceAzn;

    // 2) Bakiyəni yoxla
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('wallet_balance')
      .eq('id', userId)
      .single();
    if (profileError || !profile) {
      return Response.json({ error: 'Profil tapılmadı.' }, { status: 404 });
    }
    if (Number(profile.wallet_balance) < price) {
      return Response.json(
        { error: `Balansın yetərli deyil. Lazım olan: ${price} AZN, mövcud: ${profile.wallet_balance} AZN.` },
        { status: 402 }
      );
    }

    // 3) fal.ai ile video üret (sessiz, test modeli)
    const result = await fal.subscribe('fal-ai/kling-video/v1/standard/text-to-video', {
      input: { prompt: script, duration: String(dur) },
      logs: false,
    });

    const videoUrl = result?.data?.video?.url;
    if (!videoUrl) throw new Error('fal.ai video qaytarmadı');

    // 4) Bakiyəni düş, videonu qeyd et
    const newBalance = Number(profile.wallet_balance) - price;
    await supabaseAdmin.from('profiles').update({ wallet_balance: newBalance }).eq('id', userId);
    await supabaseAdmin.from('videos').insert({
      user_id: userId,
      script,
      duration: dur,
      price_azn: price,
      video_url: videoUrl,
    });

    return Response.json({ videoUrl, newBalance });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
