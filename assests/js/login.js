// ==================== login.js – صفحه ورود و ثبت‌نام (مستقل) ====================

// ---- توابع مدیریت زبان ----
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

var currentLang = getStoredLanguage();
var isSubmitting = false;
var typewriterTimer = null;
var typewriterState = {
    textIndex: 0,
    charIndex: 0,
    isDeleting: false,
    currentText: ''
};

var translationsLogin = {
    fa: {
        login_title: "ورود",
        register_title: "ثبت‌نام",
        email_placeholder: "ایمیل",
        password_placeholder: "رمز عبور",
        name_placeholder: "نام و نام خانوادگی",
        confirm_placeholder: "تکرار رمز عبور",
        remember_me: "مرا به خاطر بسپار",
        forgot_password: "رمز را فراموش کرده‌اید؟",
        login_btn: "🔑 ورود",
        register_btn: "📝 ثبت‌نام",
        login_success: "ورود موفق! در حال انتقال...",
        register_success: "ثبت‌نام موفق! در حال انتقال...",
        login_error: "ایمیل یا رمز عبور اشتباه است",
        register_error: "خطا در ثبت‌نام",
        email_invalid: "ایمیل نامعتبر است",
        password_short: "رمز عبور باید حداقل ۶ کاراکتر باشد",
        password_mismatch: "رمز عبور و تکرار آن مطابقت ندارد",
        fields_required: "تمامی فیلدها را پر کنید",
        server_error: "خطا در ارتباط با سرور"
    },
    en: {
        login_title: "Login",
        register_title: "Register",
        email_placeholder: "Email",
        password_placeholder: "Password",
        name_placeholder: "Full Name",
        confirm_placeholder: "Confirm Password",
        remember_me: "Remember me",
        forgot_password: "Forgot password?",
        login_btn: "🔑 Login",
        register_btn: "📝 Register",
        login_success: "Login successful! Redirecting...",
        register_success: "Registration successful! Redirecting...",
        login_error: "Invalid email or password",
        register_error: "Registration failed",
        email_invalid: "Invalid email address",
        password_short: "Password must be at least 6 characters",
        password_mismatch: "Passwords do not match",
        fields_required: "All fields are required",
        server_error: "Server connection error"
    }
};

function t(key) {
    return translationsLogin[currentLang] && translationsLogin[currentLang][key] ? translationsLogin[currentLang][key] : key;
}

function showMessage(element, message, isError) {
    if (!element) return;
    element.textContent = message;
    element.className = 'message ' + (isError ? 'error' : 'success');
    element.style.display = 'block';
    setTimeout(function() {
        element.style.display = 'none';
    }, 5000);
}

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function createParticles() {
    var container = document.getElementById('particles');
    if (!container) return;
    var particleCount = 80;
    for (var i = 0; i < particleCount; i++) {
        var particle = document.createElement('div');
        particle.classList.add('particle');
        var size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 10 + 8 + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        var type = Math.random();
        if (type < 0.7) particle.classList.add('circle');
        else if (type < 0.9) particle.classList.add('square');
        else particle.classList.add('triangle');
        container.appendChild(particle);
    }
}

function initTilt() {
    var card = document.getElementById('glassCard');
    if (!card) return;
    card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * 5;
        var rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });
    card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

