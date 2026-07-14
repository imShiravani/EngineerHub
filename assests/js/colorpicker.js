function buildColorPicker() {
    const container = document.getElementById('widgetContainer');
    const backText = translations[currentLang].back_to_home;
    container.innerHTML = `
        <div class="colorpicker-container">
            <div style="display: flex; justify-content: flex-end; margin-bottom: 1rem;">
                <button class="back-to-home-btn" id="colorpickerBackBtn">${backText}</button>
            </div>
            <h2>${translations[currentLang].colorpicker_title}</h2>
            <div class="colorpicker-main">
                <div class="color-preview" id="colorPreview" style="background-color: #6366f1;"></div>
                <div class="color-controls">
                    <div class="color-input-row">
                        <input type="color" id="colorInput" value="#6366f1" class="color-input">
                        <button id="randomColorBtn" class="random-color-btn">${translations[currentLang].colorpicker_random_btn}</button>
                    </div>
                    <div class="color-values">
                        <div class="color-value-item">
                            <label>${translations[currentLang].colorpicker_hex_label}</label>
                            <div class="value-with-copy">
                                <input type="text" id="hexValue" readonly value="#6366f1">
                                <button class="copy-color-btn" data-code="hex">📋 ${translations[currentLang].colorpicker_copy_btn}</button>
                            </div>
                        </div>
                        <div class="color-value-item">
                            <label>${translations[currentLang].colorpicker_rgb_label}</label>
                            <div class="value-with-copy">
                                <input type="text" id="rgbValue" readonly value="rgb(99, 102, 241)">
                                <button class="copy-color-btn" data-code="rgb">📋 ${translations[currentLang].colorpicker_copy_btn}</button>
                            </div>
                        </div>
                        <div class="color-value-item">
                            <label>${translations[currentLang].colorpicker_hsl_label}</label>
                            <div class="value-with-copy">
                                <input type="text" id="hslValue" readonly value="hsl(239, 84%, 67%)">
                                <button class="copy-color-btn" data-code="hsl">📋 ${translations[currentLang].colorpicker_copy_btn}</button>
                            </div>
                        </div>
                        <div class="color-value-item">
                            <label>${translations[currentLang].colorpicker_cmyk_label}</label>
                            <div class="value-with-copy">
                                <input type="text" id="cmykValue" readonly value="cmyk(59%, 58%, 0%, 5%)">
                                <button class="copy-color-btn" data-code="cmyk">📋 ${translations[currentLang].colorpicker_copy_btn}</button>
                            </div>
                        </div>
                        <div class="color-value-item">
                            <label>${translations[currentLang].colorpicker_hsv_label}</label>
                            <div class="value-with-copy">
                                <input type="text" id="hsvValue" readonly value="hsv(239, 59%, 95%)">
                                <button class="copy-color-btn" data-code="hsv">📋 ${translations[currentLang].colorpicker_copy_btn}</button>
                            </div>
                        </div>
                    </div>
                    <div class="theme-toggle-row">
                        <button id="lightModeBtn" class="theme-toggle-btn">${translations[currentLang].colorpicker_light_mode}</button>
                        <button id="darkModeBtn" class="theme-toggle-btn">${translations[currentLang].colorpicker_dark_mode}</button>
                    </div>
                </div>
            </div>
            <div class="color-swatches">
                <div class="swatch" style="background-color: #ef4444;"></div>
                <div class="swatch" style="background-color: #f97316;"></div>
                <div class="swatch" style="background-color: #eab308;"></div>
                <div class="swatch" style="background-color: #22c55e;"></div>
                <div class="swatch" style="background-color: #10b981;"></div>
                <div class="swatch" style="background-color: #06b6d4;"></div>
                <div class="swatch" style="background-color: #3b82f6;"></div>
                <div class="swatch" style="background-color: #6366f1;"></div>
                <div class="swatch" style="background-color: #8b5cf6;"></div>
                <div class="swatch" style="background-color: #d946ef;"></div>
                <div class="swatch" style="background-color: #ec4899;"></div>
                <div class="swatch" style="background-color: #f43f5e;"></div>
            </div>
        </div>
    `;

    const backBtn = document.getElementById('colorpickerBackBtn');
    if (backBtn) {
        backBtn.onclick = () => switchTool('home');
    }

    const colorInput = document.getElementById('colorInput');
    const preview = document.getElementById('colorPreview');
    const hexInput = document.getElementById('hexValue');
    const rgbInput = document.getElementById('rgbValue');
    const hslInput = document.getElementById('hslValue');
    const cmykInput = document.getElementById('cmykValue');
    const hsvInput = document.getElementById('hsvValue');
    const randomBtn = document.getElementById('randomColorBtn');
    const lightModeBtn = document.getElementById('lightModeBtn');
    const darkModeBtn = document.getElementById('darkModeBtn');
    const copyBtns = document.querySelectorAll('.copy-color-btn');

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function rgbToCmyk(r, g, b) {
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        let k = Math.min(c, m, y);
        if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
        c = ((c - k) / (1 - k)) * 100;
        m = ((m - k) / (1 - k)) * 100;
        y = ((y - k) / (1 - k)) * 100;
        k = k * 100;
        return { c: Math.round(c), m: Math.round(m), y: Math.round(y), k: Math.round(k) };
    }

    function rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, v = max;
        const d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max === min) {
            h = 0;
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
    }

    function updateAll(hex) {
        if (!hex.startsWith('#')) hex = '#' + hex;
        preview.style.backgroundColor = hex;
        hexInput.value = hex.toUpperCase();
        const rgb = hexToRgb(hex);
        rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
        cmykInput.value = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        hsvInput.value = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
    }

    colorInput.addEventListener('input', (e) => updateAll(e.target.value));
    randomBtn.addEventListener('click', () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        colorInput.value = randomColor;
        updateAll(randomColor);
    });
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async() => {
            const type = btn.getAttribute('data-code');
            let textToCopy = '';
            if (type === 'hex') textToCopy = hexInput.value;
            else if (type === 'rgb') textToCopy = rgbInput.value;
            else if (type === 'hsl') textToCopy = hslInput.value;
            else if (type === 'cmyk') textToCopy = cmykInput.value;
            else if (type === 'hsv') textToCopy = hsvInput.value;
            try {
                await navigator.clipboard.writeText(textToCopy);
                const original = btn.innerHTML;
                btn.innerHTML = '✓ کپی شد';
                setTimeout(() => btn.innerHTML = original, 1000);
            } catch (err) {}
        });
    });
    const swatches = document.querySelectorAll('.swatch');
    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const bgColor = window.getComputedStyle(swatch).backgroundColor;
            const rgb = bgColor.match(/\d+/g);
            if (rgb) {
                const hex = '#' + ((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1);
                colorInput.value = hex;
                updateAll(hex);
            }
        });
    });
    lightModeBtn.addEventListener('click', () => {
        preview.style.backgroundColor = '#ffffff';
        preview.style.border = '2px solid #ccc';
    });
    darkModeBtn.addEventListener('click', () => {
        preview.style.backgroundColor = '#000000';
        preview.style.border = '2px solid #fff';
    });

    addBackToHomeButton(container);
}