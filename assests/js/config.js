// ==================== config.js – تنظیمات عمومی و ترجمه ====================

// ---- مدیریت زبان یکپارچه (ذخیره در localStorage) ----
function getStoredLanguage() {
    var stored = localStorage.getItem('appLang');
    if (stored === 'en' || stored === 'fa') return stored;
    return 'fa';
}

function setStoredLanguage(lang) {
    localStorage.setItem('appLang', lang);
}

function clearStoredLanguage() {
    localStorage.removeItem('appLang');
}

// بارگذاری زبان از localStorage
var currentLang = getStoredLanguage();

// ---- دیکشنری ترجمه ----
var translations = {
    fa: {
        nav_home: "خانه",
        nav_calculator: "ماشین حساب مهندسی",
        nav_password: "تولید رمز قوی",
        nav_videoplayer: "پلیر ویدیو",
        nav_filemanager: "مدیریت فایل",
        nav_colorpicker: "پالت رنگ",
        nav_textunit: "متن و مبدل",
        nav_smarteditor: "ویرایشگر حرفه‌ای متن",
        nav_timer: "کرنومتر و تایمر",
        nav_musicplayer: "پلیر موسیقی",
        back_to_home: "🏠 خانه",
        about_us: "📖 درباره ما",
        back_to_main_menu: "🔙 بازگشت به منوی اصلی",
        explain_tool: "📖 توضیح درباره",
        home_welcome: "به مرکز مهندس خوش آمدید",
        home_select_tool: "ابزارهای قدرتمند را از نوار سمت راست انتخاب کنید",
        tool_calc_title: "ماشین حساب مهندسی",
        tool_calc_desc: "توابع مثلثاتی، لگاریتم، توان و ...",
        tool_pwd_title: "تولید رمز قوی",
        tool_pwd_desc: "رمزهای امن با آنالیز قدرت",
        tool_videoplayer_title: "پلیر ویدیو",
        tool_videoplayer_desc: "پخش فیلم و یوتیوب با تاریخچه و کنترل کامل",
        tool_filemanager_title: "مدیریت فایل",
        tool_filemanager_desc: "مدیریت پوشه‌ها و فایل‌ها با جستجوی عمیق",
        tool_colorpicker_title: "پالت رنگ",
        tool_colorpicker_desc: "انتخاب رنگ و کپی کدهای HEX، RGB، HSL",
        tool_textunit_title: "متن‌یار و مبدل واحد",
        tool_textunit_desc: "تحلیل متن و تبدیل واحدها در یک ابزار",
        tool_smarteditor_title: "ویرایشگر حرفه‌ای متن",
        tool_smarteditor_desc: "ویرایش، قالب‌بندی، آمار و ذخیره خودکار",
        tool_timer_title: "کرنومتر و تایمر",
        tool_timer_desc: "زمان‌سنجی دقیق، لاپ و تایمر معکوس",
        tool_musicplayer_title: "پلیر موسیقی",
        tool_musicplayer_desc: "آپلود، لیست پخش و تصویر آلبوم",
        editor_title: "ویرایشگر حرفه‌ای متن",
        editor_placeholder: "متن خود را اینجا بنویسید...",
        pwd_title: "تولیدکننده رمز قوی",
        copy_btn: "کپی",
        copy_title: "کپی رمز در کلیپ بورد",
        generate_btn: "جدید",
        generate_title: "تولید رمز جدید",
        length_label: "طول رمز:",
        slider_title: "انتخاب طول رمز بین 8 تا 64 کاراکتر",
        strength_label: "قدرت رمز:",
        copy_success: "کپی شد!",
        entropy: "آنتروپی (قدرت رمز)",
        pronounceable_btn: "رمز خوانا",
        auto_copy: "کپی خودکار پس از تولید",
        tip_sin: "سینوس (رادیان)",
        tip_cos: "کسینوس (رادیان)",
        tip_tan: "تانژانت (رادیان)",
        tip_asin: "آرک سینوس",
        tip_acos: "آرک کسینوس",
        tip_atan: "آرک تانژانت",
        tip_ln: "لگاریتم طبیعی",
        tip_log: "لگاریتم پایه 10",
        tip_sqrt: "جذر",
        tip_pow: "به توان",
        tip_pi: "عدد پی",
        tip_e: "عدد نپر",
        tip_open: "پرانتز باز",
        tip_close: "پرانتز بسته",
        tip_clear: "پاک کردن",
        tip_back: "حذف",
        tip_percent: "درصد",
        tip_x2: "مجذور",
        tip_ans: "درج آخرین جواب",
        tip_equal: "محاسبه",
        tip_div: "تقسیم",
        tip_mul: "ضرب",
        tip_sub: "تفریق",
        tip_add: "جمع",
        tip_0: "صفر",
        tip_1: "یک",
        tip_2: "دو",
        tip_3: "سه",
        tip_4: "چهار",
        tip_5: "پنج",
        tip_6: "شش",
        tip_7: "هفت",
        tip_8: "هشت",
        tip_9: "نه",
        tip_dot: "نقطه",
        server_time: "زمان سرور",
        ip_address: "IP",
        colorpicker_title: "انتخابگر رنگ",
        colorpicker_hex_label: "HEX",
        colorpicker_rgb_label: "RGB",
        colorpicker_hsl_label: "HSL",
        colorpicker_cmyk_label: "CMYK",
        colorpicker_hsv_label: "HSV",
        colorpicker_copy_btn: "کپی",
        colorpicker_copy_success: "کپی شد!",
        colorpicker_current_color: "رنگ انتخاب شده",
        colorpicker_random_btn: "🎲 تصادفی",
        colorpicker_light_mode: "☀️ پس‌زمینه روشن",
        colorpicker_dark_mode: "🌙 پس‌زمینه تاریک",
        textunit_title: "متن‌یار و مبدل واحد",
        tab_text_analyzer: "تحلیل محتوای متن",
        tab_unit_converter: "مبدل واحد",
        text_placeholder: "متن خود را اینجا وارد کنید...",
        char_count: "تعداد کاراکتر",
        char_no_space: "بدون فاصله",
        word_count: "تعداد کلمات",
        line_count: "تعداد خطوط",
        reading_time: "زمان مطالعه",
        seconds: "ثانیه",
        min_read: "دقیقه",
        sentence_count: "جملات",
        clear_text: "پاک کردن متن",
        copy_stats: "کپی آمار",
        swap_units: "جابه‌جایی واحدها",
        copy_result: "کپی نتیجه",
        data_storage: "ذخیره‌سازی داده",
        unit_category: "دسته‌بندی",
        unit_from: "از",
        unit_to: "به",
        unit_result: "نتیجه",
        length: "طول",
        weight: "وزن",
        temperature: "دما",
        area: "مساحت",
        volume: "حجم",
        speed: "سرعت",
        time: "زمان",
        energy: "انرژی",
        pressure: "فشار",
        meter: "متر",
        kilometer: "کیلومتر",
        mile: "مایل",
        foot: "فوت",
        inch: "اینچ",
        gram: "گرم",
        kilogram: "کیلوگرم",
        pound: "پوند",
        ounce: "اونس",
        celsius: "سلسیوس",
        fahrenheit: "فارنهایت",
        kelvin: "کلوین",
        square_meter: "متر مربع",
        square_kilometer: "کیلومتر مربع",
        hectare: "هکتار",
        acre: "ایکر",
        liter: "لیتر",
        milliliter: "میلی‌لیتر",
        gallon: "گالن",
        kmh: "km/h",
        mph: "mph",
        ms: "m/s",
        second: "ثانیه",
        minute: "دقیقه",
        hour: "ساعت",
        joule: "ژول",
        calorie: "کالری",
        pascal: "پاسکال",
        bar: "بار",
        byte: "بایت",
        kilobyte: "کیلوبایت",
        megabyte: "مگابایت",
        gigabyte: "گیگابایت",
        terabyte: "ترابایت",
        filemgr_select_root: "انتخاب پوشه ریشه",
        filemgr_new_folder: "پوشه جدید",
        filemgr_new_file: "فایل جدید",
        filemgr_back: "بازگشت",
        filemgr_refresh: "بازخوانی",
        filemgr_sort_label: "مرتب‌سازی بر اساس:",
        filemgr_sort_az: "الفبا (آ تا ی)",
        filemgr_sort_za: "الفبا (ی تا آ)",
        filemgr_sort_size_desc: "حجم (بزرگ به کوچک)",
        filemgr_sort_size_asc: "حجم (کوچک به بزرگ)",
        filemgr_sort_type: "نوع (پوشه / فایل)",
        filemgr_sort_extension: "پسوند فایل",
        filemgr_search_placeholder: "جستجوی عمیق در کل پوشه ریشه...",
        filemgr_search_status_ready: "آماده",
        filemgr_searching: "در حال جستجو",
        filemgr_results_for: "نتیجه برای",
        filemgr_items_scanned: "آیتم اسکن شد",
        filemgr_no_results: "نتیجه‌ای برای",
        filemgr_path: "مسیر",
        filemgr_open_folder: "باز کردن پوشه",
        filemgr_empty_folder: "این پوشه خالی است",
        filemgr_folders: "پوشه",
        filemgr_files: "فایل",
        filemgr_total_size: "حجم کل",
        filemgr_permission_denied: "دسترسی نوشتن ندارید",
        filemgr_confirm_delete: "آیا از حذف «{name}» مطمئنید؟",
        filemgr_error_rename: "خطا در تغییر نام",
        filemgr_error_delete: "خطا در حذف",
        filemgr_error_create_folder: "خطا در ایجاد پوشه",
        filemgr_error_create_file: "خطا در ایجاد فایل",
        filemgr_rename_prompt: "نام جدید:",
        filemgr_new_folder_prompt: "نام پوشه جدید:",
        filemgr_new_file_prompt: "نام فایل جدید (با پسوند):",
        filemgr_select_root_first: "ابتدا پوشه ریشه را انتخاب کنید",
        filemgr_unsupported: "مرورگر شما از مدیریت فایل پشتیبانی نمی‌کند. از کروم/اج استفاده کنید.",
        filemgr_loading: "در حال بارگذاری...",
        role_badge_admin: "مدیر سیستم",
        role_badge_user: "کاربر عادی",
        quick_tools_title: "⚡ دسترسی سریع",
        quick_tool_calculator: "🧮 ماشین حساب",
        quick_tool_musicplayer: "🎵 موزیک",
        quick_tool_editor: "📝 ویرایشگر",
        admin_shortcut_text: "⚙️ ورود به پنل مدیریت",
        login_time_label: "🕒 ورود:",
        logout_button: "🚪 خروج از حساب",
        default_email: "ایمیل ثبت نشده",
        default_guest: "مهمان"
    },
    en: {
        nav_home: "Home",
        nav_calculator: "Engineering Calculator",
        nav_password: "Strong Password",
        nav_videoplayer: "Video Player",
        nav_filemanager: "File Manager",
        nav_colorpicker: "Color Picker",
        nav_textunit: "Text & Units",
        nav_smarteditor: "Pro Text Editor",
        nav_timer: "Stopwatch & Timer",
        nav_musicplayer: "Music Player",
        back_to_home: "🏠 Home",
        about_us: "📖 About Us",
        back_to_main_menu: "🔙 Back to Main Menu",
        explain_tool: "📖 Explain about",
        home_welcome: "Welcome to EngineerHub",
        home_select_tool: "Select tools from sidebar",
        tool_calc_title: "Calculator",
        tool_calc_desc: "Trig, log, power",
        tool_pwd_title: "Password",
        tool_pwd_desc: "Secure passwords",
        tool_videoplayer_title: "Video Player",
        tool_videoplayer_desc: "Movies & YouTube with history and full controls",
        tool_filemanager_title: "File Manager",
        tool_filemanager_desc: "Manage folders and files with deep search",
        tool_colorpicker_title: "Color Picker",
        tool_colorpicker_desc: "Pick color and copy HEX, RGB, HSL codes",
        tool_textunit_title: "Text & Unit Converter",
        tool_textunit_desc: "Text analyzer and unit converter in one tool",
        tool_smarteditor_title: "Pro Editor",
        tool_smarteditor_desc: "Formatting, stats, auto-save",
        tool_timer_title: "Stopwatch & Timer",
        tool_timer_desc: "Precise timing, laps, countdown",
        tool_musicplayer_title: "Music Player",
        tool_musicplayer_desc: "Upload, playlist and album art",
        editor_title: "Pro Text Editor",
        editor_placeholder: "Write your text here...",
        pwd_title: "Strong Password",
        copy_btn: "Copy",
        copy_title: "Copy to clipboard",
        generate_btn: "New",
        generate_title: "Generate new",
        length_label: "Length:",
        slider_title: "Select length 8-64",
        strength_label: "Strength:",
        copy_success: "Copied!",
        entropy: "Entropy (strength)",
        pronounceable_btn: "Readable password",
        auto_copy: "Auto-copy after generation",
        tip_sin: "Sine (rad)",
        tip_cos: "Cosine (rad)",
        tip_tan: "Tangent (rad)",
        tip_asin: "Arcsine",
        tip_acos: "Arccosine",
        tip_atan: "Arctangent",
        tip_ln: "Natural log",
        tip_log: "Base-10 log",
        tip_sqrt: "Square root",
        tip_pow: "Power",
        tip_pi: "Pi",
        tip_e: "Euler",
        tip_open: "(",
        tip_close: ")",
        tip_clear: "Clear",
        tip_back: "Backspace",
        tip_percent: "Percent",
        tip_x2: "Square",
        tip_ans: "Last answer",
        tip_equal: "Calculate",
        tip_div: "/",
        tip_mul: "*",
        tip_sub: "-",
        tip_add: "+",
        tip_0: "0",
        tip_1: "1",
        tip_2: "2",
        tip_3: "3",
        tip_4: "4",
        tip_5: "5",
        tip_6: "6",
        tip_7: "7",
        tip_8: "8",
        tip_9: "9",
        tip_dot: ".",
        server_time: "Server Time",
        ip_address: "IP",
        colorpicker_title: "Color Picker",
        colorpicker_hex_label: "HEX",
        colorpicker_rgb_label: "RGB",
        colorpicker_hsl_label: "HSL",
        colorpicker_cmyk_label: "CMYK",
        colorpicker_hsv_label: "HSV",
        colorpicker_copy_btn: "Copy",
        colorpicker_copy_success: "Copied!",
        colorpicker_current_color: "Selected color",
        colorpicker_random_btn: "🎲 Random",
        colorpicker_light_mode: "☀️ Light BG",
        colorpicker_dark_mode: "🌙 Dark BG",
        textunit_title: "Text & Unit Converter",
        tab_text_analyzer: "Text Analyzer",
        tab_unit_converter: "Unit Converter",
        text_placeholder: "Enter your text here...",
        char_count: "Characters",
        char_no_space: "No spaces",
        word_count: "Words",
        line_count: "Lines",
        reading_time: "Reading time",
        seconds: "sec",
        min_read: "min read",
        sentence_count: "Sentences",
        clear_text: "Clear text",
        copy_stats: "Copy stats",
        swap_units: "Swap units",
        copy_result: "Copy result",
        data_storage: "Data storage",
        unit_category: "Category",
        unit_from: "From",
        unit_to: "To",
        unit_result: "Result",
        length: "Length",
        weight: "Weight",
        temperature: "Temperature",
        area: "Area",
        volume: "Volume",
        speed: "Speed",
        time: "Time",
        energy: "Energy",
        pressure: "Pressure",
        meter: "Meter",
        kilometer: "Kilometer",
        mile: "Mile",
        foot: "Foot",
        inch: "Inch",
        gram: "Gram",
        kilogram: "Kilogram",
        pound: "Pound",
        ounce: "Ounce",
        celsius: "Celsius",
        fahrenheit: "Fahrenheit",
        kelvin: "Kelvin",
        square_meter: "Square Meter",
        square_kilometer: "Square Kilometer",
        hectare: "Hectare",
        acre: "Acre",
        liter: "Liter",
        milliliter: "Milliliter",
        gallon: "Gallon",
        kmh: "km/h",
        mph: "mph",
        ms: "m/s",
        second: "Second",
        minute: "Minute",
        hour: "Hour",
        joule: "Joule",
        calorie: "Calorie",
        pascal: "Pascal",
        bar: "Bar",
        byte: "Byte",
        kilobyte: "Kilobyte",
        megabyte: "Megabyte",
        gigabyte: "Gigabyte",
        terabyte: "Terabyte",
        filemgr_select_root: "Select Root Folder",
        filemgr_new_folder: "New Folder",
        filemgr_new_file: "New File",
        filemgr_back: "Back",
        filemgr_refresh: "Refresh",
        filemgr_sort_label: "Sort by:",
        filemgr_sort_az: "Name (A-Z)",
        filemgr_sort_za: "Name (Z-A)",
        filemgr_sort_size_desc: "Size (Large first)",
        filemgr_sort_size_asc: "Size (Small first)",
        filemgr_sort_type: "Type (Folders first)",
        filemgr_sort_extension: "File extension",
        filemgr_search_placeholder: "Deep search in entire root folder...",
        filemgr_search_status_ready: "Ready",
        filemgr_searching: "Searching",
        filemgr_results_for: "results for",
        filemgr_items_scanned: "items scanned",
        filemgr_no_results: "No results for",
        filemgr_path: "Path",
        filemgr_open_folder: "Open folder",
        filemgr_empty_folder: "This folder is empty",
        filemgr_folders: "Folders",
        filemgr_files: "Files",
        filemgr_total_size: "Total size",
        filemgr_permission_denied: "Write permission denied",
        filemgr_confirm_delete: "Are you sure you want to delete «{name}»?",
        filemgr_error_rename: "Rename error",
        filemgr_error_delete: "Delete error",
        filemgr_error_create_folder: "Create folder error",
        filemgr_error_create_file: "Create file error",
        filemgr_rename_prompt: "New name:",
        filemgr_new_folder_prompt: "New folder name:",
        filemgr_new_file_prompt: "New file name (with extension):",
        filemgr_select_root_first: "Please select a root folder first",
        filemgr_unsupported: "Your browser does not support File Manager. Use Chrome/Edge.",
        filemgr_loading: "Loading...",
        role_badge_admin: "Admin",
        role_badge_user: "User",
        quick_tools_title: "⚡ Quick Access",
        quick_tool_calculator: "🧮 Calculator",
        quick_tool_musicplayer: "🎵 Music",
        quick_tool_editor: "📝 Editor",
        admin_shortcut_text: "⚙️ Admin Panel",
        login_time_label: "🕒 Login:",
        logout_button: "🚪 Logout",
        default_email: "Email not registered",
        default_guest: "Guest"
    }
};