function typewriterEffect() {
    var element = document.getElementById('typewriterText');
    if (!element) return;

    if (typewriterTimer) {
        clearTimeout(typewriterTimer);
        typewriterTimer = null;
    }

    typewriterState.textIndex = 0;
    typewriterState.charIndex = 0;
    typewriterState.isDeleting = false;
    typewriterState.currentText = '';

    var sentences = {
        fa: [
            "دروازه تو به دنیای مهندسی",
            "با مرکز مهندس، حرفه‌ای کار کن",
            "قدرت مهندسی در دستان تو",
            "از ایده تا اجرا، با ما",
            "هر چی یک مهندس نیاز داره، اینجاست"
        ],
        en: [
            "Your gateway to the world of engineering",
            "Work professionally with EngineerHub",
            "Engineering power in your hands",
            "From idea to execution, with us",
            "Everything an engineer needs, right here"
        ]
    };

    function type() {
        var lang = currentLang;
        var words = sentences[lang] || sentences.fa;
        var fullText = words[typewriterState.textIndex];

        if (!typewriterState.isDeleting && typewriterState.charIndex <= fullText.length) {
            typewriterState.currentText = fullText.substring(0, typewriterState.charIndex);
            typewriterState.charIndex++;
        }
        if (typewriterState.isDeleting && typewriterState.charIndex >= 0) {
            typewriterState.currentText = fullText.substring(0, typewriterState.charIndex);
            typewriterState.charIndex--;
        }

        element.innerHTML = typewriterState.currentText + '<span class="cursor">|</span>';

        if (!typewriterState.isDeleting && typewriterState.charIndex === fullText.length + 1) {
            typewriterState.isDeleting = true;
            typewriterTimer = setTimeout(type, 2000);
            return;
        }
        if (typewriterState.isDeleting && typewriterState.charIndex === 0) {
            typewriterState.isDeleting = false;
            typewriterState.textIndex = (typewriterState.textIndex + 1) % words.length;
            typewriterTimer = setTimeout(type, 500);
            return;
        }
        typewriterTimer = setTimeout(type, typewriterState.isDeleting ? 50 : 100);
    }
    type();
}

function setLoginLanguage(lang) {
    if (lang !== 'fa' && lang !== 'en') lang = 'fa';
    currentLang = lang;
    setStoredLanguage(lang);

    var circles = document.querySelectorAll('.lang-circle');
    for (var i = 0; i < circles.length; i++) {
        circles[i].classList.remove('active');
        if (circles[i].getAttribute('data-lang') === lang) {
            circles[i].classList.add('active');
        }
    }

    document.getElementById('logoTitle').innerText = (currentLang === 'fa') ? 'مرکز مهندس' : 'EngineerHub';
    document.getElementById('loginTabBtn').innerText = t('login_title');
    document.getElementById('registerTabBtn').innerText = t('register_title');
    document.getElementById('loginEmail').placeholder = t('email_placeholder');
    document.getElementById('loginPassword').placeholder = t('password_placeholder');
    document.getElementById('regName').placeholder = t('name_placeholder');
    document.getElementById('regEmail').placeholder = t('email_placeholder');
    document.getElementById('regPassword').placeholder = t('password_placeholder');
    document.getElementById('regConfirm').placeholder = t('confirm_placeholder');
    var rememberLabel = document.querySelector('.options .checkbox');
    if (rememberLabel) {
        rememberLabel.innerHTML = '<input type="checkbox" id="rememberMe"> ' + t('remember_me');
    }
    var forgotLink = document.getElementById('forgotLink');
    if (forgotLink) forgotLink.innerText = t('forgot_password');
    document.getElementById('loginBtn').innerHTML = t('login_btn');
    document.getElementById('registerBtn').innerHTML = t('register_btn');

    typewriterEffect();
}

function validateRegisterForm() {
    var name = document.getElementById('regName').value.trim();
    var email = document.getElementById('regEmail').value.trim();
    var password = document.getElementById('regPassword').value;
    var confirm = document.getElementById('regConfirm').value;
    var btn = document.getElementById('registerBtn');
    var isValid = true;
    if (!name || !email || !password || !confirm) isValid = false;
    if (!validateEmail(email)) isValid = false;
    if (password.length < 6) isValid = false;
    if (password !== confirm) isValid = false;
    btn.disabled = !isValid;
}

