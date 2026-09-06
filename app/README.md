# sunivideo — Test Sürümü (v0)

Bu, sunivideo.az projesinin ilk test versiyonu. Şu an sadece şunu kanıtlamak için var:
"Kullanıcı bir metin yazınca, ElevenLabs ses üretiyor mu ve fal.ai video üretiyor mu?"

Henüz YOK: kullanıcı girişi, ödeme/kredi sistemi, video+ses birleştirme (lip-sync).
Bunlar bu ilk test çalıştıktan sonra eklenecek.

## Nasıl yayına alınır (Vercel ile, kod bilgisi gerekmez)

1. Bu klasördeki tüm dosyaları bir GitHub reposuna yükleyin
   (GitHub.com'da "New repository" > dosyaları sürükle-bırak ile yükleyebilirsiniz).
2. vercel.com'a GitHub hesabınızla giriş yapın.
3. "Add New Project" > az önce yüklediğiniz repoyu seçin > "Import".
4. Deploy etmeden ÖNCE "Environment Variables" bölümüne şunları ekleyin:
   - FAL_KEY = (fal.ai anahtarınız)
   - ELEVENLABS_API_KEY = (ElevenLabs anahtarınız)
5. "Deploy" butonuna basın. 1-2 dakika içinde bir link verecek (örn. sunivideo.vercel.app).
6. Test edin: metni yazıp "Video Üret" butonuna basın.
7. Çalıştığını gördükten sonra Vercel ayarlarından kendi domaininizi
   (sunivideo.az) bu projeye bağlayabilirsiniz — bu adımda size ayrıca eşlik ederim.

## Notlar
- Bu adımda fal.ai hesabınıza en az birkaç dolar kredi yüklenmiş olmalı, yoksa video üretimi hata verir.
- ElevenLabs'ta Starter (ücretli) plana geçmiş olmanız gerekir.
