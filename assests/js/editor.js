// ==================== ویرایشگر حرفه‌ای متن – بدون کاتالوگ داخلی ====================
var autoSaveTimer = null;
var editorUndoStack = [];
var editorRedoStack = [];
var editorDivGlobal = null;
var currentLangEditor = 'fa';

function pushToUndo(content) {
    editorUndoStack.push(content);
    while (editorUndoStack.length > 5) editorUndoStack.shift();
    editorRedoStack = [];
}

function saveState(editorDiv) {
    var html = editorDiv.innerHTML;
    pushToUndo(html);
    updateStats(editorDiv);
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(function() {
        localStorage.setItem('smartEditorContent', editorDiv.innerHTML);
    }, 2000);
}

function updateStats(editorDiv) {
    var statsChars = document.getElementById('stat-chars');
    var statsCharsNoSpace = document.getElementById('stat-chars-nospace');
    var statsWords = document.getElementById('stat-words');
    var statsLines = document.getElementById('stat-lines');
    var warningDiv = document.getElementById('editor-warning');
    if (!statsChars) return;
    var text = editorDiv.innerText || '';
    var chars = text.length;
    var charsNoSpace = text.replace(/\s/g, '').length;
    var words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    var lines = text === '' ? 0 : text.split(/\r\n|\r|\n/).length;
    statsChars.innerText = chars;
    statsCharsNoSpace.innerText = charsNoSpace;
    statsWords.innerText = words;
    statsLines.innerText = lines;
    if (warningDiv) {
        if (chars > 95000) {
            warningDiv.style.display = 'block';
            warningDiv.innerHTML = currentLangEditor === 'fa' ? '⚠️ به حد مجاز ۱۰۰۰۰۰ کاراکتر نزدیک می‌شوید!' : '⚠️ Approaching 100000 character limit!';
            warningDiv.style.color = '#f97316';
        } else if (chars >= 100000) {
            warningDiv.style.display = 'block';
            warningDiv.innerHTML = currentLangEditor === 'fa' ? '❌ حد مجاز کاراکتر پر شده!' : '❌ Character limit reached!';
            warningDiv.style.color = '#ef4444';
            if (chars > 100000) {
                editorDiv.innerText = text.substring(0, 100000);
                updateStats(editorDiv);
            }
        } else {
            warningDiv.style.display = 'none';
        }
    }
}

function getCurrentFontSize(editorDiv) {
    var sel = window.getSelection();
    if (!sel.rangeCount) return 16;
    var node = sel.getRangeAt(0).startContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    var fontSize = window.getComputedStyle(node).fontSize;
    return parseInt(fontSize);
}

function setFontSizeOnSelection(size, editorDiv) {
    if (!size || size < 8) size = 8;
    if (size > 72) size = 72;
    var sel = window.getSelection();
    var savedRange = null;
    if (sel.rangeCount) savedRange = sel.getRangeAt(0).cloneRange();
    document.execCommand('fontSize', false, '7');
    var fontElements = editorDiv.querySelectorAll('font[size="7"]');
    for (var i = 0; i < fontElements.length; i++) {
        var el = fontElements[i];
        el.removeAttribute('size');
        el.style.fontSize = size + 'px';
    }
    if (savedRange) {
        sel.removeAllRanges();
        sel.addRange(savedRange);
    }
    saveState(editorDiv);
    updateStats(editorDiv);
    updateFontSizeDisplay(editorDiv);
}

function execWithSelection(command, value, editorDiv) {
    editorDiv.focus();
    document.execCommand(command, false, value);
    saveState(editorDiv);
    updateStats(editorDiv);
    updateFontSizeDisplay(editorDiv);
}

function updateFontSizeDisplay(editorDiv) {
    var size = getCurrentFontSize(editorDiv);
    var fontSizeManual = document.getElementById('fontsize-manual');
    var statusFontSize = document.getElementById('status-font-size');
    if (fontSizeManual) fontSizeManual.value = size;
    if (statusFontSize) statusFontSize.innerText = (currentLangEditor === 'fa' ? 'سایز' : 'Size') + ': ' + size + 'px';
}

