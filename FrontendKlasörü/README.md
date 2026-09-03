# EcoMatch Web Panel

EcoMatch, yapay zeka destekli endüstriyel simbiyoz ve sürdürülebilirlik yönetim platformudur. Bu panel, tesislerin atıklarını yönetmesini, yapay zeka tabanlı eşleştirmeler almasını ve SKDM (CBAM) / Dijital Ürün Pasaportu (DPP) raporlarını oluşturmasını sağlayan interaktif bir Next.js kontrol panelidir.

## Geliştirme Ortamı

Backend'in (`eco-match-application-main/backend`) ayrıca çalışıyor olması gerekir — bkz. [BURAYIOKU.md](BURAYIOKU.md).

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Ardından tarayıcınızda [http://localhost:3000](http://localhost:3000) (veya backend başka bir portta çalışıyorsa `.env.local`'e göre değişen frontend portu) adresini açarak uygulamayı görebilirsiniz.
Uygulama kodları `src/app/page.tsx` içerisindedir.

## Build

```bash
npm run build
```

Statik export (`output: "export"`) üretir, çıktı `out/` klasöründe oluşur.
