# ALÜMTAŞ METAL — Kurumsal Web Sitesi

Alüminyum, silisyum karbür (SiC) ve endüstriyel hammaddelerin ithalat ve satışını yapan
**ALÜMTAŞ METAL LİMİTED ŞİRKETİ** için tek sayfalık kurumsal tanıtım sitesi.

## Özellikler

- **Koyu endüstriyel tasarım** — "ergimiş metal & soğuk alüminyum" konsepti
- **Canvas kıvılcım animasyonu** — hero bölümünde kesim/kaynak noktasından fışkıran ısı-renkli partiküller
- **TR / EN dil desteği** — anlık geçiş, tercih `localStorage`'da saklanır
- **Tam responsive** — mobil hamburger menü, kırılma noktaları
- **Erişilebilirlik** — klavye odağı, `prefers-reduced-motion` desteği (animasyon yerine statik köz parıltısı)
- **Sıfır bağımlılık** — saf HTML/CSS/JS, build gerektirmez

## Yapı

```
alumtas-metal/
├── index.html      # Tüm bölümler (data-i18n işaretli)
├── css/style.css   # Tema, düzen, animasyonlar
└── js/
    ├── i18n.js     # TR/EN sözlük
    └── main.js     # Kıvılcım canvas'ı, dil, scroll, sayaçlar, form
```

## Yerel çalıştırma

`index.html` dosyasını doğrudan tarayıcıda açmanız yeterlidir. İsterseniz basit bir sunucu:

```bash
python -m http.server 8000
# http://localhost:8000
```

## İçeriği güncelleme

- **Metinler:** `js/i18n.js` içindeki `tr` ve `en` sözlüklerini düzenleyin.
- **İletişim bilgileri:** `index.html` içindeki telefon/e-posta/adres alanları (arama: `mailto:`, `tel:`).
- **İstatistikler:** `index.html` içinde `data-count` değerleri.
- **Ürünler:** `.cards` bölümündeki `<article class="card">` blokları.
- **Renkler:** `css/style.css` en üstteki `:root` değişkenleri.

## Yayınlama

GitHub Pages üzerinde `https://burtinsaw.github.io/alumtas-metal/` adresinde yayınlanır.

---
© ALÜMTAŞ METAL LİMİTED ŞİRKETİ