// ---- به‌روزرسانی UI بر اساس زبان ----
function updateUILanguage() {
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        var key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) el.innerText = translations[currentLang][key];
    }
    var userMenuItems = document.querySelectorAll('[data-i18n-user]');
    for (var i = 0; i < userMenuItems.length; i++) {
        var el = userMenuItems[i];
        var key = el.getAttribute('data-i18n-user');
        if (translations[currentLang][key]) {
            if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'DIV') {
                el.innerHTML = translations[currentLang][key];
            } else {
                el.innerText = translations[currentLang][key];
            }
        }
    }
    var roleBadge = document.getElementById('userRoleBadge');
    if (roleBadge) {
        var role = roleBadge.getAttribute('data-role-value');
        if (role === 'admin') {
            roleBadge.innerText = translations[currentLang].role_badge_admin;
        } else if (role === 'user') {
            roleBadge.innerText = translations[currentLang].role_badge_user;
        } else {
            roleBadge.innerText = translations[currentLang].role_badge_user;
        }
    }
    var loginTimeLabelSpan = document.getElementById('dropdownLoginTimeLabel');
    if (loginTimeLabelSpan) {
        loginTimeLabelSpan.innerText = translations[currentLang].login_time_label;
    }
    var logoutBtn = document.getElementById('dropdownLogoutBtn');
    if (logoutBtn) {
        logoutBtn.innerHTML = translations[currentLang].logout_button;
    }
    var adminLink = document.querySelector('#adminShortcutContainer a');
    if (adminLink) {
        adminLink.innerHTML = translations[currentLang].admin_shortcut_text;
    }
    var userEmailSpan = document.getElementById('dropdownUserEmail');
    if (userEmailSpan && (!userEmailSpan.innerText || userEmailSpan.innerText === '')) {
        userEmailSpan.innerText = translations[currentLang].default_email;
    }
    var userNameSpan = document.getElementById('dropdownUserName');
    if (userNameSpan && (!userNameSpan.innerText || userNameSpan.innerText === '')) {
        userNameSpan.innerText = translations[currentLang].default_guest;
    }
    updateBackButtonsLanguage();
}

