var chatbotIsOpen = false;
var chatbotTypingTimeout = null;
var chatbotPanel = null;
var chatbotBtn = null;

var toolKeys = ['calculator', 'password', 'videoplayer', 'filemanager', 'colorpicker', 'textunit', 'smarteditor', 'timer', 'musicplayer'];

var toolQA = {
    fa: {
        calculator: [
            { q: "چطور سینوس ۳۰ درجه را حساب کنم؟", a: "عدد 30 را وارد کنید، سپس دکمه sin را بزنید. نتیجه 0.5 است." },
            { q: "چطور یک عدد را به توان ۲ برسانم؟", a: "عدد را وارد کنید و دکمه x² را بزنید یا از ^2 استفاده کنید." },
            { q: "لگاریتم طبیعی (ln) چطور محاسبه می‌شود؟", a: "عدد را وارد، سپس ln را بزنید. مثال: ln(10) ≈ 2.3026" },
            { q: "چطور درصد بگیرم؟", a: "عدد را وارد و دکمه % را بزنید. مثال: 50% = 0.5" },
            { q: "دکمه Ans چه کاربردی دارد؟", a: "آخرین نتیجه محاسبات را درج می‌کند." }
        ],
        password: [
            { q: "چطور یک رمز قوی ۲۰ کاراکتری بسازم؟", a: "طول را ۲۰ کنید، همه گزینه‌ها را فعال کنید و روی تولید کلیک کنید." },
            { q: "رمز خوانا (pronounceable) چیست؟", a: "رمز خوانا از هجاهای قابل تلفظ ساخته می‌شود مثل kafo-tiza-lumo" },
            { q: "چطور قدرت رمز را ببینم؟", a: "نوار قدرت و آنتروپی (bits) را مشاهده کنید." },
            { q: "آیا رمز خودکار کپی می‌شود؟", a: "اگر گزینه کپی خودکار را فعال کنید، بله." }
        ],
        videoplayer: [
            { q: "چطور فیلم یوتیوب اضافه کنم؟", a: "لینک یوتیوب را در فیلد وارد و روی افزودن کلیک کنید." },
            { q: "چطور زیرنویس اضافه کنم؟", a: "لینک فایل زیرنویس با فرمت VTT را در فیلد زیرنویس وارد کنید." },
            { q: "کلیدهای میانبر چیست؟", a: "Space: پخش/توقف، فلش راست/چپ: ۱۵ ثانیه، F: تمام صفحه، M: تئاتر." },
            { q: "چطور سرعت پخش را عوض کنم؟", a: "از منوی سرعت (سرعت پخش) بالای پلیر انتخاب کنید." }
        ],
        filemanager: [
            { q: "چطور پوشه جدید بسازم؟", a: "ابتدا پوشه ریشه را انتخاب کنید، سپس دکمه پوشه جدید." },
            { q: "چطور فایل را حذف کنم؟", a: "روی سطل زباله کنار فایل کلیک کنید." },
            { q: "جستجوی عمیق چیست؟", a: "عبارت را وارد کنید، کل زیرپوشه‌ها جستجو می‌شود." },
            { q: "چطور نام فایل را تغییر دهم؟", a: "روی دکمه مداد (✏️) کلیک و نام جدید را وارد کنید." }
        ],
        colorpicker: [
            { q: "چطور کد HEX را کپی کنم؟", a: "رنگ را انتخاب کنید و روی کپی کنار HEX کلیک کنید." },
            { q: "چطور رنگ تصادفی تولید کنم؟", a: "دکمه تصادفی (🎲) را بزنید." },
            { q: "CMYK و HSV چه کاربردی دارند؟", a: "CMYK برای چاپ، HSV برای نرم‌افزارهای گرافیکی." },
            { q: "چطور پیش‌نمایش را تغییر دهم؟", a: "از دکمه‌های روشن/تاریک استفاده کنید." }
        ],
        textunit: [
            { q: "چطور تعداد کلمات را ببینم؟", a: "متن را در قسمت تحلیل متن وارد کنید، آمار نمایش داده می‌شود." },
            { q: "چطور واحد طول را تبدیل کنم؟", a: "در مبدل واحد، دسته طول را انتخاب کنید." },
            { q: "آیا مبدل داده (بایت به گیگابایت) دارد؟", a: "بله، در دسته ذخیره‌سازی داده." },
            { q: "چطور آمار متن را کپی کنم؟", a: "دکمه کپی آمار را بزنید." }
        ],
        smarteditor: [
            { q: "چطور متن را پررنگ کنم؟", a: "متن را انتخاب کنید و دکمه B را بزنید." },
            { q: "چطور فایل متنی باز کنم؟", a: "دکمه 📂 را بزنید و فایل TXT را انتخاب کنید." },
            { q: "چطور به PDF تبدیل کنم؟", a: "دکمه PDF را بزنید." },
            { q: "آیا خودکار ذخیره می‌کند؟", a: "بله، هر ۲ ثانیه یکبار." }
        ],
        timer: [
            { q: "چطور لاپ (دور) ثبت کنم؟", a: "در حین کرنومتر، دکمه ثبت لاپ را بزنید." },
            { q: "چطور تایمر معکوس تنظیم کنم؟", a: "ساعت، دقیقه و ثانیه را وارد و روی شروع کلیک کنید." },
            { q: "آیا تایمر اعلان صوتی دارد؟", a: "بله، پس از اتمام بوق می‌زند." },
            { q: "چطور تاریخچه را پاک کنم؟", a: "دکمه پاک کردن تاریخچه را بزنید." }
        ],
        musicplayer: [
            { q: "چطور آهنگ آفلاین اضافه کنم؟", a: "روی انتخاب فایل صوتی کلیک کنید و MP3 را انتخاب کنید." },
            { q: "چطور آهنگ آنلاین را به لیست پخش اضافه کنم؟", a: "روی قلب 🤍 کنار آهنگ کلیک کنید." },
            { q: "چطور یک آهنگ را تکرار کنم؟", a: "دکمه تکرار را بزنید تا حالت 🔂 فعال شود." },
            { q: "چطور مینی پلیر را ببندم؟", a: "روی X در مینی پلیر کلیک کنید." }
        ]
    },
    en: {
        calculator: [
            { q: "How to calculate sin 30°?", a: "Enter 30, then press sin. Result is 0.5." },
            { q: "How to square a number?", a: "Enter number and press x² or use ^2." },
            { q: "How to calculate natural log?", a: "Enter number, press ln. Example: ln(10)=2.3026" },
            { q: "How to calculate percentage?", a: "Enter number, press %. Example: 50%=0.5" },
            { q: "What is Ans button?", a: "Inserts last calculation result." }
        ],
        password: [
            { q: "How to generate 20-char strong password?", a: "Set length to 20, enable all options, click Generate." },
            { q: "What is pronounceable password?", a: "Password made of syllables like kafo-tiza-lumo." },
            { q: "How to check password strength?", a: "See strength bar and entropy bits." },
            { q: "Auto-copy password?", a: "Enable auto-copy option." }
        ],
        videoplayer: [
            { q: "How to add YouTube video?", a: "Paste YouTube URL and click Add." },
            { q: "How to add subtitles?", a: "Provide VTT file URL." },
            { q: "What are keyboard shortcuts?", a: "Space: play/pause, Arrows: ±15s, F: fullscreen, M: theater." },
            { q: "How to change playback speed?", a: "Use speed selector dropdown." }
        ],
        filemanager: [
            { q: "How to create new folder?", a: "Select root folder, click New Folder." },
            { q: "How to delete file?", a: "Click trash icon next to file." },
            { q: "What is deep search?", a: "Enter query, searches all subfolders." },
            { q: "How to rename file?", a: "Click pencil icon and enter new name." }
        ],
        colorpicker: [
            { q: "How to copy HEX code?", a: "Pick color, click copy next to HEX." },
            { q: "How to generate random color?", a: "Click random button (🎲)." },
            { q: "What are CMYK/HSV for?", a: "CMYK for print, HSV for graphics software." },
            { q: "How to change preview background?", a: "Use light/dark buttons." }
        ],
        textunit: [
            { q: "How to count words?", a: "Paste text in text analyzer." },
            { q: "How to convert length units?", a: "In converter, select length category." },
            { q: "Data storage converter (byte to GB)?", a: "Yes, under Data storage category." },
            { q: "How to copy text stats?", a: "Click Copy stats button." }
        ],
        smarteditor: [
            { q: "How to bold text?", a: "Select text, press B button." },
            { q: "How to open text file?", a: "Click 📂 button and choose TXT file." },
            { q: "How to convert to PDF?", a: "Click PDF button." },
            { q: "Auto-save?", a: "Yes, every 2 seconds." }
        ],
        timer: [
            { q: "How to record lap?", a: "While stopwatch running, click Record Lap." },
            { q: "How to set countdown?", a: "Enter hours, minutes, seconds, click Start." },
            { q: "Sound alert?", a: "Yes, beeps when time's up." },
            { q: "How to clear history?", a: "Click Clear history button." }
        ],
        musicplayer: [
            { q: "How to add offline song?", a: "Click Select audio file, choose MP3." },
            { q: "How to add online song to playlist?", a: "Click heart 🤍 next to song." },
            { q: "How to repeat one song?", a: "Click repeat until 🔂 appears." },
            { q: "How to close mini player?", a: "Click X on mini player." }
        ]
    }
};

