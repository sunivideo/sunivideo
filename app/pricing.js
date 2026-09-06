// Süre bazlı fiyatlandırma. "available: true" olanlar gerçekten üretilebilir
// (kullandığımız fal.ai modeli şu an sadece 5 ve 10 saniyeyi destekliyor).
// Diğerleri ileride farklı bir model/klip birleştirme ile eklenecek.

export const DURATION_OPTIONS = [
  { seconds: 5, priceAzn: 1, available: true },
  { seconds: 10, priceAzn: 2, available: true },
  { seconds: 15, priceAzn: 3, available: false },
  { seconds: 20, priceAzn: 4, available: false },
  { seconds: 30, priceAzn: 6.5, available: false },
  { seconds: 60, priceAzn: 13, available: false },
];