function toEnglishDigits(str) {
    var persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    var englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return str.replace(/[۰-۹]/g, function(d) {
        return englishDigits[persianDigits.indexOf(d)];
    });
}

function updateServerInfo() {
    var serverInfoDiv = document.getElementById('serverInfo');
    if (!serverInfoDiv) {
        setTimeout(updateServerInfo, 500);
        return;
    }
    var now = new Date();
    var options = { year: 'numeric', month: '2-digit', day: '2-digit', calendar: 'persian' };
    var persianDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', options).format(now);
    persianDate = toEnglishDigits(persianDate);
    var hour = now.getHours().toString().padStart(2, '0');
    var minute = now.getMinutes().toString().padStart(2, '0');
    hour = toEnglishDigits(hour);
    minute = toEnglishDigits(minute);
    serverInfoDiv.innerHTML = '📅 ' + persianDate + ' | 🕒 ' + hour + ':' + minute;
    setTimeout(updateServerInfo, 60000);
}

function addBackToHomeButton(container) {
    if (container.querySelector('.back-to-home-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'back-to-home-btn';
    btn.innerHTML = translations[currentLang].back_to_home;
    btn.onclick = function() { if (typeof switchTool !== 'undefined') switchTool('home'); };
    container.prepend(btn);
}

function updateBackButtonsLanguage() {
    var btns = document.querySelectorAll('.back-to-home-btn');
    for (var i = 0; i < btns.length; i++) {
        btns[i].innerHTML = translations[currentLang].back_to_home;
    }
}

// ---- تابع اصلی تغییر زبان (با ذخیره در localStorage) ----
function setLanguage(lang) {
    if (lang !== 'fa' && lang !== 'en') lang = 'fa';
    currentLang = lang;
    setStoredLanguage(lang);
    updateUILanguage();
    updateServerInfo();
    if (typeof updateBackButtonsLanguage === 'function') updateBackButtonsLanguage();
    if (typeof updateChatbotLanguage === 'function') updateChatbotLanguage();
    if (typeof updateMusicPlayerLanguage === 'function') updateMusicPlayerLanguage();
    if (typeof updateMiniPlayerLanguage === 'function') updateMiniPlayerLanguage();
    if (typeof updateTextUnitLanguage === 'function') updateTextUnitLanguage();
    if (typeof updateEditorLanguage === 'function') updateEditorLanguage();
    if (typeof updateFileManagerLanguage === 'function') updateFileManagerLanguage();
    if (typeof window.updateAdminLanguage === 'function') window.updateAdminLanguage();

    var activeToolElem = document.querySelector('.tool-card-sidebar.active, .tool-item.active');
    if (activeToolElem) {
        var toolId = activeToolElem.getAttribute('data-tool');
        var toolNameElement = document.getElementById('currentToolName');
        if (toolNameElement) {
            var nameKey = '';
            switch (toolId) {
                case 'home':
                    nameKey = 'nav_home';
                    break;
                case 'calculator':
                    nameKey = 'nav_calculator';
                    break;
                case 'password':
                    nameKey = 'nav_password';
                    break;
                case 'videoplayer':
                    nameKey = 'nav_videoplayer';
                    break;
                case 'filemanager':
                    nameKey = 'nav_filemanager';
                    break;
                case 'colorpicker':
                    nameKey = 'nav_colorpicker';
                    break;
                case 'textunit':
                    nameKey = 'nav_textunit';
                    break;
                case 'smarteditor':
                    nameKey = 'nav_smarteditor';
                    break;
                case 'timer':
                    nameKey = 'nav_timer';
                    break;
                case 'musicplayer':
                    nameKey = 'nav_musicplayer';
                    break;
                default:
                    nameKey = 'nav_home';
            }
            toolNameElement.textContent = translations[currentLang][nameKey];
        }
    }

    if (typeof window.onlineMode !== 'undefined' && window.onlineMode && typeof replaceAllEmojis === 'function') {
        setTimeout(replaceAllEmojis, 200);
    }
}

// ---- اجرای اولیه ----
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        updateUILanguage();
        updateServerInfo();
    });
} else {
    updateUILanguage();
    updateServerInfo();
}