function getToolButtonText(toolId) {
    return (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang]['nav_' + toolId]) ? translations[currentLang]['nav_' + toolId] : toolId;
}

function getAboutUsText() {
    if (currentLang === 'fa') {
        return "پروژه «مرکز مهندس | EngineerHub» یک داشبورد تحت وب با طراحی شیشه‌ای، دوزبانه و ابزارهای کاربردی است که توسط محمد شیروانی طراحی شده است.";
    } else {
        return "EngineerHub is a glassmorphism web dashboard with bilingual support and useful tools, designed by Mohammad Shiravani.";
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        return m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;';
    });
}

function addChatbotMessageWithTypewriter(text, sender, isBotTyping) {
    if (!chatbotPanel) return;
    var container = chatbotPanel.querySelector('#chatbotMessages');
    var msgDiv = document.createElement('div');
    msgDiv.className = 'message ' + sender;
    if (sender === 'bot' && isBotTyping === true) {
        var span = document.createElement('span');
        span.className = 'typewriter-text';
        span.style.display = 'inline-block';
        span.style.whiteSpace = 'nowrap';
        span.style.overflow = 'hidden';
        span.style.maxWidth = '100%';
        span.textContent = text;
        msgDiv.appendChild(span);
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
        var duration = Math.min(800, text.length * 30);
        setTimeout(function() {
            span.style.whiteSpace = 'normal';
            span.style.overflow = 'visible';
            span.classList.remove('typewriter-text');
            span.style.borderRight = 'none';
        }, duration);
    } else {
        msgDiv.textContent = text;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }
}