function updateEditorLanguage() {
    if (!editorDivGlobal) return;
    currentLangEditor = (typeof currentLang !== 'undefined') ? currentLang : 'fa';
    var lang = currentLangEditor;
    var t = function(key) {
        return translations[lang] && translations[lang][key] ? translations[lang][key] : key;
    };
    var homeBtn = document.getElementById('back-to-home-editor');
    if (homeBtn) homeBtn.innerHTML = lang === 'fa' ? '🏠 خانه' : '🏠 Home';
    var redoBtn = document.getElementById('editor-redo');
    if (redoBtn) redoBtn.innerHTML = lang === 'fa' ? '↪️ ازنو' : '↪️ Redo';
    var undoBtn = document.getElementById('editor-undo');
    if (undoBtn) undoBtn.innerHTML = lang === 'fa' ? '↩️ واگرد' : '↩️ Undo';
    var uploadBtn = document.getElementById('editor-upload');
    if (uploadBtn) uploadBtn.innerHTML = lang === 'fa' ? '📂 باز کردن' : '📂 Open';
    var saveBtn = document.getElementById('save-dropdown-btn');
    if (saveBtn) saveBtn.innerHTML = lang === 'fa' ? '💾 ذخیره' : '💾 Save';
    var boldBtn = document.getElementById('editor-bold');
    if (boldBtn) boldBtn.innerHTML = '<b>B</b> <span>' + (lang === 'fa' ? 'پررنگ' : 'Bold') + '</span>';
    var italicBtn = document.getElementById('editor-italic');
    if (italicBtn) italicBtn.innerHTML = '<i>I</i> <span>' + (lang === 'fa' ? 'کج' : 'Italic') + '</span>';
    var underlineBtn = document.getElementById('editor-underline');
    if (underlineBtn) underlineBtn.innerHTML = '<u>U</u> <span>' + (lang === 'fa' ? 'زیرخط' : 'Underline') + '</span>';
    var headingBtn = document.getElementById('editor-heading');
    if (headingBtn) headingBtn.innerHTML = 'H3 <span>' + (lang === 'fa' ? 'عنوان' : 'Heading') + '</span>';
    var alignLeft = document.getElementById('editor-align-left');
    if (alignLeft) alignLeft.innerHTML = '⬅️ <span>' + (lang === 'fa' ? 'چپ‌چین' : 'Left') + '</span>';
    var alignCenter = document.getElementById('editor-align-center');
    if (alignCenter) alignCenter.innerHTML = '↔️ <span>' + (lang === 'fa' ? 'وسط‌چین' : 'Center') + '</span>';
    var alignRight = document.getElementById('editor-align-right');
    if (alignRight) alignRight.innerHTML = '➡️ <span>' + (lang === 'fa' ? 'راست‌چین' : 'Right') + '</span>';
    var copyBtn = document.getElementById('editor-copy');
    if (copyBtn) copyBtn.innerHTML = '📋 ' + (lang === 'fa' ? 'کپی' : 'Copy');
    var clearBtn = document.getElementById('editor-clear');
    if (clearBtn) clearBtn.innerHTML = '🗑️ ' + (lang === 'fa' ? 'پاک' : 'Clear');
    var tableBtn = document.getElementById('editor-table');
    if (tableBtn) tableBtn.innerHTML = '📊 ' + (lang === 'fa' ? 'جدول' : 'Table');
    updateFontSizeDisplay(editorDivGlobal);
    var statusBold = document.getElementById('status-bold');
    if (statusBold) statusBold.innerText = (lang === 'fa' ? 'پررنگ' : 'Bold') + ': ' + (document.queryCommandState('bold') ? (lang === 'fa' ? 'فعال' : 'On') : (lang === 'fa' ? 'خیر' : 'Off'));
    var statusItalic = document.getElementById('status-italic');
    if (statusItalic) statusItalic.innerText = (lang === 'fa' ? 'کج' : 'Italic') + ': ' + (document.queryCommandState('italic') ? (lang === 'fa' ? 'فعال' : 'On') : (lang === 'fa' ? 'خیر' : 'Off'));
    var statusUnderline = document.getElementById('status-underline');
    if (statusUnderline) statusUnderline.innerText = (lang === 'fa' ? 'زیرخط' : 'Underline') + ': ' + (document.queryCommandState('underline') ? (lang === 'fa' ? 'فعال' : 'On') : (lang === 'fa' ? 'خیر' : 'Off'));
    var statusAlign = document.getElementById('status-align');
    if (statusAlign) {
        var align = document.queryCommandValue('justify');
        var alignText = lang === 'fa' ? (align === 'center' ? 'وسط' : (align === 'left' ? 'چپ' : 'راست')) : (align === 'center' ? 'Center' : (align === 'left' ? 'Left' : 'Right'));
        statusAlign.innerText = (lang === 'fa' ? 'چینش' : 'Align') + ': ' + alignText;
    }
    var statLabels = document.querySelectorAll('.editor-stats .stat-item span:first-child');
    if (statLabels.length >= 4) {
        statLabels[0].innerText = (lang === 'fa' ? 'کاراکتر:' : 'Characters:');
        statLabels[1].innerText = (lang === 'fa' ? 'بدون فاصله:' : 'No spaces:');
        statLabels[2].innerText = (lang === 'fa' ? 'کلمات:' : 'Words:');
        statLabels[3].innerText = (lang === 'fa' ? 'خطوط:' : 'Lines:');
    }
}

