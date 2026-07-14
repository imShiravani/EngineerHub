let passwordSettings = {
    length: 16,
    useUpper: true,
    useLower: true,
    useNumbers: true,
    useSymbols: true,
    autoCopy: false
};

function generateStrongPassword() {
    let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let lower = "abcdefghijklmnopqrstuvwxyz";
    let numbers = "0123456789";
    let symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let chars = "";
    let required = [];
    if (passwordSettings.useUpper) {
        chars += upper;
        required.push(upper[Math.floor(Math.random() * upper.length)]);
    }
    if (passwordSettings.useLower) {
        chars += lower;
        required.push(lower[Math.floor(Math.random() * lower.length)]);
    }
    if (passwordSettings.useNumbers) {
        chars += numbers;
        required.push(numbers[Math.floor(Math.random() * numbers.length)]);
    }
    if (passwordSettings.useSymbols) {
        chars += symbols;
        required.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }

    if (!chars.length) return "لطفاً حداقل یک دسته را انتخاب کنید";

    let pwd = "";
    for (let i = 0; i < passwordSettings.length; i++) {
        pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    for (let i = 0; i < required.length; i++) {
        pwd = pwd.substring(0, i) + required[i] + pwd.substring(i + 1);
    }
    pwd = pwd.split('').sort(() => Math.random() - 0.5).join('');
    return pwd;
}

function generatePronounceablePassword() {
    const vowels = ['a', 'e', 'i', 'o', 'u', 'ae', 'ea', 'ou', 'io'];
    const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'z', 'ch', 'sh', 'th', 'ph', 'wh', 'qu'];
    const separators = ['-', '.', '_'];
    let words = [];
    let syllables = 3;
    for (let w = 0; w < 3; w++) {
        let word = "";
        for (let i = 0; i < syllables; i++) {
            let c = consonants[Math.floor(Math.random() * consonants.length)];
            let v = vowels[Math.floor(Math.random() * vowels.length)];
            word += c + v;
        }
        words.push(word);
    }
    let separator = separators[Math.floor(Math.random() * separators.length)];
    let pronounceable = words.join(separator);
    if (pronounceable.length > passwordSettings.length) {
        pronounceable = pronounceable.substring(0, passwordSettings.length);
    }
    return pronounceable;
}

function calculateEntropy(password) {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
    if (charsetSize === 0) return 0;
    let entropyBits = Math.log2(Math.pow(charsetSize, password.length));
    return Math.floor(entropyBits);
}

function updateStrengthAndEntropy(password) {
    const len = password.length;
    let hasLower = /[a-z]/.test(password);
    let hasUpper = /[A-Z]/.test(password);
    let hasNumber = /[0-9]/.test(password);
    let hasSymbol = /[^a-zA-Z0-9]/.test(password);
    let allPresent = hasLower && hasUpper && hasNumber && hasSymbol;

    let entropy = calculateEntropy(password);
    let strengthText = "";
    let strengthClass = "";
    let crackingTime = "";

    if (len < 8) {
        strengthText = currentLang === 'fa' ? "خیلی ضعیف" : "Very Weak";
        strengthClass = "weak";
        crackingTime = currentLang === 'fa' ? "چند ثانیه" : "few seconds";
    } else if (len < 12) {
        strengthText = currentLang === 'fa' ? "ضعیف" : "Weak";
        strengthClass = "weak";
        crackingTime = currentLang === 'fa' ? "چند دقیقه" : "few minutes";
    } else if (!allPresent) {
        strengthText = currentLang === 'fa' ? "متوسط" : "Medium";
        strengthClass = "medium";
        crackingTime = currentLang === 'fa' ? "چند روز" : "several days";
    } else if (len < 16) {
        strengthText = currentLang === 'fa' ? "قوی" : "Strong";
        strengthClass = "strong";
        crackingTime = currentLang === 'fa' ? "چند سال" : "several years";
    } else if (len < 20) {
        strengthText = currentLang === 'fa' ? "بسیار قوی" : "Very Strong";
        strengthClass = "very-strong";
        crackingTime = currentLang === 'fa' ? "دهه‌ها" : "decades";
    } else if (len < 24) {
        strengthText = currentLang === 'fa' ? "عالی" : "Excellent";
        strengthClass = "excellent";
        crackingTime = currentLang === 'fa' ? "قرن‌ها" : "centuries";
    } else if (len < 32) {
        strengthText = currentLang === 'fa' ? "افسانه‌ای" : "Legendary";
        strengthClass = "legendary";
        crackingTime = currentLang === 'fa' ? "میلیون‌ها سال" : "millions of years";
    } else {
        strengthText = currentLang === 'fa' ? "مطلق" : "Ultimate";
        strengthClass = "ultimate";
        crackingTime = currentLang === 'fa' ? "غیرممکن" : "impossible";
    }

    const strengthSpan = document.getElementById('strengthText');
    const strengthDesc = document.getElementById('strengthDesc');
    const entropySpan = document.getElementById('entropyValue');
    if (strengthSpan) {
        strengthSpan.innerText = strengthText;
        strengthSpan.className = `value ${strengthClass}`;
    }
    if (strengthDesc) strengthDesc.innerText = `⏱️ ${crackingTime}`;
    if (entropySpan) entropySpan.innerText = `${entropy} bits`;

    const progressBar = document.getElementById('strengthProgress');
    if (progressBar) {
        let percent = Math.min(100, Math.floor((entropy / 128) * 100));
        progressBar.style.width = percent + '%';
        if (percent < 30) progressBar.style.background = '#ef4444';
        else if (percent < 60) progressBar.style.background = '#f59e0b';
        else if (percent < 80) progressBar.style.background = '#10b981';
        else progressBar.style.background = '#06b6d4';
    }
}