function addChatbotMessageHTML(html, sender) {
    if (!chatbotPanel) return;
    var container = chatbotPanel.querySelector('#chatbotMessages');
    var msgDiv = document.createElement('div');
    msgDiv.className = 'message ' + sender;
    msgDiv.innerHTML = html;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function addChatbotMessageSimple(text, sender) {
    addChatbotMessageWithTypewriter(text, sender, false);
}

function addChatbotMessageBot(text) {
    addChatbotMessageWithTypewriter(text, 'bot', true);
}

function clearChatbotMessages() {
    if (chatbotPanel) chatbotPanel.querySelector('#chatbotMessages').innerHTML = '';
}

function showTypingIndicator() {
    if (!chatbotPanel) return;
    var container = chatbotPanel.querySelector('#chatbotMessages');
    var typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.innerHTML = '<div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
    return typingDiv;
}

function removeTypingIndicator(typingDiv) {
    if (typingDiv && typingDiv.parentNode) typingDiv.remove();
}

function withTypingIndicator(callback) {
    if (!chatbotPanel) return;
    var statusDiv = chatbotPanel.querySelector('#chatbotStatus');
    if (statusDiv) statusDiv.innerHTML = '<span class="status-dot typing"></span> ' + (currentLang === 'fa' ? 'در حال نوشتن...' : 'Typing...');
    var typingMsg = showTypingIndicator();
    if (chatbotTypingTimeout) clearTimeout(chatbotTypingTimeout);
    chatbotTypingTimeout = setTimeout(function() {
        callback();
        removeTypingIndicator(typingMsg);
        if (statusDiv) statusDiv.innerHTML = '<span class="status-dot online"></span> ' + (currentLang === 'fa' ? 'آنلاین' : 'Online');
        chatbotTypingTimeout = null;
    }, 800);
}

function resetChatbotToMainMenu() {
    if (!chatbotPanel) return;
    chatbotPanel.classList.add('main-menu');
    clearChatbotMessages();
    var sugg = chatbotPanel.querySelector('#chatbotSuggestions');
    if (!sugg) return;
    var html = '';
    for (var i = 0; i < toolKeys.length; i++) {
        html += '<button class="suggestion-btn tool-btn" data-tool="' + toolKeys[i] + '">🛠️ ' + getToolButtonText(toolKeys[i]) + '</button>';
    }
    html += '<button class="suggestion-btn about-us-btn">📖 ' + (currentLang === 'fa' ? 'درباره ما' : 'About Us') + '</button>';
    sugg.innerHTML = html;

    var toolBtns = document.querySelectorAll('.tool-btn');
    for (var j = 0; j < toolBtns.length; j++) {
        toolBtns[j].addEventListener('click', function() {
            var toolId = this.getAttribute('data-tool');
            var toolName = getToolButtonText(toolId);
            addChatbotMessageSimple(this.textContent, 'user');
            withTypingIndicator(function() {
                addChatbotMessageBot(currentLang === 'fa' ? 'در مورد ابزار «' + toolName + '» چه سوالی دارید؟' : 'What would you like to know about "' + toolName + '"?');
                chatbotPanel.classList.remove('main-menu');
                var qaList = toolQA[currentLang][toolId] || toolQA['en'][toolId];
                var qaHtml = '';
                for (var k = 0; k < qaList.length; k++) {
                    qaHtml += '<button class="suggestion-btn qa-btn" data-q="' + escapeHtml(qaList[k].q) + '" data-a="' + escapeHtml(qaList[k].a) + '">❓ ' + qaList[k].q + '</button>';
                }
                qaHtml += '<button class="suggestion-btn back-to-main-btn">🔙 ' + (currentLang === 'fa' ? 'بازگشت به منوی اصلی' : 'Back to Main Menu') + '</button>';
                sugg.innerHTML = qaHtml;
                var qaBtns = document.querySelectorAll('.qa-btn');
                for (var m = 0; m < qaBtns.length; m++) {
                    qaBtns[m].addEventListener('click', function() {
                        var q = this.getAttribute('data-q');
                        var a = this.getAttribute('data-a');
                        addChatbotMessageSimple(q, 'user');
                        withTypingIndicator(function() { addChatbotMessageBot(a); });
                    });
                }
                var backBtn = document.querySelector('.back-to-main-btn');
                if (backBtn) backBtn.addEventListener('click', resetChatbotToMainMenu);
            });
        });
    }

    var aboutBtn = document.querySelector('.about-us-btn');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', function() {
            var btnText = this.textContent;
            addChatbotMessageSimple(btnText, 'user');
            withTypingIndicator(function() {
                addChatbotMessageBot(getAboutUsText());
                var emailHtml = '<div style="margin-top: 12px; text-align: center;"><button id="contactDeveloperBtn" class="suggestion-btn" style="background: linear-gradient(95deg, #f97316, #ea580c); border: none; padding: 8px 16px;">📧 ارتباط با توسعه‌دهنده</button></div>';
                addChatbotMessageHTML(emailHtml, 'bot');
                setTimeout(function() {
                    var contactBtn = document.getElementById('contactDeveloperBtn');
                    if (contactBtn) {
                        contactBtn.addEventListener('click', function() {
                            var email = 'imshiravani@gmail.com';
                            if (confirm(currentLang === 'fa' ? 'آیا می‌خواهید ایمیل «' + email + '» را کپی کنید؟' : 'Do you want to copy the email "' + email + '"?')) {
                                navigator.clipboard.writeText(email).then(function() {
                                    alert(currentLang === 'fa' ? '✅ ایمیل کپی شد' : '✅ Email copied');
                                }).catch(function() {
                                    alert(currentLang === 'fa' ? 'لطفاً ایمیل را دستی کپی کنید: ' + email : 'Please copy manually: ' + email);
                                });
                            }
                        });
                    }
                }, 50);
                chatbotPanel.classList.remove('main-menu');
                sugg.innerHTML = '<button class="suggestion-btn back-to-main-btn">🔙 ' + (currentLang === 'fa' ? 'بازگشت به منوی اصلی' : 'Back to Main Menu') + '</button>';
                var newBackBtn = document.querySelector('.back-to-main-btn');
                if (newBackBtn) newBackBtn.addEventListener('click', resetChatbotToMainMenu);
            });
        });
    }
}

