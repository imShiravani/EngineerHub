(function() {
    const fullCreditTextFa = "پروژه «مرکز مهندس | EngineerHub» یک داشبورد تحت وب با طراحی شیشه‌ای، دوزبانه و ابزارهای کاربردی است که توسط محمد شیروانی طراحی شده است.";
    const fullCreditTextEn = "The 'EngineerHub' project is a web dashboard with glassmorphism design, bilingual (Persian/English) and useful tools, designed by Mohammad Shiravani.";

    const catalogs = {
        home: {
            fa: {
                title: "🏠 صفحه اصلی",
                description: "به مرکز مهندس خوش آمدید. از اینجا می‌توانید به تمام ابزارهای مهندسی دسترسی داشته باشید.",
                features: [
                    "دسترسی سریع به همه ابزارها از طریق کارت‌های شیشه‌ای",
                    "چت بات هوشمند برای راهنمایی",
                    "طراحی واکنش‌گرا و دوزبانه (فارسی/انگلیسی)",
                    "امکان تغییر زبان با دو پرچم در هدر",
                    "پنل کاربری شیشه‌ای با اطلاعات ورود و دسترسی سریع"
                ],
                credit: fullCreditTextFa
            },
            en: {
                title: "🏠 Home",
                description: "Welcome to EngineerHub. Access all engineering tools from here.",
                features: [
                    "Quick access to all tools via glass cards",
                    "Smart chatbot for guidance",
                    "Responsive design & bilingual (Persian/English)",
                    "Change language with two flags in header",
                    "Glass user panel with login info and quick access"
                ],
                credit: fullCreditTextEn
            }
        },
        calculator: {
            fa: {
                title: "🧮 ماشین حساب مهندسی",
                description: "ماشین‌حساب پیشرفته با توابع مثلثاتی، لگاریتم، توان و درصد.",
                features: [
                    "توابع sin, cos, tan, asin, acos, atan",
                    "لگاریتم طبیعی (ln) و مبنای ۱۰ (log)",
                    "عملیات توان (^)، رادیکال (√)، مربع (x²)",
                    "دکمه Ans برای درج آخرین جواب",
                    "پشتیبانی از پرانتز و درصد"
                ],
                credit: fullCreditTextFa
            },
            en: {
                title: "🧮 Engineering Calculator",
                description: "Advanced calculator with trigonometric functions, logarithms, power, and percentage.",
                features: [
                    "sin, cos, tan, asin, acos, atan functions",
                    "Natural log (ln) and base-10 log (log)",
                    "Power (^), square root (√), square (x²)",
                    "Ans button for last result",
                    "Parentheses and percentage support"
                ],
                credit: fullCreditTextEn
            }
        },
        password: {
            fa: {
                title: "🔐 تولید رمز قوی",
                description: "رمزهای عبور امن و غیرقابل حدس با آنالیز قدرت و آنتروپی.",
                features: [
                    "طول قابل تنظیم از ۸ تا ۶۴ کاراکتر",
                    "شامل حروف بزرگ، کوچک، اعداد و نمادها",
                    "ارزیابی قدرت رمز و زمان تقریبی شکستن",
                    "تولید رمز خوانا (pronounceable)",
                    "کپی خودکار و ذخیره تنظیمات"
                ],
                credit: fullCreditTextFa
            },
            en: {
                title: "🔐 Strong Password Generator",
                description: "Generate secure, unguessable passwords with strength and entropy analysis.",
                features: [
                    "Adjustable length from 8 to 64 characters",
                    "Uppercase, lowercase, numbers, and symbols",
                    "Strength evaluation and estimated crack time",
                    "Pronounceable password generation",
                    "Auto-copy and save settings"
                ],
                credit: fullCreditTextEn
            }
        },
        videoplayer: {
            fa: {
                title: "🎬 پلیر ویدیو",
                description: "پخش فیلم از لینک مستقیم یا یوتیوب با کنترل‌های کامل و تاریخچه.",
                features: [
                    "پشتیبانی از فیلم‌های محلی (لینک مستقیم) و یوتیوب",
                    "لیست پخش قابل ذخیره در localStorage",
                    "کنترل‌های پخش، صدا، سرعت، تمام صفحه و تصویر در تصویر",
                    "پشتیبانی از زیرنویس VTT",
                    "کلیدهای میانبر (Space, فلش‌ها, F, M)"
                ],
                credit: fullCreditTextFa
            },
            en: {
                title: "🎬 Video Player",
                description: "Play local videos or YouTube with full controls and history.",
                features: [
                    "Support for direct links and YouTube",
                    "Playlist saved in localStorage",
                    "Playback controls, volume, speed, fullscreen, PiP",
                    "VTT subtitle support",
                    "Keyboard shortcuts (Space, Arrows, F, M)"
                ],
                credit: fullCreditTextEn
            }
        },
        filemanager: {
            fa: {
                title: "📂 مدیریت فایل",
                description: "مدیریت فایل‌ها و پوشه‌های سیستم (فقط در کروم/اج).",
                features: [
                    "انتخاب پوشه ریشه و مشاهده درخت‌واره",
                    "ایجاد، حذف، تغییر نام فایل/پوشه",
                    "جستجوی عمیق در کل زیرشاخه‌ها",
                    "مرتب‌سازی بر اساس نام، اندازه، نوع، پسوند",
                    "نمایش آمار (تعداد پوشه‌ها، فایل‌ها، حجم کل)"
                ],
                credit: fullCreditTextFa
            },
            en: {
                title: "📂 File Manager",
                description: "Manage files and folders (Chrome/Edge only).",
                features: [
                    "Select root folder, view tree structure",
                    "Create, delete, rename files/folders",
                    "Deep search across subfolders",
                    "Sort by name, size, type, extension",
                    "Statistics (folders, files, total size)"
                ],
                credit: fullCreditTextEn
            }
        },
        colorpicker: {
            fa: {
                title: "🎨 پالت رنگ",
                description: "انتخاب رنگ و دریافت کدهای HEX، RGB، HSL، CMYK، HSV.",
                features: [
                    "انتخابگر رنگ با input type color",
                    "نمایش کدهای رنگی مختلف با قابلیت کپی",
                    "تولید رنگ تصادفی",
                    "۱۲ سواچ رنگی آماده",
                    "تغییر پس‌زمینه پیش‌نمایش (روشن/تاریک)"
                ],
                credit: fullCreditTextFa
            },
            en: {
                title: "🎨 Color Picker",
                description: "Pick a color and get HEX, RGB, HSL, CMYK, HSV codes.",
                features: [
                    "Color picker with input type color",
                    "Display various color codes with copy button",
                    "Random color generator",
                    "12 preset swatches",
                    "Change preview background (light/dark)"
                ],
                credit: fullCreditTextEn
            }
        },
        textunit: {
            fa: {
                title: "📊 متن‌یار حرفه‌ای + مبدل واحد",
                description: "تحلیلگر متن و مبدل واحدهای مختلف در یک ابزار.",
                features: [
                    "تحلیل متن پیشرفته: نمایش تعداد کاراکتر (با/بدون فاصله)، کلمات، خطوط، جملات و زمان تخمینی مطالعه",
                    "ذخیره خودکار متن در localStorage و بازیابی پس از بازگشت",
                    "کپی آمار متن در کلیپ‌بورد با یک کلیک",
                    "مبدل واحد جامع با پشتیبانی از ۱۰ دسته (طول، وزن، دما، مساحت، حجم، سرعت، زمان، انرژی، فشار، ذخیره‌سازی داده)",
                    "جابه‌جایی سریع واحد مبدأ و مقصد با دکمه Swap",
                    "کپی نتیجه تبدیل با یک کلیک"
                ],
                credit: fullCreditTextFa
            },
            en: {
                title: "📊 Text & Unit Converter",
                description: "Text analysis and unit conversion in one tool.",
                features: [
                    "Advanced text analysis: character count (with/without spaces), words, lines, sentences, estimated reading time",
                    "Auto-save text to localStorage and restore on return",
                    "Copy text statistics to clipboard with one click",
                    "Comprehensive unit converter supporting 10 categories (length, weight, temperature, area, volume, speed, time, energy, pressure, data storage)",
                    "Quick swap between source and target units via Swap button",
                    "Copy conversion result with one click"
                ],
                credit: fullCreditTextEn
            }
        },
        timer: {
            fa: {
                title: "⏱️ کرنومتر و تایمر",
                description: "زمان‌سنجی دقیق با قابلیت ثبت لاپ و تایمر معکوس.",
                features: [
                    "کرنومتر با دقت ۱۰ میلی‌ثانیه (شروع، توقف، لاپ، بازنشانی)",
                    "تایمر معکوس با اعلان صوتی و ویبره",
                    "ذخیره خودکار وضعیت در localStorage",
                    "نمایش تاریخچه تایمرهای تمام شده"
                ],
                credit: fullCreditTextFa
            },
            en: {
                title: "⏱️ Stopwatch & Timer",
                description: "Precise timing with lap recording and countdown.",
                features: [
                    "Stopwatch with 10ms precision (start, stop, lap, reset)",
                    "Countdown timer with sound and vibration alert",
                    "Auto-save state to localStorage",
                    "History of completed timers"
                ],
                credit: fullCreditTextEn
            }
        },
        musicplayer: {
            fa: {
                title: "🎵 پلیر موسیقی حرفه‌ای",
                description: "پخش آفلاین (آپلود MP3) و آنلاین (آلبوم‌های ذوزنقه و بزن تار).",
                features: [
                    "پخش آفلاین: آپلود فایل‌های MP3 و استخراج خودکار کاور و اطلاعات آهنگ با jsmediatags",
                    "پخش آنلاین: دسترسی به آلبوم‌های «ذوزنقه» (مهراد هیدن) و «بزن تار» (هایده)",
                    "لیست پخش هوشمند: ذخیره خودکار لیست در localStorage و افزودن آهنگ از آلبوم‌های آنلاین",
                    "کنترل‌های کامل: پخش/توقف، قبلی/بعدی، تصادفی، تکرار (لیست/تک آهنگ)، تنظیم صدا، نوار پیشرفت",
                    "مینی پلیر شناور با نمایش آهنگ در حال پخش و کنترل‌های سریع",
                    "ذخیره وضعیت: حفظ آهنگ در حال پخش، میزان صدا، حالت تکرار و تصادفی پس از بارگذاری صفحه"
                ],
                credit: fullCreditTextFa
            },
            en: {
                title: "🎵 Music Player",
                description: "Offline (upload MP3) and online (Zoozanaghe & Bezan Tar albums).",
                features: [
                    "Offline playback: Upload MP3 files and automatic extraction of cover and metadata using jsmediatags",
                    "Online playback: Access to 'Zoozanaghe' (Mehrad Hidden) and 'Bezan Tar' (Hayedeh) albums",
                    "Smart playlist: Auto-save playlist to localStorage and add online songs to playlist",
                    "Full controls: Play/Pause, Previous/Next, Shuffle, Repeat (list/single track), Volume control, Progress bar",
                    "Floating mini player showing currently playing song with quick controls",
                    "State saving: Remember current song, volume, repeat mode, and shuffle after page reload"
                ],
                credit: fullCreditTextEn
            }
        },
        smarteditor: {
            fa: {
                title: "📝 ویرایشگر متن حرفه‌ای (مثل ورد)",
                description: "ویرایشگر متن کامل با قالب‌بندی، جدول و خروجی‌های مختلف.",
                features: [
                    "قالب‌بندی حرفه‌ای: پررنگ، کج، زیرخط، عنوان H3",
                    "تنظیم سایز فونت به صورت دستی (۸ تا ۷۲ پیکسل) یا با دکمه‌های + و -",
                    "واگرد/ازنو (Undo/Redo) با حافظه ۵ حرکت آخر",
                    "درج جدول با تعداد سطر و ستون دلخواه و حذف سطر/ستون جاری",
                    "آپلود فایل‌های TXT و DOCX و نمایش متن در ویرایشگر",
                    "خروجی به فرمت‌های PDF، DOC (سازگار با ورد) و HTML همراه با ذخیره خودکار در localStorage"
                ],
                credit: fullCreditTextFa
            },
            en: {
                title: "📝 Pro Text Editor",
                description: "Full-featured text editor with formatting, table, and various exports.",
                features: [
                    "Professional formatting: Bold, Italic, Underline, Heading H3",
                    "Font size control: Manual input (8-72 pixels) or +/- buttons",
                    "Undo/Redo with 5-step memory",
                    "Insert table with custom rows/columns and delete current row/column",
                    "Upload TXT and DOCX files and display text in editor",
                    "Export to PDF, DOC (Word compatible), HTML with auto-save to localStorage"
                ],
                credit: fullCreditTextEn
            }
        }
    };

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
    }

    window.showCatalog = function(toolId) {
        if (!catalogs[toolId]) return;
        const seenKey = 'catalog_' + toolId;
        if (sessionStorage.getItem(seenKey) === 'true') return;
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'fa';
        const data = catalogs[toolId][lang];
        if (!data) return;

        const overlay = document.createElement('div');
        overlay.className = 'catalog-overlay';
        let featuresHtml = '<ul class="catalog-features">';
        for (let i = 0; i < data.features.length; i++) {
            featuresHtml += '<li>' + escapeHtml(data.features[i]) + '</li>';
        }
        featuresHtml += '</ul>';
        overlay.innerHTML = '<div class="catalog-card">' +
            '<div class="catalog-icon">' + escapeHtml(data.title.split(' ')[0]) + '</div>' +
            '<div class="catalog-title">' + escapeHtml(data.title) + '</div>' +
            '<div class="catalog-description">' + escapeHtml(data.description) + '</div>' +
            featuresHtml +
            '<div class="catalog-credit" style="margin-top: 16px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.75rem; color: #94a3b8; text-align: center;">' + escapeHtml(data.credit) + '</div>' +
            '<button class="catalog-btn">✓ خواندم و تأیید میکنم</button>' +
            '</div>';
        document.body.appendChild(overlay);
        const btn = overlay.querySelector('.catalog-btn');
        btn.addEventListener('click', () => {
            sessionStorage.setItem(seenKey, 'true');
            overlay.remove();
        });
        overlay.addEventListener('click', (e) => e.stopPropagation());
        const card = overlay.querySelector('.catalog-card');
        if (card) card.addEventListener('click', (e) => e.stopPropagation());
    };

    window.resetCatalogsOnLogout = function() {
        const keys = [];
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith('catalog_')) keys.push(key);
        }
        keys.forEach(k => sessionStorage.removeItem(k));
    };
})();