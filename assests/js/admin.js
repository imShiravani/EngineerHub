// ==================== admin.js – پنل مدیریت کامل (مستقل) ====================

// ============================================================
//  توابع مدیریت زبان (مستقل از config.js)
// ============================================================

function getStoredLanguage() {
    try {
        var stored = localStorage.getItem('appLang');
        if (stored === 'en' || stored === 'fa') return stored;
        return 'fa';
    } catch (e) {
        return 'fa';
    }
}

function setStoredLanguage(lang) {
    try {
        localStorage.setItem('appLang', lang);
    } catch (e) {}
}

function clearStoredLanguage() {
    try {
        localStorage.removeItem('appLang');
    } catch (e) {}
}

// ---- زبان فعلی ----
var currentLang = getStoredLanguage();

// ---- دیکشنری ترجمه ادمین ----
var translationsAdmin = {
    fa: {
        users: "👥 مدیریت کاربران",
        stats: "📊 آمار و نمودارها",
        tools: "🛠️ مدیریت ابزارها",
        settings: "⚙️ تنظیمات عمومی",
        albums: "🎵 مدیریت آلبوم‌ها",
        totalUsers: "کاربران کل",
        activeUsers: "کاربران فعال",
        todayVisits: "بازدید امروز",
        activeTools: "ابزار فعال",
        addUser: "➕ افزودن کاربر",
        saveSettings: "💾 ذخیره تنظیمات",
        resetTools: "🔁 بازنشانی پیش‌فرض",
        addAlbum: "➕ افزودن آلبوم جدید",
        syncAlbums: "🔄 همگام‌سازی از مرورگر",
        delete: "حذف",
        edit: "ویرایش",
        roleAdmin: "ادمین",
        roleUser: "کاربر",
        statusActive: "فعال",
        statusInactive: "غیرفعال",
        tool_home: "خانه",
        tool_calculator: "ماشین حساب",
        tool_password: "تولید رمز",
        tool_videoplayer: "پلیر ویدیو",
        tool_filemanager: "مدیریت فایل",
        tool_colorpicker: "پالت رنگ",
        tool_textunit: "متن و مبدل",
        tool_smarteditor: "ویرایشگر متن",
        tool_timer: "کرنومتر",
        tool_musicplayer: "پلیر موسیقی",
        refreshUsers: "🔄 بازخوانی کاربران",
        saveTools: "💾 ذخیره تغییرات ابزارها",
        userAdded: "✅ کاربر جدید اضافه شد",
        userUpdated: "✅ کاربر به‌روز شد",
        userDeleted: "✅ کاربر حذف شد",
        confirmDelete: "آیا از حذف این کاربر اطمینان دارید؟",
        invalidEmail: "ایمیل نامعتبر است",
        shortPassword: "رمز عبور باید حداقل ۶ کاراکتر باشد",
        allFieldsRequired: "تمام فیلدها الزامی است",
        albumSaved: "✅ آلبوم با موفقیت ذخیره شد",
        albumDeleted: "✅ آلبوم حذف شد",
        songDeleted: "✅ آهنگ حذف شد",
        confirmDeleteAlbum: "آیا از حذف این آلبوم اطمینان دارید؟",
        confirmDeleteSong: "آیا از حذف این آهنگ اطمینان دارید؟",
        resetPassword: "تغییر رمز",
        newPassword: "رمز عبور جدید",
        enterNewPassword: "رمز جدید را وارد کنید (حداقل ۶ کاراکتر)",
        passwordChanged: "✅ رمز عبور با موفقیت تغییر کرد",
        activities: "فعالیت‌ها",
        viewActivities: "مشاهده فعالیت‌ها",
        clearAllLogs: "🗑️ پاک کردن همه لاگ‌ها",
        close: "بستن",
        time: "زمان",
        action: "فعالیت",
        ip: "IP",
        browser: "مرورگر",
        deleteLog: "حذف"
    },
    en: {
        users: "👥 User Management",
        stats: "📊 Statistics",
        tools: "🛠️ Tools Management",
        settings: "⚙️ General Settings",
        albums: "🎵 Albums Management",
        totalUsers: "Total Users",
        activeUsers: "Active Users",
        todayVisits: "Today's Visits",
        activeTools: "Active Tools",
        addUser: "➕ Add User",
        saveSettings: "💾 Save Settings",
        resetTools: "🔁 Reset Default",
        addAlbum: "➕ Add New Album",
        syncAlbums: "🔄 Sync from Browser",
        delete: "Delete",
        edit: "Edit",
        roleAdmin: "Admin",
        roleUser: "User",
        statusActive: "Active",
        statusInactive: "Inactive",
        tool_home: "Home",
        tool_calculator: "Calculator",
        tool_password: "Password",
        tool_videoplayer: "Video Player",
        tool_filemanager: "File Manager",
        tool_colorpicker: "Color Picker",
        tool_textunit: "Text & Units",
        tool_smarteditor: "Text Editor",
        tool_timer: "Timer",
        tool_musicplayer: "Music Player",
        refreshUsers: "🔄 Refresh Users",
        saveTools: "💾 Save Tools Changes",
        userAdded: "✅ User added",
        userUpdated: "✅ User updated",
        userDeleted: "✅ User deleted",
        confirmDelete: "Are you sure you want to delete this user?",
        invalidEmail: "Invalid email address",
        shortPassword: "Password must be at least 6 characters",
        allFieldsRequired: "All fields are required",
        albumSaved: "✅ Album saved successfully",
        albumDeleted: "✅ Album deleted",
        songDeleted: "✅ Song deleted",
        confirmDeleteAlbum: "Are you sure you want to delete this album?",
        confirmDeleteSong: "Are you sure you want to delete this song?",
        resetPassword: "Reset Password",
        newPassword: "New Password",
        enterNewPassword: "Enter new password (min 6 characters)",
        passwordChanged: "✅ Password changed successfully",
        activities: "Activities",
        viewActivities: "View Activities",
        clearAllLogs: "🗑️ Clear All Logs",
        close: "Close",
        time: "Time",
        action: "Action",
        ip: "IP",
        browser: "Browser",
        deleteLog: "Delete"
    }
};

function tAdmin(key) {
    return (translationsAdmin[currentLang] && translationsAdmin[currentLang][key]) ? translationsAdmin[currentLang][key] : key;
}

// ============================================================
//  توابع اصلی ادمین
// ============================================================