function updateGeneratedPassword() {
    let password = generateStrongPassword();
    document.getElementById('generatedPassword').innerText = password;
    updateStrengthAndEntropy(password);
    if (passwordSettings.autoCopy) copyPasswordToClipboard(password);
    saveSettings();
}

function updatePronounceablePassword() {
    let password = generatePronounceablePassword();
    document.getElementById('generatedPassword').innerText = password;
    updateStrengthAndEntropy(password);
    if (passwordSettings.autoCopy) copyPasswordToClipboard(password);
    saveSettings();
}

function copyPasswordToClipboard(password) {
    if (!password || password === "لطفاً حداقل یک دسته را انتخاب کنید") return;
    navigator.clipboard.writeText(password).then(() => {
        const copyBtn = document.getElementById('copyPasswordBtn');
        if (copyBtn) {
            const original = copyBtn.innerHTML;
            copyBtn.innerHTML = '✓ کپی شد';
            setTimeout(() => copyBtn.innerHTML = original, 1500);
        }
    }).catch(() => {
        alert(currentLang === 'fa' ? 'کپی ناموفق' : 'Copy failed');
    });
}

function saveSettings() {
    localStorage.setItem('passwordGenSettings', JSON.stringify(passwordSettings));
    localStorage.setItem('passwordGenLength', passwordSettings.length);
}

function loadSettings() {
    const saved = localStorage.getItem('passwordGenSettings');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            passwordSettings = {...passwordSettings, ...parsed };
        } catch (e) {}
    }
    const savedLen = localStorage.getItem('passwordGenLength');
    if (savedLen) passwordSettings.length = parseInt(savedLen);
    if (passwordSettings.length < 8) passwordSettings.length = 16;
    if (passwordSettings.length > 64) passwordSettings.length = 64;
    const slider = document.getElementById('lengthSlider');
    const lenSpan = document.getElementById('lengthValue');
    if (slider) slider.value = passwordSettings.length;
    if (lenSpan) lenSpan.innerText = passwordSettings.length;
    const useUpperChk = document.getElementById('useUpper');
    const useLowerChk = document.getElementById('useLower');
    const useNumbersChk = document.getElementById('useNumbers');
    const useSymbolsChk = document.getElementById('useSymbols');
    const autoCopyChk = document.getElementById('autoCopy');
    if (useUpperChk) useUpperChk.checked = passwordSettings.useUpper;
    if (useLowerChk) useLowerChk.checked = passwordSettings.useLower;
    if (useNumbersChk) useNumbersChk.checked = passwordSettings.useNumbers;
    if (useSymbolsChk) useSymbolsChk.checked = passwordSettings.useSymbols;
    if (autoCopyChk) autoCopyChk.checked = passwordSettings.autoCopy;
}

