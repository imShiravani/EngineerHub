// ========== متن‌یار و مبدل واحد – بدون کاتالوگ داخلی ==========
let currentTextUnitTab = 'analyzer';
let textAutoSaveTimer = null;

window.updateTextUnitLanguage = function() {
    const container = document.getElementById('widgetContainer');
    if (!container || !container.querySelector('.textunit-header')) return;
    const activeTabBtn = document.querySelector('.textunit-tabs .tab-btn.active');
    const currentActiveTab = activeTabBtn ? activeTabBtn.getAttribute('data-tab') : 'analyzer';
    currentTextUnitTab = currentActiveTab;
    buildTextUnit();
};

function buildTextUnit() {
    const container = document.getElementById('widgetContainer');
    const t = (key) => translations[currentLang][key] || key;

    container.innerHTML = `
        <div class="textunit-header">
            <h2>${t('textunit_title')}</h2>
            <div class="textunit-tabs">
                <button class="tab-btn ${currentTextUnitTab === 'analyzer' ? 'active' : ''}" data-tab="analyzer">${t('tab_text_analyzer')}</button>
                <button class="tab-btn ${currentTextUnitTab === 'converter' ? 'active' : ''}" data-tab="converter">${t('tab_unit_converter')}</button>
            </div>
        </div>
        <div class="textunit-content">
            <div id="analyzerPanel" class="tab-panel ${currentTextUnitTab === 'analyzer' ? 'active' : ''}">
                <textarea id="textInput" placeholder="${t('text_placeholder')}"></textarea>
                <div class="stats-grid" id="statsGrid">
                    <div class="stat-card"><span class="stat-label">${t('char_count')}</span><span class="stat-value" id="charCount">0</span></div>
                    <div class="stat-card"><span class="stat-label">${t('char_no_space')}</span><span class="stat-value" id="charNoSpace">0</span></div>
                    <div class="stat-card"><span class="stat-label">${t('word_count')}</span><span class="stat-value" id="wordCount">0</span></div>
                    <div class="stat-card"><span class="stat-label">${t('line_count')}</span><span class="stat-value" id="lineCount">0</span></div>
                    <div class="stat-card"><span class="stat-label">${t('reading_time')}</span><span class="stat-value" id="readingTime">0 ${t('seconds')}</span></div>
                    <div class="stat-card"><span class="stat-label">${t('sentence_count')}</span><span class="stat-value" id="sentenceCount">0</span></div>
                </div>
                <div class="text-actions">
                    <button id="clearTextBtn" class="action-btn">🗑️ ${t('clear_text')}</button>
                    <button id="copyStatsBtn" class="action-btn">📋 ${t('copy_stats')}</button>
                </div>
            </div>
            <div id="converterPanel" class="tab-panel ${currentTextUnitTab === 'converter' ? 'active' : ''}">
                <div class="converter-controls">
                    <div class="control-group">
                        <label>${t('unit_category')}</label>
                        <select id="categorySelect">
                            <option value="length">${t('length')}</option>
                            <option value="weight">${t('weight')}</option>
                            <option value="temperature">${t('temperature')}</option>
                            <option value="area">${t('area')}</option>
                            <option value="volume">${t('volume')}</option>
                            <option value="speed">${t('speed')}</option>
                            <option value="time">${t('time')}</option>
                            <option value="energy">${t('energy')}</option>
                            <option value="pressure">${t('pressure')}</option>
                            <option value="data">${t('data_storage')}</option>
                        </select>
                    </div>
                    <div class="converter-row">
                        <div class="control-group"><label>${t('unit_from')}</label><select id="fromUnit"></select></div>
                        <button id="swapUnitsBtn" class="swap-btn" title="${t('swap_units')}">🔄</button>
                        <div class="control-group"><label>${t('unit_to')}</label><select id="toUnit"></select></div>
                    </div>
                    <div class="converter-row">
                        <div class="control-group"><label>${t('unit_result')}</label><input type="number" id="inputValue" value="1" step="any"></div>
                        <div class="control-group"><label>&nbsp;</label><div class="result-display" id="resultValue">1</div></div>
                    </div>
                    <div class="converter-actions"><button id="copyResultBtn" class="action-btn">📋 ${t('copy_result')}</button></div>
                </div>
            </div>
        </div>
    `;

    // ========== تحلیل متن ==========
    const textarea = document.getElementById('textInput');
    const charCountSpan = document.getElementById('charCount');
    const charNoSpaceSpan = document.getElementById('charNoSpace');
    const wordCountSpan = document.getElementById('wordCount');
    const lineCountSpan = document.getElementById('lineCount');
    const readingTimeSpan = document.getElementById('readingTime');
    const sentenceCountSpan = document.getElementById('sentenceCount');
    const clearTextBtn = document.getElementById('clearTextBtn');
    const copyStatsBtn = document.getElementById('copyStatsBtn');

    // ---- بازیابی متن ذخیره شده ----
    const savedText = localStorage.getItem('textUnitAnalyzerText');
    if (savedText) textarea.value = savedText;

    // ---- تابع به‌روزرسانی آمار ----
    function updateTextStats() {
        let text = textarea.value;
        localStorage.setItem('textUnitAnalyzerText', text);
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, '').length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const lines = text === '' ? 0 : text.split(/\r\n|\r|\n/).length;
        const sentences = text.trim() === '' ? 0 : text.split(/[.!?؟]+/).filter(s => s.trim().length > 0).length;
        const readingTimeSec = Math.ceil(words / 3);
        let readingTimeText = '';
        if (readingTimeSec < 60) readingTimeText = `${readingTimeSec} ${t('seconds')}`;
        else readingTimeText = `${Math.ceil(readingTimeSec / 60)} ${t('min_read')}`;
        charCountSpan.innerText = chars;
        charNoSpaceSpan.innerText = charsNoSpace;
        wordCountSpan.innerText = words;
        lineCountSpan.innerText = lines;
        sentenceCountSpan.innerText = sentences;
        readingTimeSpan.innerText = readingTimeText;
        if (textAutoSaveTimer) clearTimeout(textAutoSaveTimer);
        textAutoSaveTimer = setTimeout(() => {
            localStorage.setItem('textUnitAnalyzerText', textarea.value);
        }, 500);
    }

    // ---- رویدادهای textarea ----
    textarea.addEventListener('input', updateTextStats);

    // ---- **رفع مشکل فاصله (Space) در textarea** ----
    textarea.addEventListener('keydown', function(e) {
        if (e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space') {
            // جلوگیری از propagation تا رویدادهای بالاتر (مثل videoplayer) Space را نگیرند
            e.stopPropagation();
            // اگر Space به صورت پیش‌فرض کار نمی‌کند، آن را به صورت دستی اضافه می‌کنیم
            // اما در حالت عادی، Space به صورت پیش‌فرض کار می‌کند و فقط stopPropagation کافی است
            // برای اطمینان بیشتر، اگر preventDefault باعث نشود که Space وارد نشود، آن را صدا نمی‌زنیم
            // فقط stopPropagation را اجرا می‌کنیم
        }
    }, true); // استفاده از phase capturing برای اطمینان از اجرا قبل از رویدادهای دیگر

    // ---- دکمه پاک کردن متن ----
    clearTextBtn.addEventListener('click', () => {
        if (confirm(currentLang === 'fa' ? 'متن پاک شود؟' : 'Clear text?')) {
            textarea.value = '';
            updateTextStats();
            localStorage.removeItem('textUnitAnalyzerText');
        }
    });

    // ---- دکمه کپی آمار ----
    copyStatsBtn.addEventListener('click', () => {
        let stats = `${t('char_count')}: ${charCountSpan.innerText}\n${t('char_no_space')}: ${charNoSpaceSpan.innerText}\n${t('word_count')}: ${wordCountSpan.innerText}\n${t('line_count')}: ${lineCountSpan.innerText}\n${t('sentence_count')}: ${sentenceCountSpan.innerText}\n${t('reading_time')}: ${readingTimeSpan.innerText}`;
        navigator.clipboard.writeText(stats).then(() => {
            const original = copyStatsBtn.innerHTML;
            copyStatsBtn.innerHTML = '✓ ' + t('copy_stats');
            setTimeout(() => copyStatsBtn.innerHTML = original, 1500);
        });
    });

    // ---- اجرای اولیه آمار ----
    updateTextStats();

    // ========== مبدل واحد ==========
    const categorySelect = document.getElementById('categorySelect');
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    const inputValue = document.getElementById('inputValue');
    const resultSpan = document.getElementById('resultValue');
    const swapBtn = document.getElementById('swapUnitsBtn');
    const copyResultBtn = document.getElementById('copyResultBtn');

    const units = {
        length: { base: 'meter', meter: 1, kilometer: 0.001, mile: 0.000621371, foot: 3.28084, inch: 39.3701 },
        weight: { base: 'gram', gram: 1, kilogram: 0.001, pound: 0.00220462, ounce: 0.035274 },
        temperature: { base: 'celsius', celsius: (v) => v, fahrenheit: (v) => (v * 9 / 5) + 32, kelvin: (v) => v + 273.15, fromBase: { celsius: (v) => v, fahrenheit: (v) => (v - 32) * 5 / 9, kelvin: (v) => v - 273.15 } },
        area: { base: 'square_meter', square_meter: 1, square_kilometer: 0.000001, hectare: 0.0001, acre: 0.000247105 },
        volume: { base: 'liter', liter: 1, milliliter: 1000, gallon: 0.264172 },
        speed: { base: 'kmh', kmh: 1, mph: 0.621371, ms: 0.277778 },
        time: { base: 'second', second: 1, minute: 1 / 60, hour: 1 / 3600 },
        energy: { base: 'joule', joule: 1, calorie: 0.239006 },
        pressure: { base: 'pascal', pascal: 1, bar: 0.00001 },
        data: { base: 'byte', byte: 1, kilobyte: 1 / 1024, megabyte: 1 / 1048576, gigabyte: 1 / 1073741824, terabyte: 1 / 1099511627776 }
    };

    const unitKeys = {
        length: ['meter', 'kilometer', 'mile', 'foot', 'inch'],
        weight: ['gram', 'kilogram', 'pound', 'ounce'],
        temperature: ['celsius', 'fahrenheit', 'kelvin'],
        area: ['square_meter', 'square_kilometer', 'hectare', 'acre'],
        volume: ['liter', 'milliliter', 'gallon'],
        speed: ['kmh', 'mph', 'ms'],
        time: ['second', 'minute', 'hour'],
        energy: ['joule', 'calorie'],
        pressure: ['pascal', 'bar'],
        data: ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte']
    };

    function getUnitName(unitKey) {
        return translations[currentLang][unitKey] || unitKey;
    }

    function populateUnits(category) {
        const keys = unitKeys[category];
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';
        for (let i = 0; i < keys.length; i++) {
            const unit = keys[i];
            const optionFrom = document.createElement('option');
            optionFrom.value = unit;
            optionFrom.textContent = getUnitName(unit);
            fromUnitSelect.appendChild(optionFrom);
            const optionTo = document.createElement('option');
            optionTo.value = unit;
            optionTo.textContent = getUnitName(unit);
            toUnitSelect.appendChild(optionTo);
        }
        if (category === 'temperature') {
            fromUnitSelect.value = 'celsius';
            toUnitSelect.value = 'fahrenheit';
        } else if (category === 'data') {
            fromUnitSelect.value = 'megabyte';
            toUnitSelect.value = 'gigabyte';
        } else {
            fromUnitSelect.value = keys[0];
            toUnitSelect.value = keys[1] || keys[0];
        }
        convert();
    }

    function convert() {
        const category = categorySelect.value;
        const from = fromUnitSelect.value;
        const to = toUnitSelect.value;
        let value = parseFloat(inputValue.value);
        if (isNaN(value)) value = 0;
        let result = 0;
        if (category === 'temperature') {
            const fromTemp = (v) => units.temperature.fromBase[from] ? units.temperature.fromBase[from](v) : v;
            const toTemp = units.temperature[to];
            let inBase = fromTemp(value);
            result = toTemp(inBase);
        } else {
            const factorFrom = units[category][from];
            const factorTo = units[category][to];
            result = (value / factorFrom) * factorTo;
        }
        resultSpan.innerText = result.toFixed(6);
    }

    categorySelect.addEventListener('change', () => populateUnits(categorySelect.value));
    fromUnitSelect.addEventListener('change', convert);
    toUnitSelect.addEventListener('change', convert);
    inputValue.addEventListener('input', convert);
    swapBtn.addEventListener('click', () => {
        const temp = fromUnitSelect.value;
        fromUnitSelect.value = toUnitSelect.value;
        toUnitSelect.value = temp;
        convert();
    });
    copyResultBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultSpan.innerText).then(() => {
            const original = copyResultBtn.innerHTML;
            copyResultBtn.innerHTML = '✓ ' + t('copy_result');
            setTimeout(() => copyResultBtn.innerHTML = original, 1500);
        });
    });
    populateUnits('length');

    // ========== فعال‌سازی تب‌ها ==========
    const tabBtns = document.querySelectorAll('.textunit-tabs .tab-btn');
    const analyzerPanel = document.getElementById('analyzerPanel');
    const converterPanel = document.getElementById('converterPanel');
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            tabBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            if (tab === 'analyzer') {
                analyzerPanel.classList.add('active');
                converterPanel.classList.remove('active');
                currentTextUnitTab = 'analyzer';
            } else {
                converterPanel.classList.add('active');
                analyzerPanel.classList.remove('active');
                currentTextUnitTab = 'converter';
            }
        });
    }

    addBackToHomeButton(container);
}