function setAdminLanguage(lang) {
    if (lang !== 'fa' && lang !== 'en') lang = 'fa';
    currentLang = lang;
    setStoredLanguage(lang);

    // به‌روزرسانی دایره‌های EN/FA در ادمین
    var circles = document.querySelectorAll('.lang-circle');
    for (var i = 0; i < circles.length; i++) {
        circles[i].classList.remove('active');
        if (circles[i].getAttribute('data-lang') === lang) {
            circles[i].classList.add('active');
        }
    }

    applyLanguage();
}

function applyLanguage() {
    try {
        // به‌روزرسانی متن دکمه‌های تب
        var tabs = document.querySelectorAll('.tab-btn');
        for (var i = 0; i < tabs.length; i++) {
            var btn = tabs[i];
            var tab = btn.getAttribute('data-tab');
            if (tab === 'users') btn.innerHTML = tAdmin('users');
            else if (tab === 'stats') btn.innerHTML = tAdmin('stats');
            else if (tab === 'tools') btn.innerHTML = tAdmin('tools');
            else if (tab === 'settings') btn.innerHTML = tAdmin('settings');
            else if (tab === 'albums') btn.innerHTML = tAdmin('albums');
        }

        // آمار
        var statLabels = ['statTotalUsersLabel', 'statActiveUsersLabel', 'statTodayVisitsLabel', 'statActiveToolsLabel'];
        var statKeys = ['totalUsers', 'activeUsers', 'todayVisits', 'activeTools'];
        for (var i = 0; i < statLabels.length; i++) {
            var el = document.getElementById(statLabels[i]);
            if (el) el.innerHTML = tAdmin(statKeys[i]);
        }

        // دکمه‌ها
        var addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) addUserBtn.innerHTML = tAdmin('addUser');
        var refreshUsersBtn = document.getElementById('refreshUsersBtn');
        if (refreshUsersBtn) refreshUsersBtn.innerHTML = tAdmin('refreshUsers');
        var saveToolsBtn = document.getElementById('saveToolsBtn');
        if (saveToolsBtn) saveToolsBtn.innerHTML = tAdmin('saveTools');
        var resetToolsBtn = document.getElementById('resetToolsBtn');
        if (resetToolsBtn) resetToolsBtn.innerHTML = tAdmin('resetTools');
        var saveSettingsBtn = document.getElementById('saveSettingsBtn');
        if (saveSettingsBtn) saveSettingsBtn.innerHTML = tAdmin('saveSettings');
        var addAlbumBtn = document.getElementById('addAlbumBtn');
        if (addAlbumBtn) addAlbumBtn.innerHTML = tAdmin('addAlbum');
        var syncAlbumsBtn = document.getElementById('syncAlbumsBtn');
        if (syncAlbumsBtn) syncAlbumsBtn.innerHTML = tAdmin('syncAlbums');

        // بارگذاری مجدد داده‌های هر تب فعال
        var activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            var tabId = activeTab.getAttribute('data-tab');
            if (tabId === 'users') loadUsers();
            else if (tabId === 'tools') loadTools();
            else if (tabId === 'albums') loadAlbums();
            else if (tabId === 'settings') loadSettings();
            else if (tabId === 'stats') loadStats();
        }
    } catch (e) {
        console.warn('خطا در applyLanguage:', e);
    }
}

// ============================================================
//  توابع API
// ============================================================

async function apiCall(action, data, method) {
    method = method || 'GET';
    var url = 'admin_api.php?action=' + action;
    if (method === 'GET' && data) {
        var params = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
        }
        if (params.length) url += '&' + params.join('&');
    }
    url += '&_t=' + Date.now();
    var options = { method: method, headers: { 'Content-Type': 'application/json' } };
    if (method === 'POST' && data) options.body = JSON.stringify(data);
    try {
        var res = await fetch(url, options);
        var json = await res.json();
        console.log('API response for ' + action + ':', json);
        return json;
    } catch (err) {
        console.error('API Call Error:', err);
        return { success: false, message: 'خطا در ارتباط با سرور' };
    }
}

function showMessage(msg, isError) {
    var div = document.createElement('div');
    div.innerText = msg;
    div.style.position = 'fixed';
    div.style.bottom = '20px';
    div.style.right = '20px';
    div.style.background = isError ? '#ef4444' : '#10b981';
    div.style.color = 'white';
    div.style.padding = '10px 20px';
    div.style.borderRadius = '2rem';
    div.style.zIndex = '9999';
    document.body.appendChild(div);
    setTimeout(function() { div.remove(); }, 3000);
}