function buildSmartEditor() {
    var container = document.getElementById('widgetContainer');
    container.innerHTML = `
        <div class="smart-editor-container">
            <div class="editor-header">
                <h2>${currentLang === 'fa' ? 'ویرایشگر حرفه‌ای متن' : 'Pro Text Editor'}</h2>
                <div class="header-buttons">
                    <button id="editor-redo" class="header-btn" title="ازنو">↪️ ازنو</button>
                    <button id="editor-undo" class="header-btn" title="واگرد">↩️ واگرد</button>
                    <button id="editor-upload" class="header-btn" title="باز کردن فایل (TXT/DOCX)">📂 باز کردن</button>
                    <div class="dropdown-save">
                        <button id="save-dropdown-btn" class="header-btn" title="ذخیره به صورت...">💾 ذخیره</button>
                        <div class="save-menu">
                            <button id="save-pdf">📄 PDF</button>
                            <button id="save-doc">📝 DOC (Word)</button>
                            <button id="save-html">💾 HTML</button>
                        </div>
                    </div>
                    <button id="back-to-home-editor" class="header-btn" title="بازگشت به خانه">🏠 خانه</button>
                </div>
            </div>
            <div class="editor-tabs-bar">
                <button class="editor-tab-btn active" data-tab="format">📝 قالب</button>
                <button class="editor-tab-btn" data-tab="layout">📐 چیدمان</button>
                <button class="editor-tab-btn" data-tab="insert">➕ درج</button>
            </div>
            <div class="editor-tab-panel active" id="tab-format">
                <div class="toolbar-row">
                    <div class="tool-group"><div class="group-title">قالب بندی</div><div class="group-buttons"><button id="editor-bold" class="tool-btn"><b>B</b> <span>پررنگ</span></button><button id="editor-italic" class="tool-btn"><i>I</i> <span>کج</span></button><button id="editor-underline" class="tool-btn"><u>U</u> <span>زیرخط</span></button><button id="editor-heading" class="tool-btn">H3 <span>عنوان</span></button></div></div>
                    <div class="tool-group"><div class="group-title">سایز فونت</div><div class="group-buttons"><div class="fontsize-control"><input type="number" id="fontsize-manual" min="8" max="72" step="1" value="16"><button id="fontsize-minus" class="tool-btn">-</button><button id="fontsize-plus" class="tool-btn">+</button></div></div></div>
                    <div class="tool-group"><div class="group-title">عملیات</div><div class="group-buttons"><button id="editor-copy" class="tool-btn">📋 کپی</button><button id="editor-clear" class="tool-btn clear-btn">🗑️ پاک</button></div></div>
                </div>
            </div>
            <div class="editor-tab-panel" id="tab-layout">
                <div class="toolbar-row">
                    <div class="tool-group"><div class="group-title">تراز</div><div class="group-buttons"><button id="editor-align-right" class="tool-btn">➡️ راست‌چین</button><button id="editor-align-center" class="tool-btn">↔️ وسط‌چین</button><button id="editor-align-left" class="tool-btn">⬅️ چپ‌چین</button></div></div>
                    <div class="tool-group"><div class="group-title">جهت</div><div class="group-buttons"><button id="editor-rtl" class="tool-btn">🔤 RTL</button><button id="editor-ltr" class="tool-btn">🔤 LTR</button></div></div>
                </div>
            </div>
            <div class="editor-tab-panel" id="tab-insert">
                <div class="toolbar-row">
                    <div class="tool-group"><div class="group-title">جدول</div><div class="group-buttons"><div style="position: relative;"><button id="editor-table" class="tool-btn">📊 جدول</button><div class="table-panel" id="tablePanel"><div class="table-input-group"><label>سطرها:</label><input type="number" id="tableRows" min="1" max="10" value="3"></div><div class="table-input-group"><label>ستون‌ها:</label><input type="number" id="tableCols" min="1" max="10" value="3"></div><button id="createTableBtn" class="create-table-btn">ایجاد جدول</button></div></div><button id="delete-table-row" class="tool-btn">❌ حذف سطر جاری</button><button id="delete-table-col" class="tool-btn">❌ حذف ستون جاری</button></div></div>
                </div>
            </div>
            <div id="editor-content" class="editor-content" contenteditable="true"></div>
            <div class="editor-stats"><div class="stat-item"><span>کاراکتر:</span> <span id="stat-chars">0</span> / 100000</div><div class="stat-item"><span>بدون فاصله:</span> <span id="stat-chars-nospace">0</span></div><div class="stat-item"><span>کلمات:</span> <span id="stat-words">0</span></div><div class="stat-item"><span>خطوط:</span> <span id="stat-lines">0</span></div></div>
            <div id="editor-statusbar" class="editor-statusbar"><span id="status-font-size">سایز: 16px</span><span id="status-bold">پررنگ: خیر</span><span id="status-italic">کج: خیر</span><span id="status-underline">زیرخط: خیر</span><span id="status-align">چینش: راست</span><span id="status-color">رنگ: سفید</span></div>
            <div id="editor-warning" class="editor-warning" style="display:none;"></div>
        </div>
    `;

    var styleTag = document.createElement('style');
    styleTag.textContent = `
        .editor-tabs-bar { display: flex; background: #0f172a; border-radius: 12px; overflow: hidden; margin-bottom: 1rem; border: 1px solid #334155; }
        .editor-tab-btn { flex: 1; background: transparent; border: none; padding: 0.6rem 0; font-size: 0.85rem; font-weight: 500; color: #cbd5e6; cursor: pointer; transition: all 0.2s; text-align: center; }
        .editor-tab-btn.active { background: #00e5e5; color: #0f172a; }
        .editor-tab-panel { display: none; background: rgba(0, 0, 0, 0.3); border-radius: 1rem; padding: 0.8rem; margin-bottom: 1rem; }
        .editor-tab-panel.active { display: block; }
        .toolbar-row { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; justify-content: flex-start; }
        .tool-group { background: rgba(0, 0, 0, 0.25); border-radius: 0.8rem; padding: 0.4rem 0.8rem; min-width: 120px; }
        .group-title { font-size: 0.7rem; color: #00e5e5; margin-bottom: 0.3rem; border-bottom: 1px solid rgba(0,229,229,0.3); display: inline-block; padding-bottom: 2px; }
        .group-buttons { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.3rem; }
        .tool-btn { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(0, 229, 229, 0.3); border-radius: 2rem; padding: 0.3rem 0.8rem; font-size: 0.75rem; color: #e2e8f0; cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; gap: 4px; }
        .tool-btn:hover { background: rgba(0, 229, 229, 0.2); transform: translateY(-1px); }
        .fontsize-control { display: inline-flex; align-items: center; gap: 6px; background: #0f111c; padding: 0.2rem 0.6rem; border-radius: 2rem; }
        .fontsize-control input { width: 55px; background: transparent; border: 1px solid #00e5e5; border-radius: 2rem; padding: 0.2rem 0.4rem; color: #00e5e5; text-align: center; }
        .table-panel { position: absolute; top: 36px; left: 0; background: #1e293b; border-radius: 1rem; padding: 0.5rem; display: none; flex-direction: column; gap: 0.5rem; border: 1px solid #00e5e5; z-index: 100; }
        .table-panel.show { display: flex; }
        .table-input-group { display: flex; gap: 0.5rem; align-items: center; }
        .table-input-group input { width: 60px; background: #0f111c; border: 1px solid #00e5e5; border-radius: 2rem; padding: 0.2rem; color: white; text-align: center; }
        .create-table-btn { background: #00e5e5; border: none; border-radius: 2rem; padding: 0.2rem; cursor: pointer; }
        .editor-stats { display: flex; gap: 1rem; margin-top: 1rem; background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 1rem; font-size: 0.7rem; }
        .editor-statusbar { display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.65rem; color: #94a3b8; }
        .clear-btn:hover { background: rgba(239,68,68,0.3); border-color: #ef4444; }
    `;
    document.head.appendChild(styleTag);

    var editorDiv = document.getElementById('editor-content');
    editorDivGlobal = editorDiv;
    var fontSizeManual = document.getElementById('fontsize-manual');

    var savedContent = localStorage.getItem('smartEditorContent');
    if (savedContent) {
        editorDiv.innerHTML = savedContent;
        pushToUndo(savedContent);
    } else {
        editorDiv.innerHTML = '';
        pushToUndo('');
    }
    updateStats(editorDiv);
    updateFontSizeDisplay(editorDiv);

    editorDiv.addEventListener('input', function() {
        saveState(editorDiv);
        updateStats(editorDiv);
        updateFontSizeDisplay(editorDiv);
        localStorage.setItem('smartEditorContent', editorDiv.innerHTML);
    });

    fontSizeManual.addEventListener('change', function() {
        var newSize = parseInt(fontSizeManual.value);
        if (isNaN(newSize)) newSize = 16;
        newSize = Math.min(72, Math.max(8, newSize));
        setFontSizeOnSelection(newSize, editorDiv);
    });
    document.getElementById('fontsize-plus').addEventListener('click', function() {
        var current = getCurrentFontSize(editorDiv);
        var newSize = Math.min(72, current + 2);
        setFontSizeOnSelection(newSize, editorDiv);
    });
    document.getElementById('fontsize-minus').addEventListener('click', function() {
        var current = getCurrentFontSize(editorDiv);
        var newSize = Math.max(8, current - 2);
        setFontSizeOnSelection(newSize, editorDiv);
    });

    document.getElementById('editor-bold').addEventListener('click', function() { execWithSelection('bold', null, editorDiv); });
    document.getElementById('editor-italic').addEventListener('click', function() { execWithSelection('italic', null, editorDiv); });
    document.getElementById('editor-underline').addEventListener('click', function() { execWithSelection('underline', null, editorDiv); });
    document.getElementById('editor-heading').addEventListener('click', function() { execWithSelection('formatBlock', '<h3>', editorDiv); });
    document.getElementById('editor-align-right').addEventListener('click', function() { execWithSelection('justifyRight', null, editorDiv); });
    document.getElementById('editor-align-center').addEventListener('click', function() { execWithSelection('justifyCenter', null, editorDiv); });
    document.getElementById('editor-align-left').addEventListener('click', function() { execWithSelection('justifyLeft', null, editorDiv); });
    document.getElementById('editor-rtl').addEventListener('click', function() {
        editorDiv.style.direction = 'rtl';
        execWithSelection('justifyRight', null, editorDiv);
    });
    document.getElementById('editor-ltr').addEventListener('click', function() {
        editorDiv.style.direction = 'ltr';
        execWithSelection('justifyLeft', null, editorDiv);
    });

    document.getElementById('editor-copy').addEventListener('click', function() {
        navigator.clipboard.writeText(editorDiv.innerText);
        var btn = document.getElementById('editor-copy');
        var orig = btn.innerHTML;
        btn.innerHTML = '✓ ' + (currentLang === 'fa' ? 'کپی شد' : 'Copied');
        setTimeout(function() { btn.innerHTML = orig; }, 1500);
    });
    document.getElementById('editor-clear').addEventListener('click', function() {
        if (confirm(currentLang === 'fa' ? 'متن پاک شود؟' : 'Clear text?')) {
            editorDiv.innerHTML = '';
            saveState(editorDiv);
            localStorage.removeItem('smartEditorContent');
            updateStats(editorDiv);
            updateFontSizeDisplay(editorDiv);
        }
    });

    document.getElementById('editor-upload').addEventListener('click', function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.doc,.docx';
        input.onchange = function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var ext = file.name.split('.').pop().toLowerCase();
            if (ext === 'txt') {
                var reader = new FileReader();
                reader.onload = function(ev) {
                    editorDiv.innerText = ev.target.result;
                    saveState(editorDiv);
                    updateStats(editorDiv);
                    updateFontSizeDisplay(editorDiv);
                    localStorage.setItem('smartEditorContent', editorDiv.innerHTML);
                };
                reader.readAsText(file, 'UTF-8');
            } else if (ext === 'docx') {
                if (typeof mammoth === 'undefined') {
                    alert('کتابخانه mammoth در دسترس نیست. لطفا اتصال اینترنت خود را بررسی کنید.');
                    return;
                }
                (function(fileObj) {
                    var reader2 = new FileReader();
                    reader2.onload = function(ev2) {
                        try {
                            var arrayBuffer = ev2.target.result;
                            mammoth.extractRawText({ arrayBuffer: arrayBuffer }).then(function(result) {
                                editorDiv.innerText = result.value;
                                saveState(editorDiv);
                                updateStats(editorDiv);
                                updateFontSizeDisplay(editorDiv);
                                localStorage.setItem('smartEditorContent', editorDiv.innerHTML);
                            }).catch(function(err) {
                                alert('خطا در باز کردن فایل Word: ' + err.message);
                            });
                        } catch (err) {
                            alert('خطا در باز کردن فایل Word');
                        }
                    };
                    reader2.readAsArrayBuffer(fileObj);
                })(file);
            } else if (ext === 'doc') {
                var reader3 = new FileReader();
                reader3.onload = function(ev) {
                    editorDiv.innerText = ev.target.result;
                    saveState(editorDiv);
                    updateStats(editorDiv);
                    updateFontSizeDisplay(editorDiv);
                    localStorage.setItem('smartEditorContent', editorDiv.innerHTML);
                };
                reader3.readAsText(file, 'UTF-8');
            }
        };
        input.click();
    });

    document.getElementById('editor-undo').addEventListener('click', function() {
        if (editorUndoStack.length > 1) {
            editorRedoStack.push(editorUndoStack.pop());
            editorDiv.innerHTML = editorUndoStack[editorUndoStack.length - 1];
            saveState(editorDiv);
            updateFontSizeDisplay(editorDiv);
        }
        editorDiv.focus();
    });
    document.getElementById('editor-redo').addEventListener('click', function() {
        if (editorRedoStack.length) {
            var redoContent = editorRedoStack.pop();
            pushToUndo(editorDiv.innerHTML);
            editorDiv.innerHTML = redoContent;
            saveState(editorDiv);
            updateFontSizeDisplay(editorDiv);
        }
        editorDiv.focus();
    });

    var saveDropdown = document.getElementById('save-dropdown-btn');
    var saveMenu = document.querySelector('.save-menu');
    saveDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        saveMenu.classList.toggle('show');
    });
    document.addEventListener('click', function(e) {
        if (!saveDropdown.contains(e.target) && !saveMenu.contains(e.target)) {
            saveMenu.classList.remove('show');
        }
    });

    // ============================================================
    //  خروجی PDF با کیفیت بالا (با استفاده از window.print)
    // ============================================================
    document.getElementById('save-pdf').addEventListener('click', function() {
        var content = editorDiv.innerHTML;
        var allStyles = '';
        var styleElements = document.querySelectorAll('style');
        for (var i = 0; i < styleElements.length; i++) {
            allStyles += styleElements[i].innerHTML;
        }
        var printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            alert('لطفاً مسدودکننده پنجره‌های بازشو را غیرفعال کنید.');
            return;
        }
        printWindow.document.write('<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>خروجی PDF</title><style>' + allStyles + ' body { padding: 40px 20px; background: white; color: black; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; } .editor-header, .editor-tabs-bar, .editor-tab-panel, .editor-stats, .editor-statusbar, .editor-warning, .back-to-home-btn, .header-buttons, .toolbar-row { display: none !important; } .editor-content { all: unset; display: block; direction: rtl; text-align: right; font-size: 16px; line-height: 1.8; color: #000; padding: 0; margin: 0; background: transparent; border: none; box-shadow: none; min-height: auto; } table { width: 100%; border-collapse: collapse; margin: 10px 0; } th, td { border: 1px solid #333; padding: 6px; text-align: right; } * { direction: rtl; text-align: right; } @media print { body { margin: 0; padding: 20px; } .no-print { display: none !important; } } </style></head><body><div class="editor-content">' + content + '</div><script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };<\/script></body></html>');
        printWindow.document.close();
        saveMenu.classList.remove('show');
    });

    // ---- خروجی DOC ----
    document.getElementById('save-doc').addEventListener('click', function() {
        var content = '<html><head><meta charset="UTF-8"></head><body>' + editorDiv.innerHTML + '</body></html>';
        var blob = new Blob([content], { type: 'application/msword' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'document_' + Date.now() + '.doc';
        a.click();
        URL.revokeObjectURL(blob);
        saveMenu.classList.remove('show');
    });

    // ---- خروجی HTML ----
    document.getElementById('save-html').addEventListener('click', function() {
        var blob = new Blob([editorDiv.innerHTML], { type: 'text/html' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'editor_' + Date.now() + '.html';
        a.click();
        URL.revokeObjectURL(blob);
        saveMenu.classList.remove('show');
    });

    // ---- جدول ----
    var tableBtn = document.getElementById('editor-table');
    var tablePanel = document.getElementById('tablePanel');
    tableBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        tablePanel.classList.toggle('show');
    });
    document.addEventListener('click', function(e) {
        if (!tableBtn.contains(e.target)) tablePanel.classList.remove('show');
    });
    document.getElementById('createTableBtn').addEventListener('click', function() {
        var rows = parseInt(document.getElementById('tableRows').value);
        var cols = parseInt(document.getElementById('tableCols').value);
        if (rows > 0 && cols > 0) {
            var tableHtml = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 8px 0;"><tbody>';
            for (var i = 0; i < rows; i++) {
                tableHtml += '<tr>';
                for (var j = 0; j < cols; j++) {
                    tableHtml += '<td style="padding: 8px; border: 1px solid #aaa;">&nbsp;</td>';
                }
                tableHtml += '</tr>';
            }
            tableHtml += '</tbody></table>';
            execWithSelection('insertHTML', tableHtml, editorDiv);
            tablePanel.classList.remove('show');
        }
    });

    function deleteCurrentTableRow() {
        editorDiv.focus();
        var sel = window.getSelection();
        if (!sel.rangeCount) return;
        var node = sel.getRangeAt(0).startContainer;
        while (node && node.tagName !== 'TR') {
            node = node.parentElement;
        }
        if (node && node.tagName === 'TR') {
            node.remove();
            saveState(editorDiv);
            updateStats(editorDiv);
        }
    }

    function deleteCurrentTableCol() {
        editorDiv.focus();
        var sel = window.getSelection();
        if (!sel.rangeCount) return;
        var cell = sel.getRangeAt(0).startContainer;
        while (cell && cell.tagName !== 'TD') {
            cell = cell.parentElement;
        }
        if (!cell) return;
        var colIndex = cell.cellIndex;
        var table = cell.parentElement;
        while (table && table.tagName !== 'TABLE') {
            table = table.parentElement;
        }
        if (!table) return;
        var rows = table.rows;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.cells[colIndex]) {
                row.cells[colIndex].remove();
            }
        }
        saveState(editorDiv);
        updateStats(editorDiv);
    }

    editorDiv.addEventListener('keydown', function(e) {
        if (e.key === 'Delete') {
            var sel = window.getSelection();
            if (!sel.rangeCount) return;
            var node = sel.getRangeAt(0).startContainer;
            var table = null;
            var parent = node;
            while (parent) {
                if (parent.tagName === 'TABLE') {
                    table = parent;
                    break;
                }
                parent = parent.parentElement;
            }
            if (table) {
                e.preventDefault();
                deleteCurrentTableRow();
            }
        }
    });
    document.getElementById('delete-table-row').addEventListener('click', deleteCurrentTableRow);
    document.getElementById('delete-table-col').addEventListener('click', deleteCurrentTableCol);

    var tabBtns = document.querySelectorAll('.editor-tab-btn');
    var tabPanels = document.querySelectorAll('.editor-tab-panel');
    for (var i = 0; i < tabBtns.length; i++) {
        (function(btn) {
            btn.addEventListener('click', function() {
                var tabId = btn.getAttribute('data-tab');
                for (var j = 0; j < tabBtns.length; j++) {
                    tabBtns[j].classList.remove('active');
                }
                btn.classList.add('active');
                for (var k = 0; k < tabPanels.length; k++) {
                    tabPanels[k].classList.remove('active');
                }
                document.getElementById('tab-' + tabId).classList.add('active');
            });
        })(tabBtns[i]);
    }

    document.getElementById('back-to-home-editor').addEventListener('click', function() {
        if (typeof switchTool !== 'undefined') switchTool('home');
    });

    function updateStatusBar() {
        var sel = window.getSelection();
        if (!sel.rangeCount) return;
        var node = sel.getRangeAt(0).startContainer;
        var parent = node.nodeType === 3 ? node.parentElement : node;
        var align = document.queryCommandValue('justify');
        var alignText = align === 'center' ? 'وسط' : (align === 'left' ? 'چپ' : 'راست');
        document.getElementById('status-align').innerText = 'چینش: ' + alignText;
        document.getElementById('status-bold').innerText = 'پررنگ: ' + (document.queryCommandState('bold') ? 'فعال' : 'خیر');
        document.getElementById('status-italic').innerText = 'کج: ' + (document.queryCommandState('italic') ? 'فعال' : 'خیر');
        document.getElementById('status-underline').innerText = 'زیرخط: ' + (document.queryCommandState('underline') ? 'فعال' : 'خیر');
        document.getElementById('status-color').innerText = 'رنگ: ' + window.getComputedStyle(parent).color;
    }
    editorDiv.addEventListener('mouseup', updateStatusBar);
    editorDiv.addEventListener('keyup', updateStatusBar);
    updateStatusBar();

    updateEditorLanguage();
}

window.updateEditorLanguage = updateEditorLanguage;