function attachEvents() {
    const slider = document.getElementById('lengthSlider');
    const lengthSpan = document.getElementById('lengthValue');
    const generateBtn = document.getElementById('generateNewBtn');
    const copyBtn = document.getElementById('copyPasswordBtn');
    const pronounceableBtn = document.getElementById('pronounceableBtn');
    const useUpper = document.getElementById('useUpper');
    const useLower = document.getElementById('useLower');
    const useNumbers = document.getElementById('useNumbers');
    const useSymbols = document.getElementById('useSymbols');
    const autoCopyChk = document.getElementById('autoCopy');

    if (slider) {
        slider.addEventListener('input', () => {
            let val = parseInt(slider.value);
            passwordSettings.length = val;
            if (lengthSpan) lengthSpan.innerText = val;
            updateGeneratedPassword();
            saveSettings();
        });
    }
    if (generateBtn) generateBtn.addEventListener('click', updateGeneratedPassword);
    if (copyBtn) copyBtn.addEventListener('click', () => {
        let pwd = document.getElementById('generatedPassword').innerText;
        copyPasswordToClipboard(pwd);
    });
    if (pronounceableBtn) pronounceableBtn.addEventListener('click', updatePronounceablePassword);

    const updateOptions = () => {
        passwordSettings.useUpper = useUpper ? useUpper.checked : true;
        passwordSettings.useLower = useLower ? useLower.checked : true;
        passwordSettings.useNumbers = useNumbers ? useNumbers.checked : true;
        passwordSettings.useSymbols = useSymbols ? useSymbols.checked : true;
        passwordSettings.autoCopy = autoCopyChk ? autoCopyChk.checked : false;
        updateGeneratedPassword();
        saveSettings();
    };
    if (useUpper) useUpper.addEventListener('change', updateOptions);
    if (useLower) useLower.addEventListener('change', updateOptions);
    if (useNumbers) useNumbers.addEventListener('change', updateOptions);
    if (useSymbols) useSymbols.addEventListener('change', updateOptions);
    if (autoCopyChk) autoCopyChk.addEventListener('change', updateOptions);
}

function buildPasswordGenerator() {
    const container = document.getElementById('widgetContainer');
    const backText = (currentLang === 'fa') ? '🏠 خانه' : '🏠 Home';
    container.innerHTML = `
        <div class="password-modern">
            <div class="password-generator">
                <button id="passwordBackBtn" class="back-to-home-btn password-back-btn">${backText}</button>
                <div class="password-header">
                    <h2>${translations[currentLang].pwd_title}</h2>
                    <p>${currentLang === 'fa' ? 'رمزهای امن با آنالیز قدرت و آنتروپی' : 'Secure passwords with strength and entropy analysis'}</p>
                </div>
                <div class="password-display">
                    <div class="password-actions">
                        <button class="generate-btn" id="generateNewBtn">🔄 ${translations[currentLang].generate_btn}</button>
                        <button class="copy-btn" id="copyPasswordBtn">📋 ${translations[currentLang].copy_btn}</button>
                        <button class="pronounceable-btn" id="pronounceableBtn">📖 ${currentLang === 'fa' ? 'رمز خوانا' : 'Readable'}</button>
                    </div>
                    <div class="password-box">
                        <pre id="generatedPassword">************</pre>
                    </div>
                </div>
                <div class="length-control">
                    <label>${translations[currentLang].length_label} <span class="length-value" id="lengthValue">${passwordSettings.length}</span></label>
                    <input type="range" id="lengthSlider" min="8" max="64" value="${passwordSettings.length}" step="1">
                </div>
                <div class="options-group">
                    <label><input type="checkbox" id="useUpper" checked> ${currentLang === 'fa' ? 'حروف بزرگ (A-Z)' : 'Uppercase (A-Z)'}</label>
                    <label><input type="checkbox" id="useLower" checked> ${currentLang === 'fa' ? 'حروف کوچک (a-z)' : 'Lowercase (a-z)'}</label>
                    <label><input type="checkbox" id="useNumbers" checked> ${currentLang === 'fa' ? 'اعداد (0-9)' : 'Numbers (0-9)'}</label>
                    <label><input type="checkbox" id="useSymbols" checked> ${currentLang === 'fa' ? 'نمادها (!@#$%)' : 'Symbols (!@#$%)'}</label>
                    <label><input type="checkbox" id="autoCopy"> ${currentLang === 'fa' ? 'کپی خودکار پس از تولید' : 'Auto-copy after generation'}</label>
                </div>
                <div class="strength-area">
                    <div class="strength-bar-container">
                        <div class="strength-bar" id="strengthProgress"></div>
                    </div>
                    <div class="strength">
                        <span class="label">${translations[currentLang].strength_label}</span>
                        <div class="value" id="strengthText"></div>
                        <div class="desc" id="strengthDesc"></div>
                    </div>
                    <div class="entropy">
                        <span class="label">${currentLang === 'fa' ? 'آنتروپی (قدرت رمز)' : 'Entropy (strength)'}</span>
                        <div class="value" id="entropyValue">0 bits</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    loadSettings();
    attachEvents();
    updateGeneratedPassword();

    const backBtn = document.getElementById('passwordBackBtn');
    if (backBtn) backBtn.onclick = () => switchTool('home');
}