function escapeHtmlAdmin(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ============================================================
//  مدیریت کاربران
// ============================================================

async function loadUsers() {
    try {
        var res = await apiCall('get_users');
        if (!res.success) return;
        var tbody = document.querySelector('#usersTable tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        for (var i = 0; i < res.users.length; i++) {
            var user = res.users[i];
            var row = tbody.insertRow();
            var roleOptions = '';
            if (user.role === 'admin') {
                roleOptions = '<option value="admin" selected>' + tAdmin('roleAdmin') + '</option><option value="user">' + tAdmin('roleUser') + '</option>';
            } else {
                roleOptions = '<option value="admin">' + tAdmin('roleAdmin') + '</option><option value="user" selected>' + tAdmin('roleUser') + '</option>';
            }
            var statusOptions = '';
            if (user.status === 'active') {
                statusOptions = '<option value="active" selected>' + tAdmin('statusActive') + '</option><option value="inactive">' + tAdmin('statusInactive') + '</option>';
            } else {
                statusOptions = '<option value="active">' + tAdmin('statusActive') + '</option><option value="inactive" selected>' + tAdmin('statusInactive') + '</option>';
            }
            row.innerHTML = `
                <td>${escapeHtmlAdmin(user.fullname)}</td>
                <td>${escapeHtmlAdmin(user.email)}</td>
                <td><select class="role-select" data-id="${user.id}">${roleOptions}</select></td>
                <td><select class="status-select" data-id="${user.id}">${statusOptions}</select></td>
                <td><button class="btn-view-logs" data-id="${user.id}" data-name="${escapeHtmlAdmin(user.fullname)}">📋 ${tAdmin('activities')}</button></td>
                <td><button class="btn-reset-password" data-id="${user.id}" data-name="${escapeHtmlAdmin(user.fullname)}">🔑 ${tAdmin('resetPassword')}</button></td>
                <td><button class="btn-danger delete-user" data-id="${user.id}">🗑️</button></td>
            `;
        }
        attachUserEvents();
    } catch (e) {
        console.error('خطا در loadUsers:', e);
    }
}

function attachUserEvents() {
    var roleSelects = document.querySelectorAll('.role-select');
    for (var i = 0; i < roleSelects.length; i++) {
        roleSelects[i].addEventListener('change', async function() {
            var result = await apiCall('update_user', { id: this.dataset.id, role: this.value }, 'POST');
            if (result.success) {
                showMessage(tAdmin('userUpdated'), false);
                loadUsers();
                loadStats();
            } else showMessage(result.message || 'خطا', true);
        });
    }
    var statusSelects = document.querySelectorAll('.status-select');
    for (var i = 0; i < statusSelects.length; i++) {
        statusSelects[i].addEventListener('change', async function() {
            var result = await apiCall('update_user', { id: this.dataset.id, status: this.value }, 'POST');
            if (result.success) {
                showMessage(tAdmin('userUpdated'), false);
                loadUsers();
                loadStats();
            } else showMessage(result.message || 'خطا', true);
        });
    }
    var delBtns = document.querySelectorAll('.delete-user');
    for (var i = 0; i < delBtns.length; i++) {
        delBtns[i].addEventListener('click', async function() {
            if (confirm(tAdmin('confirmDelete'))) {
                var result = await apiCall('delete_user', { id: this.dataset.id }, 'POST');
                if (result.success) {
                    showMessage(tAdmin('userDeleted'), false);
                    loadUsers();
                    loadStats();
                } else showMessage(result.message || 'خطا', true);
            }
        });
    }
    var resetBtns = document.querySelectorAll('.btn-reset-password');
    for (var i = 0; i < resetBtns.length; i++) {
        resetBtns[i].addEventListener('click', function() {
            var userId = this.dataset.id;
            var userName = this.dataset.name;
            var newPassword = prompt(tAdmin('enterNewPassword') + ' (' + userName + ')');
            if (newPassword && newPassword.length >= 6) {
                apiCall('reset_password', { id: userId, new_password: newPassword }, 'POST').then(function(res) {
                    if (res.success) { showMessage(tAdmin('passwordChanged'), false); } else { showMessage(res.message || 'خطا', true); }
                });
            } else if (newPassword !== null) {
                showMessage(tAdmin('shortPassword'), true);
            }
        });
    }
    var viewLogsBtns = document.querySelectorAll('.btn-view-logs');
    for (var i = 0; i < viewLogsBtns.length; i++) {
        viewLogsBtns[i].addEventListener('click', function() {
            var userId = this.dataset.id;
            var userName = this.dataset.name;
            showUserLogsModal(userId, userName);
        });
    }
}

function showUserLogsModal(userId, userName) {
    var modalHtml = `
        <div id="logsModal" class="modal" style="display: flex;">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>${tAdmin('activities')} : ${escapeHtmlAdmin(userName)}</h3>
                    <span class="modal-close" id="closeLogsModal">&times;</span>
                </div>
                <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
                    <div id="logsList">در حال بارگذاری...</div>
                </div>
                <div class="modal-footer">
                    <button id="clearAllLogsBtn" class="btn-danger">${tAdmin('clearAllLogs')}</button>
                    <button id="closeLogsModalBtn" class="btn cancel-btn">${tAdmin('close')}</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    var modal = document.getElementById('logsModal');
    loadUserLogs(userId);
    document.getElementById('closeLogsModal').onclick = function() { modal.remove(); };
    document.getElementById('closeLogsModalBtn').onclick = function() { modal.remove(); };
    document.getElementById('clearAllLogsBtn').onclick = async function() {
        if (confirm('همه لاگ‌های این کاربر پاک شود؟')) {
            var res = await apiCall('clear_user_logs', { user_id: userId }, 'POST');
            if (res.success) {
                showMessage('لاگ‌ها پاک شدند', false);
                loadUserLogs(userId);
            } else showMessage(res.message, true);
        }
    };
    window.onclick = function(e) { if (e.target === modal) modal.remove(); };
}

async function loadUserLogs(userId) {
    var res = await apiCall('get_user_logs', { user_id: userId }, 'GET');
    var container = document.getElementById('logsList');
    if (!container) return;
    if (!res.success) {
        container.innerHTML = '<div class="error-msg">خطا در دریافت لاگ‌ها: ' + (res.message || '') + '</div>';
        return;
    }
    if (res.logs.length === 0) {
        container.innerHTML = '<div class="empty-message">هیچ فعالیتی ثبت نشده است.</div>';
        return;
    }
    var html = '<table style="width:100%; border-collapse:collapse; text-align:right;"><thead><th>' + tAdmin('time') + '</th><th>' + tAdmin('action') + '</th><th>' + tAdmin('ip') + '</th><th>' + tAdmin('browser') + '</th><th></th></thead><tbody>';
    for (var i = 0; i < res.logs.length; i++) {
        var log = res.logs[i];
        var actionFa = log.action === 'login' ? 'ورود' : 'خروج';
        var date = new Date(log.created_at).toLocaleString('fa-IR');
        html += '<tr>' +
            '<td style="padding:6px;">' + escapeHtmlAdmin(date) + '</td>' +
            '<td>' + actionFa + '</td>' +
            '<td>' + escapeHtmlAdmin(log.ip_address || '-') + '</td>' +
            '<td style="max-width:200px; overflow:hidden; text-overflow:ellipsis;" title="' + escapeHtmlAdmin(log.user_agent || '') + '">' + escapeHtmlAdmin(log.user_agent ? log.user_agent.substring(0, 50) + '...' : '-') + '</td>' +
            '<td><button class="delete-single-log" data-id="' + log.id + '" style="background:#ef4444; border:none; border-radius:50%; width:28px; height:28px; color:white; cursor:pointer;">✖</button></td>' +
            '</tr>';
    }
    html += '</tbody></table>';
    container.innerHTML = html;
    var delSingleBtns = document.querySelectorAll('.delete-single-log');
    for (var j = 0; j < delSingleBtns.length; j++) {
        delSingleBtns[j].addEventListener('click', async function(e) {
            e.stopPropagation();
            var logId = this.dataset.id;
            if (confirm('این لاگ حذف شود؟')) {
                var resDel = await apiCall('delete_user_log', { log_id: logId }, 'POST');
                if (resDel.success) {
                    showMessage('لاگ حذف شد', false);
                    loadUserLogs(userId);
                } else showMessage(resDel.message, true);
            }
        });
    }
}

function showAddUserModal() {
    var modal = document.getElementById('addUserModal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.getElementById('newFullname').value = '';
    document.getElementById('newEmail').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('newRole').value = 'user';
    document.getElementById('newStatus').value = 'active';
    document.getElementById('modalError').style.display = 'none';
}

function hideAddUserModal() {
    var modal = document.getElementById('addUserModal');
    if (modal) modal.style.display = 'none';
}

async function submitAddUser() {
    var fullname = document.getElementById('newFullname').value.trim();
    var email = document.getElementById('newEmail').value.trim();
    var password = document.getElementById('newPassword').value.trim();
    var role = document.getElementById('newRole').value;
    var status = document.getElementById('newStatus').value;
    var errorDiv = document.getElementById('modalError');
    if (!fullname || !email || !password) {
        errorDiv.innerText = tAdmin('allFieldsRequired');
        errorDiv.style.display = 'block';
        return;
    }
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorDiv.innerText = tAdmin('invalidEmail');
        errorDiv.style.display = 'block';
        return;
    }
    if (password.length < 6) {
        errorDiv.innerText = tAdmin('shortPassword');
        errorDiv.style.display = 'block';
        return;
    }
    var result = await apiCall('add_user', { fullname: fullname, email: email, password: password, role: role, status: status }, 'POST');
    if (result.success) {
        showMessage(tAdmin('userAdded'), false);
        hideAddUserModal();
        loadUsers();
        loadStats();
    } else {
        errorDiv.innerText = result.message || 'خطا در افزودن کاربر';
        errorDiv.style.display = 'block';
    }
}

// ============================================================
//  آمار
// ============================================================

async function loadStats() {
    try {
        var res = await apiCall('get_stats');
        if (!res.success) return;
        document.getElementById('statTotalUsers').innerText = res.stats.totalUsers;
        document.getElementById('statActiveUsers').innerText = res.stats.activeUsers;
        document.getElementById('statTodayVisits').innerText = res.stats.todayVisits;
        document.getElementById('statActiveTools').innerText = res.stats.activeTools;
    } catch (e) {
        console.warn('خطا در loadStats:', e);
    }
}

// ============================================================
//  مدیریت ابزارها
// ============================================================

var currentToolsState = {};

async function loadTools() {
    try {
        var res = await apiCall('get_tools');
        if (!res.success) return;
        var container = document.getElementById('toolsListContainer');
        if (!container) return;
        var toolsData = [
            { id: 'home', icon: '🏠', key: 'tool_home' },
            { id: 'calculator', icon: '🧮', key: 'tool_calculator' },
            { id: 'password', icon: '🔐', key: 'tool_password' },
            { id: 'videoplayer', icon: '🎬', key: 'tool_videoplayer' },
            { id: 'filemanager', icon: '📂', key: 'tool_filemanager' },
            { id: 'colorpicker', icon: '🎨', key: 'tool_colorpicker' },
            { id: 'textunit', icon: '📊', key: 'tool_textunit' },
            { id: 'smarteditor', icon: '📝', key: 'tool_smarteditor' },
            { id: 'timer', icon: '⏱️', key: 'tool_timer' },
            { id: 'musicplayer', icon: '🎵', key: 'tool_musicplayer' }
        ];
        container.innerHTML = '';
        var grid = document.createElement('div');
        grid.className = 'tools-grid';
        for (var i = 0; i < toolsData.length; i++) {
            var tool = toolsData[i];
            var enabled = (res.tools[tool.id] !== undefined) ? res.tools[tool.id] : true;
            currentToolsState[tool.id] = enabled;
            var toolName = tAdmin(tool.key);
            var card = document.createElement('div');
            card.className = 'tool-card';
            card.innerHTML = '<div class="tool-info"><div class="tool-icon">' + tool.icon + '</div><div class="tool-name">' + toolName + '</div></div><label class="switch"><input type="checkbox" class="tool-toggle" data-tool="' + tool.id + '"' + (enabled ? ' checked' : '') + '><span class="slider"></span></label>';
            grid.appendChild(card);
        }
        container.appendChild(grid);
        var toggles = document.querySelectorAll('.tool-toggle');
        for (var j = 0; j < toggles.length; j++) {
            toggles[j].addEventListener('change', function() {
                var toolId = this.getAttribute('data-tool');
                currentToolsState[toolId] = this.checked;
            });
        }
    } catch (e) {
        console.warn('خطا در loadTools:', e);
    }
}

var saveToolsBtn = document.getElementById('saveToolsBtn');
if (saveToolsBtn) {
    saveToolsBtn.addEventListener('click', async function() {
        for (var tid in currentToolsState) {
            if (currentToolsState.hasOwnProperty(tid)) {
                await apiCall('update_tool', { tool_id: tid, enabled: currentToolsState[tid] ? 1 : 0 }, 'POST');
            }
        }
        showMessage('تغییرات ابزارها ذخیره شد', false);
        loadStats();
    });
}

var resetToolsBtn = document.getElementById('resetToolsBtn');
if (resetToolsBtn) {
    resetToolsBtn.addEventListener('click', async function() {
        var toolsList = ['home', 'calculator', 'password', 'videoplayer', 'filemanager', 'colorpicker', 'textunit', 'smarteditor', 'timer', 'musicplayer'];
        for (var i = 0; i < toolsList.length; i++) {
            await apiCall('update_tool', { tool_id: toolsList[i], enabled: 1 }, 'POST');
            currentToolsState[toolsList[i]] = true;
        }
        loadTools();
        loadStats();
        showMessage('تمامی ابزارها فعال شدند', false);
    });
}

// ============================================================
//  تنظیمات عمومی
// ============================================================

async function loadSettings() {
    try {
        var res = await apiCall('get_settings');
        if (!res.success) return;
        document.getElementById('siteTitleFa').value = res.settings.site_title_fa || 'مرکز مهندس';
        document.getElementById('siteTitleEn').value = res.settings.site_title_en || 'EngineerHub';
        document.getElementById('siteSloganFa').value = res.settings.site_slogan_fa || 'دروازه تخصصی مهندسان';
        document.getElementById('siteSloganEn').value = res.settings.site_slogan_en || 'Engineers\' Gateway';
        document.getElementById('primaryColor').value = res.settings.primary_color || '#00e5e5';
    } catch (e) {
        console.warn('خطا در loadSettings:', e);
    }
}

var saveSettingsBtn = document.getElementById('saveSettingsBtn');
if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', async function() {
        var data = {
            site_title_fa: document.getElementById('siteTitleFa').value,
            site_title_en: document.getElementById('siteTitleEn').value,
            site_slogan_fa: document.getElementById('siteSloganFa').value,
            site_slogan_en: document.getElementById('siteSloganEn').value,
            primary_color: document.getElementById('primaryColor').value
        };
        await apiCall('save_settings', data, 'POST');
        showMessage('تنظیمات ذخیره شد', false);
    });
}

var resetSettingsBtn = document.getElementById('resetSettingsBtn');
if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener('click', async function() {
        if (confirm('آیا مطمئن هستید که می‌خواهید تمام تنظیمات عمومی را به حالت اولیه بازگردانید؟')) {
            var res = await apiCall('reset_settings', {}, 'POST');
            if (res.success) {
                showMessage('تنظیمات با موفقیت به حالت اولیه بازگشت', false);
                loadSettings();
                setTimeout(function() { location.reload(); }, 1500);
            } else {
                showMessage(res.message || 'خطا در بازنشانی تنظیمات', true);
            }
        }
    });
}

// ============================================================
//  مدیریت آلبوم‌ها
// ============================================================

var currentAlbumIdForEdit = null;

async function loadAlbums() {
    try {
        var res = await apiCall('get_albums');
        if (!res.success) return;
        renderAlbumsList(res.albums);
    } catch (e) {
        console.warn('خطا در loadAlbums:', e);
    }
}

function renderAlbumsList(albums) {
    var container = document.getElementById('albumsContainer');
    if (!container) return;
    container.innerHTML = '';
    for (var i = 0; i < albums.length; i++) {
        var album = albums[i];
        var card = document.createElement('div');
        card.className = 'album-card';
        card.innerHTML = '<div class="album-header"><div><strong>' + escapeHtmlAdmin(album.name_fa) + ' (' + escapeHtmlAdmin(album.name_en) + ')</strong> - ' + escapeHtmlAdmin(album.artist_fa) + '</div><div><button class="edit-album-btn" data-id="' + album.id + '" title="ویرایش آلبوم">✏️</button><button class="btn-danger delete-album" data-id="' + album.id + '">🗑️ حذف آلبوم</button></div></div><div class="songs-list" id="songs-' + album.id + '"></div><button class="btn add-song-btn" data-album="' + album.id + '">➕ افزودن آهنگ (ساده)</button>';
        container.appendChild(card);
        var songsDiv = document.getElementById('songs-' + album.id);
        if (album.songs && album.songs.length) {
            for (var j = 0; j < album.songs.length; j++) {
                var song = album.songs[j];
                var songRow = document.createElement('div');
                songRow.className = 'song-item';
                songRow.innerHTML = '<input type="text" value="' + escapeHtmlAdmin(song.title_fa) + '" class="song-title-fa" data-id="' + song.id + '" data-album="' + album.id + '" placeholder="عنوان فارسی"><input type="text" value="' + escapeHtmlAdmin(song.title_en) + '" class="song-title-en" data-id="' + song.id + '" data-album="' + album.id + '" placeholder="عنوان انگلیسی"><input type="text" value="' + escapeHtmlAdmin(song.url) + '" class="song-url" data-id="' + song.id + '" data-album="' + album.id + '" placeholder="لینک"><button class="btn-danger delete-song" data-id="' + song.id + '">🗑️</button>';
                songsDiv.appendChild(songRow);
            }
        }
    }
    attachAlbumEvents();
}

function attachAlbumEvents() {
    var editBtns = document.querySelectorAll('.edit-album-btn');
    for (var i = 0; i < editBtns.length; i++) {
        editBtns[i].addEventListener('click', function() { openAlbumModalForEdit(this.getAttribute('data-id')); });
    }
    var delAlbumBtns = document.querySelectorAll('.delete-album');
    for (var i = 0; i < delAlbumBtns.length; i++) {
        delAlbumBtns[i].addEventListener('click', async function() {
            if (confirm(tAdmin('confirmDeleteAlbum'))) {
                var res = await apiCall('delete_album', { id: this.dataset.id }, 'POST');
                if (res.success) {
                    showMessage(tAdmin('albumDeleted'), false);
                    loadAlbums();
                } else showMessage(res.message || 'خطا', true);
            }
        });
    }
    var addSongBtns = document.querySelectorAll('.add-song-btn');
    for (var i = 0; i < addSongBtns.length; i++) {
        addSongBtns[i].addEventListener('click', async function() {
            await apiCall('save_song', { album_id: this.dataset.album, title_fa: 'آهنگ جدید', title_en: 'New Song', url: '#', order: 999 }, 'POST');
            loadAlbums();
        });
    }
    var songInputs = document.querySelectorAll('.song-title-fa, .song-title-en, .song-url');
    for (var i = 0; i < songInputs.length; i++) {
        songInputs[i].addEventListener('change', async function() {
            var id = this.dataset.id;
            var albumId = this.dataset.album;
            var titleFa = document.querySelector('.song-title-fa[data-id="' + id + '"]').value;
            var titleEn = document.querySelector('.song-title-en[data-id="' + id + '"]').value;
            var url = document.querySelector('.song-url[data-id="' + id + '"]').value;
            await apiCall('save_song', { id: id, album_id: albumId, title_fa: titleFa, title_en: titleEn, url: url }, 'POST');
            showMessage('آهنگ به‌روز شد', false);
        });
    }
    var delSongBtns = document.querySelectorAll('.delete-song');
    for (var i = 0; i < delSongBtns.length; i++) {
        delSongBtns[i].addEventListener('click', async function() {
            if (confirm(tAdmin('confirmDeleteSong'))) {
                await apiCall('delete_song', { id: this.dataset.id }, 'POST');
                loadAlbums();
            }
        });
    }
}

function openAlbumModalForEdit(albumId) {
    currentAlbumIdForEdit = albumId;
    document.getElementById('albumModalTitle').innerText = '✏️ ویرایش آلبوم';
    document.getElementById('editAlbumId').value = albumId;
    apiCall('get_albums').then(function(res) {
        if (!res.success) { showMessage('خطا در بارگذاری آلبوم', true); return; }
        var album = null;
        for (var i = 0; i < res.albums.length; i++) {
            if (res.albums[i].id == albumId) { album = res.albums[i]; break; }
        }
        if (!album) { showMessage('آلبوم یافت نشد', true); return; }
        document.getElementById('albumNameFa').value = album.name_fa || '';
        document.getElementById('albumNameEn').value = album.name_en || '';
        document.getElementById('albumArtistFa').value = album.artist_fa || '';
        document.getElementById('albumArtistEn').value = album.artist_en || '';
        document.getElementById('albumImagePath').value = album.image_path || '';
        var container = document.getElementById('songsListContainer');
        container.innerHTML = '';
        if (album.songs && album.songs.length) {
            for (var j = 0; j < album.songs.length; j++) {
                addSongRowToModal(album.songs[j].title_fa, album.songs[j].title_en, album.songs[j].url, album.songs[j].id);
            }
        } else { addSongRowToModal('', '', '', null); }
        document.getElementById('albumModal').style.display = 'flex';
    });
}

function openAlbumModalForNew() {
    currentAlbumIdForEdit = null;
    document.getElementById('albumModalTitle').innerText = '➕ افزودن آلبوم جدید';
    document.getElementById('editAlbumId').value = '';
    document.getElementById('albumNameFa').value = '';
    document.getElementById('albumNameEn').value = '';
    document.getElementById('albumArtistFa').value = '';
    document.getElementById('albumArtistEn').value = '';
    document.getElementById('albumImagePath').value = 'assests/images/default-album.jpg';
    document.getElementById('songsListContainer').innerHTML = '';
    addSongRowToModal('', '', '', null);
    document.getElementById('albumModal').style.display = 'flex';
}

function addSongRowToModal(titleFa, titleEn, url, songId) {
    titleFa = titleFa || '';
    titleEn = titleEn || '';
    url = url || '';
    var container = document.getElementById('songsListContainer');
    var rowDiv = document.createElement('div');
    rowDiv.className = 'song-row';
    if (songId) rowDiv.setAttribute('data-song-id', songId);
    rowDiv.innerHTML = '<input type="text" class="song-fa" placeholder="عنوان فارسی" value="' + escapeHtmlAdmin(titleFa) + '"><input type="text" class="song-en" placeholder="عنوان انگلیسی" value="' + escapeHtmlAdmin(titleEn) + '"><input type="text" class="song-url" placeholder="لینک آهنگ" value="' + escapeHtmlAdmin(url) + '"><button class="remove-song-btn" type="button">✖</button>';
    rowDiv.querySelector('.remove-song-btn').addEventListener('click', function() { rowDiv.remove(); });
    container.appendChild(rowDiv);
}

async function saveAlbumFromModal() {
    var id = document.getElementById('editAlbumId').value;
    var nameFa = document.getElementById('albumNameFa').value.trim();
    var nameEn = document.getElementById('albumNameEn').value.trim();
    var artistFa = document.getElementById('albumArtistFa').value.trim();
    var artistEn = document.getElementById('albumArtistEn').value.trim();
    var imagePath = document.getElementById('albumImagePath').value.trim() || 'assests/images/default-album.jpg';
    var errorDiv = document.getElementById('albumModalError');
    if (!nameFa || !nameEn) {
        errorDiv.innerText = 'نام آلبوم (فارسی و انگلیسی) الزامی است';
        errorDiv.style.display = 'block';
        return;
    }
    errorDiv.style.display = 'none';
    var albumRes = await apiCall('save_album', { id: id || null, name_fa: nameFa, name_en: nameEn, artist_fa: artistFa, artist_en: artistEn, image_path: imagePath }, 'POST');
    if (!albumRes.success) {
        errorDiv.innerText = albumRes.message || 'خطا در ذخیره آلبوم';
        errorDiv.style.display = 'block';
        return;
    }
    var albumId = albumRes.album_id;
    var songRows = document.querySelectorAll('#songsListContainer .song-row');
    for (var i = 0; i < songRows.length; i++) {
        var row = songRows[i];
        var titleFa = row.querySelector('.song-fa').value.trim();
        var titleEn = row.querySelector('.song-en').value.trim();
        var url = row.querySelector('.song-url').value.trim();
        if (!titleFa && !titleEn && !url) continue;
        if (!titleFa) titleFa = 'بدون عنوان';
        if (!titleEn) titleEn = 'Untitled';
        if (!url) url = '#';
        var songId = row.getAttribute('data-song-id');
        await apiCall('save_song', { id: songId || null, album_id: albumId, title_fa: titleFa, title_en: titleEn, url: url, order: i }, 'POST');
    }
    showMessage(tAdmin('albumSaved'), false);
    closeAlbumModal();
    loadAlbums();
}

function closeAlbumModal() {
    document.getElementById('albumModal').style.display = 'none';
    currentAlbumIdForEdit = null;
}

// ============================================================
//  کاتالوگ ادمین
// ============================================================

const adminCatalog = {
    users: {
        fa: { title: "👥 مدیریت کاربران", description: "در این بخش می‌توانید کاربران سیستم را مشاهده، افزودن، ویرایش و حذف کنید.", features: ["مشاهده لیست کاربران با اطلاعات کامل", "افزودن کاربر جدید (نام، ایمیل، رمز عبور، نقش، وضعیت)", "تغییر نقش (ادمین/کاربر عادی) و وضعیت (فعال/غیرفعال)", "تغییر رمز عبور کاربران", "مشاهده فعالیت‌ها (لاگ) ورود و خروج کاربران"] },
        en: { title: "👥 User Management", description: "In this section you can view, add, edit and delete system users.", features: ["View list of users with full details", "Add new user (name, email, password, role, status)", "Change role (admin/user) and status (active/inactive)", "Reset user password", "View user login/logout activities"] }
    },
    stats: {
        fa: { title: "📊 آمار و نمودارها", description: "آمار کلی سیستم شامل تعداد کاربران، بازدیدها و ابزارهای فعال.", features: ["تعداد کل کاربران ثبت‌نام شده", "تعداد کاربران فعال (وضعیت فعال)", "بازدید امروز (تخمینی از بازدیدهای روزانه)", "تعداد ابزارهای فعال در سایت"] },
        en: { title: "📊 Statistics", description: "System overview including user counts, visits, and active tools.", features: ["Total registered users", "Number of active users", "Today's visits (estimated daily visits)", "Number of active tools on the site"] }
    },
    tools: {
        fa: { title: "🛠️ مدیریت ابزارها", description: "فعال یا غیرفعال کردن هر یک از ابزارهای موجود در سایت.", features: ["لیست تمام ابزارها با وضعیت فعلی", "تغییر وضعیت با سوییچ (فعال/غیرفعال)", "ذخیره تغییرات با یک کلیک", "بازنشانی به حالت پیش‌فرض (همه ابزارها فعال)"] },
        en: { title: "🛠️ Tools Management", description: "Enable or disable any tool on the site.", features: ["List of all tools with current status", "Toggle status with switch (enable/disable)", "Save changes with one click", "Reset to default (all tools enabled)"] }
    },
    settings: {
        fa: { title: "⚙️ تنظیمات عمومی", description: "تنظیمات ظاهری و متنی سایت.", features: ["عنوان سایت (فارسی و انگلیسی)", "شعار سایت (فارسی و انگلیسی)", "رنگ اصلی سایت (hex code)", "ذخیره تنظیمات و بازگشت به حالت اولیه"] },
        en: { title: "⚙️ General Settings", description: "Site appearance and text settings.", features: ["Site title (Persian and English)", "Site slogan (Persian and English)", "Primary color (hex code)", "Save settings and reset to default"] }
    },
    albums: {
        fa: { title: "🎵 مدیریت آلبوم‌ها", description: "مدیریت آلبوم‌های موسیقی آنلاین و آهنگ‌های مربوطه.", features: ["مشاهده لیست آلبوم‌ها با تصویر و آهنگ‌ها", "افزودن، ویرایش و حذف آلبوم", "افزودن، ویرایش و حذف آهنگ‌های هر آلبوم", "همگام‌سازی آلبوم‌ها از localStorage مرورگر به دیتابیس"] },
        en: { title: "🎵 Albums Management", description: "Manage online music albums and their songs.", features: ["View list of albums with image and songs", "Add, edit, delete albums", "Add, edit, delete songs per album", "Sync albums from browser localStorage to database"] }
    }
};

function showAdminCatalog(tabId) {
    var seenKey = 'catalog_admin_' + tabId;
    if (sessionStorage.getItem(seenKey) === 'true') return;
    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fa';
    var data = adminCatalog[tabId] ? (adminCatalog[tabId][lang] || adminCatalog[tabId].fa) : null;
    if (!data) return;
    var overlay = document.createElement('div');
    overlay.className = 'catalog-overlay';
    var featuresHtml = '<ul class="catalog-features">';
    for (var i = 0; i < data.features.length; i++) {
        featuresHtml += '<li>' + escapeHtmlAdmin(data.features[i]) + '</li>';
    }
    if (tabId === 'users') {
        if (lang === 'fa') {
            featuresHtml += '<li class="catalog-no-bullet" style="display: flex; align-items: center; gap: 8px; color: #e2e8f0;"><span class="catalog-badge" style="background: #ef4444; color: white; font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 2rem; font-weight: bold;">نکته</span> <span>تغییر زبان: با کلیک روی EN/FA در هدر، متن‌ها عوض می‌شوند.</span></li>';
            featuresHtml += '<li class="catalog-no-bullet" style="display: flex; align-items: center; gap: 8px; color: #e2e8f0;"><span class="catalog-badge" style="background: #ef4444; color: white; font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 2rem; font-weight: bold;">نکته</span> <span>حالت آنلاین/آفلاین: سوییچ کنار EN/FA. در حالت آنلاین آیکون‌های FontAwesome، در آفلاین اموجی نمایش داده می‌شوند.</span></li>';
            featuresHtml += '<li class="catalog-no-bullet" style="display: flex; align-items: center; gap: 8px; color: #e2e8f0;"><span class="catalog-badge" style="background: #ef4444; color: white; font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 2rem; font-weight: bold;">نکته</span> <span>بازگشت به خانه: دکمه «🏠 بازگشت به خانه» در سمت چپ هدر شما را به صفحه اصلی می‌برد.</span></li>';
        } else {
            featuresHtml += '<li class="catalog-no-bullet" style="display: flex; align-items: center; gap: 8px; color: #e2e8f0;"><span class="catalog-badge" style="background: #ef4444; color: white; font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 2rem; font-weight: bold;">Tip</span> <span>Language switch: Click EN/FA in header to change UI language.</span></li>';
            featuresHtml += '<li class="catalog-no-bullet" style="display: flex; align-items: center; gap: 8px; color: #e2e8f0;"><span class="catalog-badge" style="background: #ef4444; color: white; font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 2rem; font-weight: bold;">Tip</span> <span>Online/Offline mode: Toggle next to EN/FA. Online loads FontAwesome icons, offline shows emojis.</span></li>';
            featuresHtml += '<li class="catalog-no-bullet" style="display: flex; align-items: center; gap: 8px; color: #e2e8f0;"><span class="catalog-badge" style="background: #ef4444; color: white; font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 2rem; font-weight: bold;">Tip</span> <span>Back to Home: The "🏠 Back to Home" button on the left side of header returns to main page.</span></li>';
        }
    }
    featuresHtml += '</ul>';
    var styleTag = '<style>.catalog-features li.catalog-no-bullet::before { content: none !important; display: none !important; }</style>';
    var projectText = (lang === 'fa') ?
        "پروژه «مرکز مهندس | EngineerHub» یک داشبورد تحت وب با طراحی شیشه‌ای، دوزبانه و ابزارهای کاربردی است که توسط محمد شیروانی طراحی شده است." :
        "The 'EngineerHub' project is a web dashboard with glassmorphism design, bilingual (Persian/English) and useful tools, designed by Mohammad Shiravani.";
    overlay.innerHTML = '<div class="catalog-card">' +
        '<div class="catalog-icon">' + escapeHtmlAdmin(data.title.split(' ')[0]) + '</div>' +
        '<div class="catalog-title">' + escapeHtmlAdmin(data.title) + '</div>' +
        '<div class="catalog-description">' + escapeHtmlAdmin(data.description) + '</div>' +
        featuresHtml +
        '<div class="catalog-credit" style="margin-top: 16px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.75rem; color: #94a3b8; text-align: center;">' + escapeHtmlAdmin(projectText) + '</div>' +
        '<button class="catalog-btn">✓ خواندم و تأیید میکنم</button>' +
        '</div>' +
        styleTag;
    document.body.appendChild(overlay);
    var btn = overlay.querySelector('.catalog-btn');
    btn.addEventListener('click', function() {
        sessionStorage.setItem(seenKey, 'true');
        overlay.remove();
    });
    overlay.addEventListener('click', function(e) { e.stopPropagation(); });
    var card = overlay.querySelector('.catalog-card');
    if (card) card.addEventListener('click', function(e) { e.stopPropagation(); });
}

// ============================================================
//  رویدادهای اولیه (با مدیریت خطا)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    try {
        // ---- دکمه‌های افزودن کاربر ----
        var addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) addUserBtn.onclick = showAddUserModal;
        var confirmUserBtn = document.getElementById('confirmAddUserBtn');
        if (confirmUserBtn) confirmUserBtn.onclick = submitAddUser;
        var cancelUserBtn = document.getElementById('cancelAddUserBtn');
        if (cancelUserBtn) cancelUserBtn.onclick = hideAddUserModal;
        var closeUserSpan = document.getElementById('closeModalBtn');
        if (closeUserSpan) closeUserSpan.onclick = hideAddUserModal;

        // ---- دکمه‌های آلبوم ----
        var addAlbumBtn = document.getElementById('addAlbumBtn');
        if (addAlbumBtn) addAlbumBtn.onclick = openAlbumModalForNew;
        var saveAlbumBtn = document.getElementById('saveAlbumBtn');
        if (saveAlbumBtn) saveAlbumBtn.onclick = saveAlbumFromModal;
        var cancelAlbumBtn = document.getElementById('cancelAlbumBtn');
        if (cancelAlbumBtn) cancelAlbumBtn.onclick = closeAlbumModal;
        var closeAlbumSpan = document.getElementById('closeAlbumModalBtn');
        if (closeAlbumSpan) closeAlbumSpan.onclick = closeAlbumModal;
        var addSongRowBtn = document.getElementById('addSongRowBtn');
        if (addSongRowBtn) addSongRowBtn.onclick = function() { addSongRowToModal('', '', '', null); };

        // ---- همگام‌سازی آلبوم‌ها ----
        var syncAlbumsBtn = document.getElementById('syncAlbumsBtn');
        if (syncAlbumsBtn) {
            syncAlbumsBtn.addEventListener('click', async function() {
                var albumsStr = localStorage.getItem('musicAlbums');
                if (!albumsStr) { alert('هیچ آلبومی در مرورگر یافت نشد.'); return; }
                try {
                    var albums = JSON.parse(albumsStr);
                    var res = await apiCall('sync_albums_from_localstorage', albums, 'POST');
                    alert(res.message || (res.success ? 'همگام‌سازی شد' : 'خطا'));
                    if (res.success) loadAlbums();
                } catch (e) { alert('خطا در خواندن localStorage'); }
            });
        }

        // ---- بستن مودال با کلیک روی پس‌زمینه ----
        window.onclick = function(event) {
            if (event.target === document.getElementById('addUserModal')) hideAddUserModal();
            if (event.target === document.getElementById('albumModal')) closeAlbumModal();
        };

        // ---- تب‌ها ----
        var panels = {
            users: document.getElementById('panel-users'),
            stats: document.getElementById('panel-stats'),
            tools: document.getElementById('panel-tools'),
            settings: document.getElementById('panel-settings'),
            albums: document.getElementById('panel-albums')
        };
        var tabBtns = document.querySelectorAll('.tab-btn');
        for (var i = 0; i < tabBtns.length; i++) {
            tabBtns[i].addEventListener('click', function() {
                var tab = this.getAttribute('data-tab');
                for (var j = 0; j < tabBtns.length; j++) { tabBtns[j].classList.remove('active'); }
                this.classList.add('active');
                for (var key in panels) { if (panels[key]) panels[key].classList.remove('active'); }
                if (panels[tab]) panels[tab].classList.add('active');
                if (tab === 'users') loadUsers();
                else if (tab === 'stats') loadStats();
                else if (tab === 'tools') loadTools();
                else if (tab === 'settings') loadSettings();
                else if (tab === 'albums') loadAlbums();
            });
        }

        // ---- دایره‌های EN/FA در ادمین ----
        var flagEn = document.getElementById('adminFlagEn');
        var flagFa = document.getElementById('adminFlagFa');
        if (flagEn) {
            flagEn.addEventListener('click', function() {
                setAdminLanguage('en');
            });
        }
        if (flagFa) {
            flagFa.addEventListener('click', function() {
                setAdminLanguage('fa');
            });
        }

        // ---- بارگذاری اولیه ----
        var savedLang = getStoredLanguage();
        setAdminLanguage(savedLang);

        // ---- نمایش کاتالوگ ادمین ----
        function showForCurrentTab() {
            var activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                var tabId = activeTab.getAttribute('data-tab') || 'users';
                setTimeout(function() { showAdminCatalog(tabId); }, 500);
            }
        }
        showForCurrentTab();

        // ---- کاتالوگ هنگام تغییر تب ----
        var allTabBtns = document.querySelectorAll('.tab-btn');
        for (var i = 0; i < allTabBtns.length; i++) {
            allTabBtns[i].addEventListener('click', function() {
                var tabId = this.getAttribute('data-tab');
                setTimeout(function() { showAdminCatalog(tabId); }, 200);
            });
        }

        console.log('✅ پنل مدیریت با موفقیت بارگذاری شد.');
    } catch (e) {
        console.error('❌ خطا در بارگذاری پنل مدیریت:', e);
    }
});

// بارگذاری اولیه داده‌ها (در صورت وجود)
setTimeout(function() {
    try {
        var activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            var tabId = activeTab.getAttribute('data-tab');
            if (tabId === 'users') loadUsers();
            else if (tabId === 'stats') loadStats();
            else if (tabId === 'tools') loadTools();
            else if (tabId === 'settings') loadSettings();
            else if (tabId === 'albums') loadAlbums();
        } else {
            loadUsers();
            loadStats();
            loadTools();
            loadSettings();
            loadAlbums();
        }
    } catch (e) {
        console.warn('خطا در بارگذاری اولیه داده‌ها:', e);
    }
}, 100);