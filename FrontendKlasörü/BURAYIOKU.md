# BURAYI OKU — bu klasörü `eco-match-application-main/web` içine taşırken

Bu klasör (`FrontendKlasörü`) EcoMatch'in Next.js frontend'i. `eco-match-application-main`
monorepo'sunun `web/` klasörüne taşındığında aşağıdakilere dikkat edin.

## 1. Klasör adı

İçeriği `eco-match-application-main/web/` altına kopyalayın (klasörün kendisini
`FrontendKlasörü` adıyla değil, içindekileri `web/` içine). Yani hedef yapı:

```
eco-match-application-main/
  backend/
  web/          <- bu klasörün İÇERİĞİ buraya
  docs/
```

## 2. Bağımlılıkları kurun

`node_modules` git'e dahil değil (ve gönderirken de muhtemelen dahil değildir):

```bash
cd eco-match-application-main/web
npm install
```

## 3. `.env.local` — backend adresini kendi ortamınıza göre ayarlayın

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Backend'i (`backend/.env`'deki `PORT`) hangi portta çalıştırıyorsanız bu değer onunla
**birebir eşleşmeli**. Backend'in kendi varsayılanı 3000. Aynı anda hem frontend hem
backend'i 3000'de çalıştırmaya çalışmayın — biri diğerini engeller, frontend'i farklı
bir portta açın (`npm run dev -- -p 3001` gibi).

## 4. `basePath` kaldırıldı

Eski halinde `next.config.ts` içinde `basePath: "/DonguNetWeb"` vardı (GitHub Pages'e
özeldi). Bu sürümde kaldırıldı — uygulama artık kök adreste (`/`) açılıyor, ek bir
alt yol gerekmiyor.

## 5. CORS — backend tarafında `credentials: true` şart

`backend/src/main.ts` içinde `app.enableCors({ origin: true, credentials: true })`
olması lazım. Sadece `app.enableCors()` (argümansız) kullanılırsa, refresh token'ı
taşıyan httpOnly cookie tarayıcıda kabul edilmez ve oturum kalıcı olmaz (sayfa
yenilendiğinde çıkış yapılmış gibi görünür).

## 6. Şu an gerçek backend'e bağlı olan / olmayan kısımlar

**Bağlı (gerçek `/v1/*` çağrıları yapıyor):**
- Auth: register / login / me / logout / refresh (cookie tabanlı)
- Materials: outputs/inputs CRUD, DPP pasaport üretimi
- Matches: list / find / accept / reject / contact
- Admin: kullanıcılar, tesis doğrulama, review-queue, AHP ağırlıkları (weights)
- Notifications: liste + **canlı WebSocket akışı** (`src/lib/notificationsSocket.ts`)
- OSB listesi (kayıt formundaki dropdown)

**Bağlı DEĞİL (hâlâ yerel/simüle):**
- Chatbot (`ChatbotView`, `ChatWidget`) — anahtar kelime eşleştirmeli yerel bir
  sezgisel yapı, backend'in gerçek `/v1/chat` veya `/v1/ai/classify` uçlarını
  ÇAĞIRMIYOR (backend'de bu uçlar var ama dummy/placeholder yanıt döndürüyorlar,
  bu yüzden bilerek bağlanmadı)
- Raporlar (`ReportsView`) — PDF indirme butonları hâlâ "simüle edildi" alert'i
  gösteriyor, `/v1/reports/*` çağrılmıyor
- `matches/:id/retry` — backend'de henüz implemente edilmedi (Faz 2.8 bekliyor)

## 7. Test hesabı

Supabase veritabanında kayıtlı bir test hesabı var:

- E-posta: `test@example.com`
- Şifre: `Guvenli123!`

## 8. Marka adı

Uygulama içindeki tüm "DöngüNet" referansları "EcoMatch" olarak değiştirildi
(başlık, sohbet asistanı metinleri, sidebar logosu, localStorage anahtarı vb.).
