let fileExplorerModule = (function() {
            let rootHandle = null,
                currentHandle = null,
                historyStack = [];
            let sizeCache = new Map();
            let deepSearchAbortController = null;
            let currentSort = 'az';
            let container = null;
            let t = null;

            function formatBytes(bytes) {
                if (!bytes || bytes === 0) return '0 B';
                const sizes = ['B', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(1024));
                return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
            }

            async function requestWritePermission(dirHandle) {
                if (await dirHandle.queryPermission({ mode: 'readwrite' }) === 'granted') return true;
                const result = await dirHandle.requestPermission({ mode: 'readwrite' });
                return result === 'granted';
            }

            async function computeDirectorySize(dirHandle) {
                let total = 0;
                try {
                    for await (const [_, entry] of dirHandle.entries()) {
                        if (entry.kind === 'file') total += (await entry.getFile()).size;
                        else total += await computeDirectorySize(entry);
                    }
                } catch (e) { console.warn(e); }
                return total;
            }

            async function getDirectoryItemsWithSize(dirHandle) {
                let entries = [];
                for await (const [name, handle] of dirHandle.entries()) {
                    entries.push({ name, handle });
                }
                const items = await Promise.all(entries.map(async({ name, handle }) => {
                    let size = 0;
                    if (handle.kind === 'file') {
                        const file = await handle.getFile();
                        size = file.size;
                    } else {
                        if (sizeCache.has(handle)) size = sizeCache.get(handle);
                        else {
                            size = await computeDirectorySize(handle);
                            sizeCache.set(handle, size);
                        }
                    }
                    return { name, handle, type: handle.kind, size };
                }));
                return sortItems(items);
            }

            function sortItems(items) {
                const copy = [...items];
                switch (currentSort) {
                    case 'az':
                        copy.sort((a, b) => a.name.localeCompare(b.name));
                        break;
                    case 'za':
                        copy.sort((a, b) => b.name.localeCompare(a.name));
                        break;
                    case 'size_desc':
                        copy.sort((a, b) => b.size - a.size);
                        break;
                    case 'size_asc':
                        copy.sort((a, b) => a.size - b.size);
                        break;
                    case 'type':
                        copy.sort((a, b) => {
                            if (a.type === b.type) return a.name.localeCompare(b.name);
                            return a.type === 'directory' ? -1 : 1;
                        });
                        break;
                    case 'extension':
                        copy.sort((a, b) => {
                            const extA = a.type === 'file' ? (a.name.split('.').pop() || '').toLowerCase() : '';
                            const extB = b.type === 'file' ? (b.name.split('.').pop() || '').toLowerCase() : '';
                            if (extA === extB) return a.name.localeCompare(b.name);
                            return extA.localeCompare(extB);
                        });
                        break;
                    default:
                        copy.sort((a, b) => a.name.localeCompare(b.name));
                }
                return copy;
            }

            async function loadCurrentDirectory() {
                if (!currentHandle || !container) return;
                const contentArea = container.querySelector('#feContentArea');
                if (!contentArea) return;
                contentArea.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>${t('filemgr_loading') || 'در حال بارگذاری...'}</p></div>`;
                try {
                    let items = await getDirectoryItemsWithSize(currentHandle);
                    renderItems(contentArea, items);
                    updateBreadcrumb();
                    updateBackButton();
                } catch (err) {
                    contentArea.innerHTML = `<div class="error-msg">${err.message}</div>`;
                }
            }

            function renderItems(containerEl, items) {
                const grid = document.createElement('div');
                grid.className = 'items-grid';
                if (!items.length) {
                    containerEl.innerHTML = `<div class="empty-message">📁 <p>${t('filemgr_empty_folder')}</p></div>`;
                    renderStatsPanel(containerEl, items);
                    return;
                }
                for (const item of items) {
                    const row = document.createElement('div');
                    row.className = 'item-row';
                    const isDir = item.type === 'directory';
                    const icon = isDir ? '📁' : '📄';
                    row.innerHTML = `
                <div class="item-info">
                    <div class="item-icon">${icon}</div>
                    <div class="item-name">${escapeHtml(item.name)}</div>
                    <div class="item-size">${formatBytes(item.size)}</div>
                </div>
                <div class="item-actions">
                    <button class="rename-btn" title="تغییر نام">✏️</button>
                    <button class="delete-btn" title="حذف">🗑️</button>
                </div>
            `;
                    if (isDir) {
                        row.style.cursor = 'pointer';
                        row.addEventListener('click', async(e) => {
                            if (e.target.closest('.item-actions')) return;
                            historyStack.push({ handle: currentHandle, name: currentHandle.name });
                            currentHandle = item.handle;
                            await loadCurrentDirectory();
                        });
                    }
                    row.querySelector('.rename-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        renameItem(item);
                    });
                    row.querySelector('.delete-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        deleteItem(item);
                    });
                    grid.appendChild(row);
                }
                containerEl.innerHTML = '';
                containerEl.appendChild(grid);
                renderStatsPanel(containerEl, items);
            }

            function renderStatsPanel(containerEl, items) {
                const old = containerEl.querySelector('.stats-panel');
                if (old) old.remove();
                const folders = items.filter(i => i.type === 'directory').length;
                const files = items.filter(i => i.type === 'file').length;
                const totalSize = items.reduce((s, i) => s + (i.size || 0), 0);
                const stats = document.createElement('div');
                stats.className = 'stats-panel';
                stats.innerHTML = `
            <div class="stats-item">📁 ${t('filemgr_folders')}: ${folders}</div>
            <div class="stats-item">📄 ${t('filemgr_files')}: ${files}</div>
            <div class="stats-item">💾 ${t('filemgr_total_size')}: ${formatBytes(totalSize)}</div>
        `;
                containerEl.appendChild(stats);
            }

            function updateBreadcrumb() {
                const bread = container.querySelector('.file-explorer-breadcrumb');
                if (!bread) return;
                bread.innerHTML = '';
                let allItems = [];
                for (let item of historyStack) {
                    if (allItems.length === 0 || allItems[allItems.length - 1].handle !== item.handle) {
                        allItems.push(item);
                    }
                }
                if (currentHandle && (allItems.length === 0 || allItems[allItems.length - 1].handle !== currentHandle)) {
                    allItems.push({ handle: currentHandle, name: currentHandle.name });
                }
                const uniqueItems = [];
                for (let i = 0; i < allItems.length; i++) {
                    if (i === 0 || allItems[i].handle !== allItems[i - 1].handle) {
                        uniqueItems.push(allItems[i]);
                    }
                }
                uniqueItems.forEach((item, idx) => {
                    const span = document.createElement('span');
                    span.className = 'breadcrumb-item';
                    span.innerHTML = `📁 ${escapeHtml(item.name)}`;
                    span.addEventListener('click', async() => {
                        const newStack = uniqueItems.slice(0, idx + 1);
                        historyStack.length = 0;
                        historyStack.push(...newStack.slice(0, -1));
                        currentHandle = newStack[newStack.length - 1].handle;
                        await loadCurrentDirectory();
                    });
                    bread.appendChild(span);
                    if (idx < uniqueItems.length - 1) {
                        const sep = document.createElement('span');
                        sep.className = 'breadcrumb-separator';
                        sep.textContent = '›';
                        bread.appendChild(sep);
                    }
                });
            }

            function updateBackButton() {
                const backBtn = container.querySelector('.file-explorer-back');
                if (backBtn) backBtn.disabled = historyStack.length === 0;
            }

            async function renameItem(item) {
                if (!await requestWritePermission(currentHandle)) {
                    alert(t('filemgr_permission_denied'));
                    return;
                }
                const newName = prompt(t('filemgr_rename_prompt'), item.name);
                if (!newName || newName === item.name) return;
                try {
                    if (item.type === 'directory') await currentHandle.move(item.handle, newName);
                    else await item.handle.move(newName);
                    await loadCurrentDirectory();
                } catch (err) {
                    alert(t('filemgr_error_rename') + ': ' + err.message);
                }
            }

            async function deleteItem(item) {
                if (!await requestWritePermission(currentHandle)) {
                    alert(t('filemgr_permission_denied'));
                    return;
                }
                if (!confirm(t('filemgr_confirm_delete').replace('{name}', item.name))) return;
                try {
                    await currentHandle.removeEntry(item.name, { recursive: item.type === 'directory' });
                    sizeCache.delete(item.handle);
                    await loadCurrentDirectory();
                } catch (err) {
                    alert(t('filemgr_error_delete') + ': ' + err.message);
                }
            }

            async function createFolder() {
                if (!currentHandle) return alert(t('filemgr_select_root_first'));
                if (!await requestWritePermission(currentHandle)) {
                    alert(t('filemgr_permission_denied'));
                    return;
                }
                const folderName = prompt(t('filemgr_new_folder_prompt'));
                if (!folderName) return;
                try {
                    await currentHandle.getDirectoryHandle(folderName, { create: true });
                    await loadCurrentDirectory();
                } catch (err) {
                    alert(t('filemgr_error_create_folder') + ': ' + err.message);
                }
            }

            async function createFile() {
                if (!currentHandle) return alert(t('filemgr_select_root_first'));
                if (!await requestWritePermission(currentHandle)) {
                    alert(t('filemgr_permission_denied'));
                    return;
                }
                const fileName = prompt(t('filemgr_new_file_prompt'));
                if (!fileName) return;
                try {
                    const fileHandle = await currentHandle.getFileHandle(fileName, { create: true });
                    const writable = await fileHandle.createWritable();
                    await writable.close();
                    await loadCurrentDirectory();
                } catch (err) {
                    alert(t('filemgr_error_create_file') + ': ' + err.message);
                }
            }

            async function performDeepSearch(query) {
                if (!rootHandle) {
                    const searchStatusSpan = container.querySelector('#feSearchStatus');
                    if (searchStatusSpan) searchStatusSpan.innerText = t('filemgr_select_root_first');
                    return;
                }
                if (deepSearchAbortController) deepSearchAbortController.abort();
                deepSearchAbortController = new AbortController();
                const signal = deepSearchAbortController.signal;
                const searchStatusSpan = container.querySelector('#feSearchStatus');
                if (searchStatusSpan) searchStatusSpan.innerText = `${t('filemgr_searching')} "${query}"...`;
                const results = [];
                let scanned = 0;
                const start = Date.now();
                try {
                    await deepSearchRecursive(rootHandle, query, results, signal, (cnt) => { scanned = cnt; });
                    const duration = ((Date.now() - start) / 1000).toFixed(1);
                    if (searchStatusSpan) searchStatusSpan.innerText = `✅ ${results.length} ${t('filemgr_results_for')} "${query}" (${scanned} ${t('filemgr_items_scanned')} ${duration}s)`;
                    const contentArea = container.querySelector('#feContentArea');
                    if (results.length) renderSearchResults(contentArea, results, query);
                    else contentArea.innerHTML = `<div class="empty-message">🔍 <p>${t('filemgr_no_results')} "${escapeHtml(query)}"</p></div>`;
                } catch (err) {
                    if (err.name !== 'AbortError' && searchStatusSpan) searchStatusSpan.innerText = "خطا در جستجو";
                }
            }

            async function deepSearchRecursive(dirHandle, query, results, signal, updateScanned) {
                if (signal.aborted) throw new Error('AbortError');
                let count = 0;
                for await (const [name, handle] of dirHandle.entries()) {
                    if (signal.aborted) return;
                    count++;
                    if (updateScanned) updateScanned(count);
                    if (name.toLowerCase().includes(query.toLowerCase())) {
                        let size = 0;
                        if (handle.kind === 'file') size = (await handle.getFile()).size;
                        else {
                            if (sizeCache.has(handle)) size = sizeCache.get(handle);
                            else {
                                size = await computeDirectorySize(handle);
                                sizeCache.set(handle, size);
                            }
                        }
                        results.push({ name, handle, type: handle.kind, size, path: dirHandle.name });
                    }
                    if (handle.kind === 'directory') await deepSearchRecursive(handle, query, results, signal, updateScanned);
                }
            }

            function renderSearchResults(containerEl, results, query) {
                containerEl.innerHTML = '';
                const grid = document.createElement('div');
                grid.className = 'items-grid';
                for (const res of results) {
                    const row = document.createElement('div');
                    row.className = 'item-row';
                    const isDir = res.type === 'directory';
                    const icon = isDir ? '📁' : '📄';
                    let displayName = escapeHtml(res.name);
                    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
                    displayName = displayName.replace(regex, `<span class="highlight">$1</span>`);
                    row.innerHTML = `
                <div class="item-info">
                    <div class="item-icon">${icon}</div>
                    <div class="item-name">${displayName} <span style="font-size:0.7rem; opacity:0.7;">(${t('filemgr_path')}: ${escapeHtml(res.path)})</span></div>
                    <div class="item-size">${formatBytes(res.size)}</div>
                </div>
                <div class="item-actions">${isDir ? `<button class="open-from-search" title="${t('filemgr_open_folder')}">📂</button>` : ''}</div>
            `;
            if (isDir) {
                row.querySelector('.open-from-search').addEventListener('click', async () => {
                    historyStack = [];
                    currentHandle = res.handle;
                    await loadCurrentDirectory();
                    const searchInput = container.querySelector('#feDeepSearchInput');
                    if (searchInput) searchInput.value = '';
                    const searchStatusSpan = container.querySelector('#feSearchStatus');
                    if (searchStatusSpan) searchStatusSpan.innerText = t('filemgr_search_status_ready');
                });
            }
            grid.appendChild(row);
        }
        containerEl.appendChild(grid);
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    async function selectRoot() {
        try {
            const rootDir = await window.showDirectoryPicker();
            rootHandle = rootDir;
            currentHandle = rootDir;
            historyStack = [];
            sizeCache.clear();
            await loadCurrentDirectory();
            const searchSection = container.querySelector('#feSearchSection');
            if (searchSection) searchSection.style.display = 'flex';
            const newFolderBtn = container.querySelector('#feNewFolder');
            if (newFolderBtn) newFolderBtn.style.display = 'inline-flex';
            const newFileBtn = container.querySelector('#feNewFile');
            if (newFileBtn) newFileBtn.style.display = 'inline-flex';
        } catch (err) {
            if (err.name !== 'AbortError') alert(err.message);
        }
    }

    async function updateLanguage() {
        if (!container) return;
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'fa';
        const noticeDiv = container.querySelector('.filemanager-notice');
        if (noticeDiv) {
            const strongEl = noticeDiv.querySelector('strong');
            const spanEl = noticeDiv.querySelector('span');
            if (strongEl && spanEl) {
                if (lang === 'fa') {
                    strongEl.innerText = '⚠️ نکته مهم درباره دسترسی به درایوها';
                    spanEl.innerText = 'درایو C (سیستم) به دلیل محدودیت امنیتی مرورگر قابل انتخاب نیست. برای درایوهای دیگر (D:, E:, ...) فقط می‌توانید یک پوشه را انتخاب کنید، نه خود درایو را. هاردهای اکسترنال (USB، هارد اکسترنال) به طور کامل (خود درایو و پوشه‌ها) قابل مدیریت هستند.';
                } else {
                    strongEl.innerText = '⚠️ Important note about drive access';
                    spanEl.innerText = 'Drive C: (system) cannot be selected due to browser security restrictions. For other internal drives (D:, E:, ...) you can only select a folder, not the drive itself. External drives (USB, external HDD) are fully accessible (drive and folders).';
                }
                spanEl.style.color = '#ffffff';
            }
        }
        const selectRootBtn = container.querySelector('#feSelectRoot');
        if (selectRootBtn) selectRootBtn.innerHTML = `📂 ${t('filemgr_select_root')}`;
        const newFolderBtn = container.querySelector('#feNewFolder');
        if (newFolderBtn) newFolderBtn.innerHTML = `📁+ ${t('filemgr_new_folder')}`;
        const newFileBtn = container.querySelector('#feNewFile');
        if (newFileBtn) newFileBtn.innerHTML = `📄+ ${t('filemgr_new_file')}`;
        const backBtn = container.querySelector('#feBackBtn');
        if (backBtn) backBtn.innerHTML = `← ${t('filemgr_back')}`;
        const refreshBtn = container.querySelector('#feRefreshBtn');
        if (refreshBtn) refreshBtn.innerHTML = `🔄 ${t('filemgr_refresh')}`;
        const searchInput = container.querySelector('#feDeepSearchInput');
        if (searchInput) searchInput.placeholder = t('filemgr_search_placeholder');
        const sortSelect = container.querySelector('#feSortSelect');
        if (sortSelect) {
            const options = sortSelect.options;
            if (options.length >= 6) {
                options[0].text = t('filemgr_sort_az');
                options[1].text = t('filemgr_sort_za');
                options[2].text = t('filemgr_sort_size_desc');
                options[3].text = t('filemgr_sort_size_asc');
                options[4].text = t('filemgr_sort_type');
                options[5].text = t('filemgr_sort_extension');
            }
        }
        const sortLabel = container.querySelector('.sort-control label');
        if (sortLabel) sortLabel.textContent = t('filemgr_sort_label');
        const searchStatusSpan = container.querySelector('#feSearchStatus');
        if (searchStatusSpan && !deepSearchAbortController) searchStatusSpan.innerText = t('filemgr_search_status_ready');
        if (currentHandle) await loadCurrentDirectory();
        else {
            const contentArea = container.querySelector('#feContentArea');
            if (contentArea) contentArea.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>${t('filemgr_select_root')}</p></div>`;
        }
    }

    function build(containerElement) {
        if (!('showDirectoryPicker' in window)) {
            containerElement.innerHTML = `<div class="error-msg">${translations[currentLang].filemgr_unsupported}</div>`;
            return;
        }
        container = containerElement;
        t = (key) => translations[currentLang][key] || key;
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'fa';
        const noticeTitleFa = '⚠️ نکته مهم درباره دسترسی به درایوها';
        const noticeTextFa = 'درایو C (سیستم) به دلیل محدودیت امنیتی مرورگر قابل انتخاب نیست. برای درایوهای دیگر (D:, E:, ...) فقط می‌توانید یک پوشه را انتخاب کنید، نه خود درایو را. هاردهای اکسترنال (USB، هارد اکسترنال) به طور کامل (خود درایو و پوشه‌ها) قابل مدیریت هستند.';
        const noticeTitleEn = '⚠️ Important note about drive access';
        const noticeTextEn = 'Drive C: (system) cannot be selected due to browser security restrictions. For other internal drives (D:, E:, ...) you can only select a folder, not the drive itself. External drives (USB, external HDD) are fully accessible (drive and folders).';
        
        container.innerHTML = `
            <div class="file-explorer-container">
                <div class="filemanager-notice" style="background: rgba(0,0,0,0.5); border-right: 4px solid #f59e0b; padding: 12px; border-radius: 1rem; margin-bottom: 1rem;">
                    <div style="display: flex; gap: 10px; align-items: flex-start;">
                        <span style="font-size: 1.5rem;">⚠️</span>
                        <div style="flex:1;">
                            <strong style="color: #f59e0b;">${lang === 'fa' ? noticeTitleFa : noticeTitleEn}</strong><br>
                            <span style="font-size: 0.85rem; color: #ffffff;">${lang === 'fa' ? noticeTextFa : noticeTextEn}</span>
                        </div>
                    </div>
                </div>
                <div class="main-actions">
                    <button id="feSelectRoot" class="action-btn">📂 ${t('filemgr_select_root')}</button>
                    <button id="feNewFolder" class="action-btn" style="display:none;">📁+ ${t('filemgr_new_folder')}</button>
                    <button id="feNewFile" class="action-btn" style="display:none;">📄+ ${t('filemgr_new_file')}</button>
                </div>
                <div class="nav-bar">
                    <button id="feBackBtn" class="back-btn file-explorer-back" disabled>← ${t('filemgr_back')}</button>
                    <button id="feRefreshBtn" class="refresh-btn">🔄 ${t('filemgr_refresh')}</button>
                    <div class="breadcrumb file-explorer-breadcrumb"></div>
                </div>
                <div id="feSearchSection" class="search-section" style="display:none;">
                    <div class="search-wrapper">
                        🔍
                        <input type="text" id="feDeepSearchInput" placeholder="${t('filemgr_search_placeholder')}" autocomplete="off">
                        <button id="feClearDeepSearch">✖️</button>
                    </div>
                    <div class="sort-control">
                        <label>${t('filemgr_sort_label')}</label>
                        <select id="feSortSelect">
                            <option value="az">${t('filemgr_sort_az')}</option>
                            <option value="za">${t('filemgr_sort_za')}</option>
                            <option value="size_desc">${t('filemgr_sort_size_desc')}</option>
                            <option value="size_asc">${t('filemgr_sort_size_asc')}</option>
                            <option value="type">${t('filemgr_sort_type')}</option>
                            <option value="extension">${t('filemgr_sort_extension')}</option>
                        </select>
                    </div>
                </div>
                <div id="feContentArea" class="content-area" style="min-height:400px;">
                    <div class="loading-state"><div class="spinner"></div><p>${t('filemgr_select_root')}</p></div>
                </div>
            </div>
        `;
        const removeExtraParagraph = () => {
            const allParagraphs = container.querySelectorAll('p');
            allParagraphs.forEach(p => {
                if (p.textContent.trim() === 'انتخاب پوشه ریشه' || p.textContent.includes('انتخاب پوشه ریشه')) {
                    p.remove();
                }
            });
        };
        setTimeout(removeExtraParagraph, 100);

        const selectRootBtn = container.querySelector('#feSelectRoot');
        const newFolderBtn = container.querySelector('#feNewFolder');
        const newFileBtn = container.querySelector('#feNewFile');
        const backBtn = container.querySelector('#feBackBtn');
        const refreshBtn = container.querySelector('#feRefreshBtn');
        const searchSection = container.querySelector('#feSearchSection');
        const searchInput = container.querySelector('#feDeepSearchInput');
        const clearSearch = container.querySelector('#feClearDeepSearch');
        const sortSelect = container.querySelector('#feSortSelect');

        currentSort = 'az';
        sortSelect.value = 'az';

        sortSelect.addEventListener('change', async (e) => {
            currentSort = e.target.value;
            if (currentHandle) await loadCurrentDirectory();
        });

        backBtn.onclick = async () => {
            if (historyStack.length === 0) return;
            historyStack.pop();
            if (historyStack.length === 0) {
                currentHandle = rootHandle;
            } else {
                currentHandle = historyStack[historyStack.length - 1].handle;
            }
            await loadCurrentDirectory();
        };
        refreshBtn.onclick = async () => { if (currentHandle) await loadCurrentDirectory(); };
        selectRootBtn.onclick = () => selectRoot();
        newFolderBtn.onclick = () => createFolder();
        newFileBtn.onclick = () => createFile();
        clearSearch.onclick = () => {
            searchInput.value = '';
            if (deepSearchAbortController) deepSearchAbortController.abort();
            if (currentHandle) loadCurrentDirectory();
        };
        let debounceTimer;
        searchInput.oninput = (e) => {
            const val = e.target.value.trim();
            clearTimeout(debounceTimer);
            if (val.length < 2) {
                if (deepSearchAbortController) deepSearchAbortController.abort();
                if (currentHandle) loadCurrentDirectory();
                return;
            }
            debounceTimer = setTimeout(() => performDeepSearch(val), 400);
        };
    }

    return { build, updateLanguage };
})();

function buildFileExplorer() {
    const container = document.getElementById('widgetContainer');
    fileExplorerModule.build(container);
    addBackToHomeButton(container);
}

function updateFileManagerLanguage() {
    if (fileExplorerModule.updateLanguage) fileExplorerModule.updateLanguage();
}