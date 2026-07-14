<div align="center">

# 🛠️ EngineerHub — مرکز مهندس

### پلتفرم چندابزاره‌ی تحت وب برای مهندسان | دوزبانه (فارسی/انگلیسی)

![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-MariaDB-4479A1?style=flat-square&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**[معرفی](#-معرفی) • [ابزارها](#-ابزارها) • [نصب](#-نصب) • [ساختار پروژه](#-ساختار-پروژه) • [امنیت](#-امنیت) • [لایسنس](#-لایسنس)**

</div>

---

## 📖 معرفی

**EngineerHub (مرکز مهندس)** یک پلتفرم تحت وب دوزبانه و راست‌چین (RTL) است که مجموعه‌ای از ابزارهای کاربردی رو برای مهندسان، دانشجویان و کاربران حرفه‌ای در یک محیط واحد و یکپارچه فراهم می‌کنه.

این پروژه با **PHP و MySQL** در سمت سرور و **Vanilla JavaScript** در سمت کاربر توسعه یافته و دارای سیستم احراز هویت کامل، پنل مدیریت، چت‌بات هوشمند و ۹ ابزار تخصصی هست.

> 💡 **نکته:** هیچ فریم‌ورک فرانت‌اندی (React/Vue/Angular) استفاده نشده — همه چیز با JS خالص و بدون نیاز به build نوشته شده.

---

## ✨ ویژگی‌های اصلی

- 🌐 **رابط کاربری دوزبانه** — پشتیبانی کامل از فارسی (RTL) و انگلیسی (LTR) با امکان تعویض زبان زنده و ذخیره در `localStorage`
- 🔐 **احراز هویت امن** — استفاده از PDO و prepared statements، سشن‌های PHP، توکن «مرا به خاطر بسپار» ذخیره‌شده در جدول `user_sessions`
- 👤 **نقش‌های کاربری** — نقش‌های `user` و `admin` با دسترسی متفاوت به پنل مدیریت
- 🎨 **شخصی‌سازی کامل** — عنوان سایت، شعار، رنگ اصلی و فعال/غیرفعال کردن هر ابزار از پنل ادمین
- 💬 **چت‌بات هوشمند** — پاسخگو به سوالات متداول درباره‌ی هر ابزار
- 📱 **کاملاً ریسپانسیو** — سازگار با موبایل، تبلت و دسکتاپ با Bootstrap 5
- 🎵 **کاتالوگ موسیقی** — مدیریت آلبوم و آهنگ از دیتابیس با خواندن ID3 tag
- 🐛 **ثبت خطاها** — همه‌ی خطاهای بک‌اند در جدول `error_logs` ذخیره می‌شن

---

## 🧰 ابزارها

| # | ابزار | توضیح |
|---|------|-------|
| 1 | 🧮 **ماشین حساب مهندسی** | توابع مثلثاتی، لگاریتم، توان، `Ans`، درصد |
| 2 | 🔑 **تولید رمز قوی** | طول دلخواه، آنتروپی، رمز خوانا، کپی خودکار |
| 3 | 🎬 **پلیر ویدیو** | پخش URL و یوتیوب، زیرنویس VTT، لیست پخش، حالت تئاتر |
| 4 | 📁 **مدیریت فایل** | File System Access API، جستجوی عمیق، تغییر نام و حذف |
| 5 | 🎨 **پالت رنگ** | تبدیل HEX/RGB/HSL/HSV/CMYK، کپی یک‌کلیکی |
| 6 | 📝 **متن‌یار و مبدل واحد** | شمارش کاراکتر/کلمه/خط، زمان مطالعه، مبدل واحد |
| 7 | ✍️ **ویرایشگر حرفه‌ای متن** | rich text، undo/redo، ذخیره خودکار، خروجی PDF |
| 8 | ⏱️ **کرنومتر و تایمر** | دقت میلی‌ثانیه، لیست دورها، تایمر معکوس |
| 9 | 🎵 **پلیر موسیقی** | کاتالوگ آلبوم، mini-player، خواندن ID3 tag |

---

## 🏗️ تکنولوژی‌ها

### بک‌اند
- **PHP 8.2+** — منطق سرور، مدیریت سشن، API endpoints
- **MySQL / MariaDB** — ذخیره‌سازی با PDO و prepared statements
- **PHP Native Sessions** — با نام اختصاصی `ENGINEERHUB_SESSION`

### فرانت‌اند
- **Vanilla JavaScript (ES6+)** — بدون فریم‌ورک، معماری ماژولار
- **Bootstrap 5** — گرید ریسپانسیو و کامپوننت‌ها
- **CSS سفارشی** — Glassmorphism، RTL/LTR aware

### کتابخانه‌های شخص ثالث (داخل `assests/libs/`)
| کتابخانه | کاربرد |
|---------|--------|
| `bootstrap.min.css` | فریم‌ورک UI |
| `jsmediatags.min.js` | خواندن ID3 tag از فایل MP3 |
| `html2pdf.bundle.min.js` | خروجی PDF از محتوای ویرایشگر |
| `mammoth.browser.min.js` | تبدیل `.docx` به HTML |
| `jalaali.min.js` | تبدیل تاریخ شمسی |

---

## 📁 ساختار پروژه

```
EngineerHub/
├── index.php                  # درب ورود — احراز هویت + رندر قالب
├── login.html                 # صفحه ورود/ثبت‌نام
├── template.html              # ساختار اصلی اپلیکیشن
├── adminpanel.php             # پنل مدیریت (مخصوص ادمین)
├── db.php                     # اتصال به دیتابیس ⚠️ در گیت آپلود نشه
├── config.example.php         # نمونه کانفیگ برای شروع
│
├── api_login.php              # ورود کاربر
├── api_register.php           # ثبت‌نام کاربر
├── api_logout.php             # خروج
├── api_check_session.php      # اعتبارسنجی توکن
├── api_set_online_mode.php    # وضعیت آنلاین
├── api_delete_account.php     # حذف حساب کاربری
├── admin_api.php              # CRUD مدیریت
│
├── engineerhub_db.sql         # اسکیمای کامل دیتابیس + داده‌ی اولیه
├── EngineerHub_Document.pdf   # مستندات پروژه
│
└── assests/                   # ⚠️ املا عمداً حفظ شده
    ├── css/                   # ۱۶ فایل استایل (هر ابزار + main + admin)
    ├── js/                    # ۱۸ ماژول جاوااسکریپت
    ├── libs/                  # کتابخانه‌های شخص ثالث
    └── images/                # کاور آلبوم و تصاویر
```

> ⚠️ **نکته‌ی املا:** پوشه‌ی `assests/` عمداً با این املا نگه داشته شده تا با URL های موجود سازگار باشه. لطفاً نامش رو تغییر ندید.

---

## ⚙️ نصب

### پیش‌نیازها
- **PHP 8.2** یا بالاتر
- **MySQL 5.7+** یا **MariaDB 10.4+**
- یک لوکال‌سرور مثل **XAMPP** / **WAMP** / **MAMP** / **Laragon**

### مراحل

**۱. کلون کردن ریپو**
```bash
git clone https://github.com/<your-username>/EngineerHub.git
cd EngineerHub
```

**۲. انتقال به روت وب‌سرور**
- XAMPP: `htdocs/`
- WAMP: `www/`
- Laragon: `www/`

**۳. تنظیم دیتابیس**
```bash
cp config.example.php db.php
# سپس db.php رو با اطلاعات دیتابیس خودت ویرایش کن
```

**۴. ایمپورت اسکیما**
- به `http://localhost/phpmyadmin` برو
- یک دیتابیس جدید به نام `engineerhub_db` بساز (collation: `utf8mb4_general_ci`)
- فایل `engineerhub_db.sql` رو ایمپورت کن

**۵. اجرا**
- به `http://localhost/EngineerHub/login.html` برو
- ثبت‌نام کن — برای تبدیل به ادمین، در phpMyAdmin در جدول `users` مقدار `role` رو به `admin` تغییر بده

---

## 🗄️ جداول دیتابیس

| جدول | کاربرد |
|------|--------|
| `users` | اطلاعات حساب کاربری، نقش |
| `user_sessions` | توکن‌های «مرا به خاطر بسپار» |
| `site_settings` | تنظیمات سایت (عنوان، شعار، رنگ) |
| `tools_settings` | فعال/غیرفعال کردن ابزارها |
| `music_albums` | اطلاعات آلبوم‌ها |
| `music_songs` | لیست آهنگ‌ها |
| `daily_visits` | شمارش بازدید روزانه |
| `error_logs` | لاگ خطاها |

---

## 🔐 امنیت

> ⚠️ قبل از دیپلوی در پروداکشن، این موارد رو حتماً رعایت کن:

1. **اطلاعات دیتابیس** — `db.php` با `root` و پسورد خالی فقط برای لوکال هست. در پروداکشن یک یوزر اختصاصی با پسورد قوی بساز. فایل `.gitignore` از آپلود `db.php` جلوگیری می‌کنه.
2. **هش پسورد** — مطمئن شو در `api_register.php` از `password_hash(..., PASSWORD_BCRYPT)` و در `api_login.php` از `password_verify()` استفاده می‌شه.
3. **HTTPS** — در پروداکشن حتماً از TLS استفاده کن.
4. **فلگ‌های کوکی سشن** — در پروداکشن `httponly`، `secure` و `samesite=Strict` رو فعال کن.
5. **display_errors** — در `php.ini` پروداکشن، `display_errors = Off` قرار بده.

---

## 🎨 شخصی‌سازی

همه‌ی تنظیمات از پنل ادمین قابل تغییره (بدون نیاز به ویرایش کد):

- 🏷️ عنوان سایت (فارسی + انگلیسی)
- 📣 شعار سایت
- 🎨 رنگ اصلی (HEX — متغیر CSS `--primary-color`)
- 🧰 فعال/غیرفعال کردن هر ابزار
- 🎵 مدیریت آلبوم‌ها و آهنگ‌ها
- 👥 مدیریت کاربران (مشاهده، ارتقا به ادمین، حذف)

---

## 📸 اسکرین‌شات‌ها

> _اسکرین‌شات‌ها رو اینجا اضافه کن._
>
> یک پوشه‌ی `screenshots/` در ریشه‌ی پروژه بساز و تصاویر رو با این الگو قرار بده:
>
> ```markdown
> <p align="center">
>   <img src="screenshots/home.png" width="80%" alt="صفحه اصلی">
> </p>
> ```

---

## 🚀 نقشه‌ی راه

- [ ] مهاجرت دیکشنری‌های inline به فایل‌های JSON با i18n
- [ ] افزودن پیشوند نسخه به API (`/api/v1/...`)
- [ ] تبدیل ماژول‌های JS به ES Modules با bundler
- [ ] احراز هویت دو مرحله‌ای (TOTP) برای ادمین‌ها
- [ ] پشتیبانی PWA / آفلاین با Service Worker
- [ ] تست‌های PHPUnit و Playwright
- [ ] Docker Compose برای راه‌اندازی یک‌کلیکی لوکال

---

## 🤝 مشارکت

از مشارکتت استقبال می‌کنیم! مراحل:

1. پروژه رو **Fork** کن
2. یک برنچ بساز: `git checkout -b feature/amazing-feature`
3. تغییراتت رو commit کن: `git commit -m "feat(calculator): add memory buttons"`
4. push کن: `git push origin feature/amazing-feature`
5. یک **Pull Request** باز کن

### سبک کد
- **PHP:** پیروی از [PSR-12](https://www.php-fig.org/psr/psr-12/)
- **JS:** تورفتگی ۴ فضای خالی، نام‌گذاری `buildXxx` / `updateXxx` / `renderXxx`
- **CSS:** شبیه BEM، هر کامپوننت در یک فایل جدا

---

## 📄 لایسنس

این پروژه تحت لایسنس **MIT** منتشر شده — برای جزئیات به فایل [LICENSE](LICENSE) مراجعه کن.

---

## 📞 تماس


**محمد شیروانی** (Mohammad Shiravani)

- 📧 ایمیل: [Mamadghx82@gmail.com]
- 🐙 گیت‌هاب: https://github.com/imShiravani

> 🌟 اگه این پروژه بهت کمک کرد، لطفاً یک **ستاره** بزن — این کار به بقیه هم کمک می‌کنه پیداش کنن!

---

<div align="center">

<sub>با ❤️ برای جامعه‌ی مهندسان ساخته شد</sub>

</div>
