# DöngüNet Web Panel

DöngüNet, yapay zeka destekli endüstriyel simbiyoz ve sürdürülebilirlik yönetim platformudur. Bu panel, tesislerin atıklarını yönetmesini, yapay zeka tabanlı eşleştirmeler almasını ve SKDM (CBAM) / Dijital Ürün Pasaportu (DPP) raporlarını oluşturmasını simüle eden interaktif bir Next.js kontrol panelidir.

## Geliştirme Ortamı

Geliştirme sunucusunu yerelinizde başlatmak için aşağıdaki komutları kullanabilirsiniz:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Ardından tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görebilirsiniz.
Uygulama kodları `src/app/page.tsx` içerisindedir.

## Yayınlama (GitHub Pages)

Her push işleminde Next.js projesi GitHub Actions aracılığıyla otomatik olarak derlenir ve statik HTML olarak GitHub Pages üzerinde yayınlanır.
Uygulamanın yayındaki adresi: [https://umutardatansever.github.io/DonguNetWeb](https://umutardatansever.github.io/DonguNetWeb)