document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    initTilt();

    var savedLang = getStoredLanguage();
    setLoginLanguage(savedLang);

    var glassCard = document.getElementById('glassCard');
    var loginTab = document.getElementById('loginTabBtn');
    var registerTab = document.getElementById('registerTabBtn');
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    var tabSlider = document.getElementById('tabSlider');
    var loginBtn = document.getElementById('loginBtn');
    var registerBtn = document.getElementById('registerBtn');
    var loginEmail = document.getElementById('loginEmail');
    var loginPassword = document.getElementById('loginPassword');
    var regName = document.getElementById('regName');
    var regEmail = document.getElementById('regEmail');
    var regPassword = document.getElementById('regPassword');
    var regConfirm = document.getElementById('regConfirm');
    var loginMessage = document.getElementById('loginMessage');
    var registerMessage = document.getElementById('registerMessage');

    function switchTab(tab) {
        if (tab === 'login') {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            if (tabSlider) {
                var loginWidth = loginTab.offsetWidth;
                var loginLeft = loginTab.offsetLeft;
                tabSlider.style.width = loginWidth + 'px';
                tabSlider.style.left = loginLeft + 'px';
            }
        } else {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            if (tabSlider) {
                var registerWidth = registerTab.offsetWidth;
                var registerLeft = registerTab.offsetLeft;
                tabSlider.style.width = registerWidth + 'px';
                tabSlider.style.left = registerLeft + 'px';
            }
        }
    }

    loginTab.addEventListener('click', function() { switchTab('login'); });
    registerTab.addEventListener('click', function() { switchTab('register'); });

    setTimeout(function() {
        if (tabSlider) {
            var activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                tabSlider.style.width = activeTab.offsetWidth + 'px';
                tabSlider.style.left = activeTab.offsetLeft + 'px';
            }
        }
    }, 100);

    var toggleBtns = document.querySelectorAll('.toggle-password');
    for (var i = 0; i < toggleBtns.length; i++) {
        toggleBtns[i].addEventListener('click', function() {
            var targetId = this.getAttribute('data-target');
            var input = document.getElementById(targetId);
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    this.innerHTML = '🙈';
                } else {
                    input.type = 'password';
                    this.innerHTML = '👁️';
                }
            }
        });
    }

    regName.addEventListener('input', validateRegisterForm);
    regEmail.addEventListener('input', validateRegisterForm);
    regPassword.addEventListener('input', validateRegisterForm);
    regConfirm.addEventListener('input', validateRegisterForm);

    loginBtn.addEventListener('click', function() {
        if (isSubmitting) return;
        var email = loginEmail.value.trim();
        var password = loginPassword.value;
        var remember = document.getElementById('rememberMe') ? document.getElementById('rememberMe').checked : false;

        if (!email || !password) {
            showMessage(loginMessage, t('fields_required'), true);
            return;
        }

        isSubmitting = true;
        loginBtn.disabled = true;

        fetch('api_login.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password, remember: remember })
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success) {
                    showMessage(loginMessage, t('login_success'), false);
                    setTimeout(function() {
                        window.location.href = data.redirect_url || 'index.php';
                    }, 1000);
                } else {
                    showMessage(loginMessage, data.message || t('login_error'), true);
                    if (glassCard) glassCard.classList.add('shake-card');
                    setTimeout(function() { if (glassCard) glassCard.classList.remove('shake-card'); }, 500);
                    isSubmitting = false;
                    loginBtn.disabled = false;
                }
            })
            .catch(function(err) {
                console.error(err);
                showMessage(loginMessage, t('server_error'), true);
                isSubmitting = false;
                loginBtn.disabled = false;
            });
    });

    registerBtn.addEventListener('click', function() {
        if (isSubmitting) return;
        var fullname = regName.value.trim();
        var email = regEmail.value.trim();
        var password = regPassword.value;
        var confirm = regConfirm.value;

        if (!fullname || !email || !password || !confirm) {
            showMessage(registerMessage, t('fields_required'), true);
            return;
        }
        if (!validateEmail(email)) {
            showMessage(registerMessage, t('email_invalid'), true);
            return;
        }
        if (password.length < 6) {
            showMessage(registerMessage, t('password_short'), true);
            return;
        }
        if (password !== confirm) {
            showMessage(registerMessage, t('password_mismatch'), true);
            return;
        }

        isSubmitting = true;
        registerBtn.disabled = true;

        fetch('api_register.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname: fullname, email: email, password: password })
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.success) {
                    showMessage(registerMessage, t('register_success'), false);
                    window.location.replace(data.redirect);
                } else {
                    showMessage(registerMessage, data.message || t('register_error'), true);
                    if (glassCard) glassCard.classList.add('shake-card');
                    setTimeout(function() { if (glassCard) glassCard.classList.remove('shake-card'); }, 500);
                    isSubmitting = false;
                    registerBtn.disabled = false;
                }
            })
            .catch(function(err) {
                console.error(err);
                showMessage(registerMessage, t('server_error'), true);
                isSubmitting = false;
                registerBtn.disabled = false;
            });
    });

    var langCircles = document.querySelectorAll('.lang-circle');
    for (var j = 0; j < langCircles.length; j++) {
        langCircles[j].addEventListener('click', function() {
            var lang = this.getAttribute('data-lang');
            setLoginLanguage(lang);
        });
    }
});