function updateChatbotLanguage() {
    if (!chatbotPanel) return;
    var title = chatbotPanel.querySelector('.chatbot-title-status h4');
    if (title) title.innerHTML = currentLang === 'fa' ? 'چت بات مهندس' : 'EngineerChat';
    resetChatbotToMainMenu();
}

function addChatbotAnimationStyle() {
    if (document.getElementById('chatbot-animation-style')) return;
    var style = document.createElement('style');
    style.id = 'chatbot-animation-style';
    style.textContent = '.chatbot-icon-animation{animation:pulseThenBounce 2.2s infinite;} @keyframes pulseThenBounce{0%{transform:scale(1)}25%{transform:scale(1.12)}50%{transform:scale(1)}70%{transform:translateY(-5px)}85%{transform:translateY(2px)}100%{transform:translateY(0)}}';
    document.head.appendChild(style);
}

function initChatbot() {
    addChatbotAnimationStyle();
    var oldBtn = document.querySelector('.chatbot-button');
    var oldPanel = document.querySelector('.chatbot-panel');
    if (oldBtn) oldBtn.remove();
    if (oldPanel) oldPanel.remove();
    chatbotBtn = document.createElement('div');
    chatbotBtn.className = 'chatbot-button';
    chatbotBtn.innerHTML = '<span class="chatbot-icon-animation">🤖</span>';
    document.body.appendChild(chatbotBtn);
    chatbotPanel = document.createElement('div');
    chatbotPanel.className = 'chatbot-panel main-menu';
    var online = currentLang === 'fa' ? 'آنلاین' : 'Online';
    chatbotPanel.innerHTML = '<div class="chatbot-header"><div class="chatbot-avatar">🤖</div><div class="chatbot-title-status"><h4>' + (currentLang === 'fa' ? 'چت بات مهندس' : 'EngineerChat') + '</h4><div class="chatbot-status" id="chatbotStatus"><span class="status-dot online"></span> ' + online + '</div></div><button class="chatbot-close">✕</button></div><div class="chatbot-messages" id="chatbotMessages"></div><div class="chatbot-suggestions" id="chatbotSuggestions"></div>';
    document.body.appendChild(chatbotPanel);
    var closeBtn = chatbotPanel.querySelector('.chatbot-close');
    chatbotBtn.onclick = function() {
        chatbotIsOpen = !chatbotIsOpen;
        if (chatbotIsOpen) chatbotPanel.classList.add('open');
        else chatbotPanel.classList.remove('open');
    };
    closeBtn.onclick = function() {
        chatbotIsOpen = false;
        chatbotPanel.classList.remove('open');
    };
    resetChatbotToMainMenu();
}