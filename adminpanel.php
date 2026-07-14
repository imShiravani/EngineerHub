<?php
session_name('ENGINEERHUB_SESSION');
session_start();
require_once 'db.php';

$isAdmin = false;
if (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin') {
    $isAdmin = true;
} elseif (isset($_COOKIE['remember_token'])) {
    $token = $_COOKIE['remember_token'];
    $stmt = $pdo->prepare("SELECT user_sessions.user_id, users.role FROM user_sessions JOIN users ON user_sessions.user_id = users.id WHERE user_sessions.token = ? AND user_sessions.expires_at > NOW()");
    $stmt->execute([$token]);
    $row = $stmt->fetch();
    if ($row && $row['role'] === 'admin') {
        $_SESSION['user_id'] = $row['user_id'];
        $_SESSION['user_role'] = 'admin';
        $isAdmin = true;
    }
}
if (!$isAdmin) {
    header('Location: login.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>پنل مدیریت | مرکز مهندس</title>
    <link rel="stylesheet" href="assests/libs/bootstrap.min.css">
    <link rel="stylesheet" href="assests/css/admin.css">
    <link rel="stylesheet" href="assests/css/catalog.css">
    <style>
        /* استایل دایره‌های EN/FA در ادمین */
        .lang-circle {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.75rem;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.2s ease;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(4px);
            color: #e2e8f0;
            user-select: none;
        }
        .lang-circle.active {
            border-color: #00e5e5;
            box-shadow: 0 0 12px #00e5e5;
            background: rgba(0, 229, 229, 0.25);
            color: #00e5e5;
        }
        .lang-circle:hover {
            transform: scale(1.05);
            background: rgba(255, 255, 255, 0.2);
        }

        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .header-left {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
        }
        .back-home-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #00e5e5, #06b6d4);
            color: #0f172a;
            text-decoration: none;
            padding: 6px 16px;
            border-radius: 2rem;
            font-weight: 600;
            font-size: 0.85rem;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .back-home-btn:hover {
            transform: scale(1.02);
            background: linear-gradient(135deg, #22d3ee, #06b6d4);
            box-shadow: 0 4px 12px rgba(0, 229, 229, 0.4);
            color: #0f172a;
        }
    </style>
</head>

<body>
    <div class="admin-container">
        <div class="admin-header">
            <h1><span class="admin-logo">🛠️</span> پنل مدیریت | EngineerHub</h1>
            <div class="header-left">
                <div class="lang-switch" id="langSwitch">
                    <div class="lang-circle" data-lang="en" id="adminFlagEn">EN</div>
                    <div class="lang-circle active" data-lang="fa" id="adminFlagFa">FA</div>
                </div>
                <div class="online-toggle-admin" id="onlineToggleAdminContainer">
                    <span class="toggle-label offline-label">🌙 آفلاین</span>
                    <label class="switch">
                        <input type="checkbox" id="onlineModeToggleAdmin">
                        <span class="slider"></span>
                    </label>
                    <span class="toggle-label online-label">🌐 آنلاین</span>
                </div>
                <a href="index.php" class="back-home-btn">🏠 بازگشت به خانه</a>
            </div>
        </div>
        <div class="tabs">
            <button class="tab-btn active" data-tab="users">👥 مدیریت کاربران</button>
            <button class="tab-btn" data-tab="stats">📊 آمار و نمودارها</button>
            <button class="tab-btn" data-tab="tools">🛠️ مدیریت ابزارها</button>
            <button class="tab-btn" data-tab="settings">⚙️ تنظیمات عمومی</button>
            <button class="tab-btn" data-tab="albums">🎵 مدیریت آلبوم‌ها</button>
        </div>

        <div id="panel-users" class="panel active">
            <h2>👥 مدیریت کاربران</h2>
            <div class="table-responsive">
                <table id="usersTable">
                    <thead>
                        <th>نام</th>
                        <th>ایمیل</th>
                        <th>نقش</th>
                        <th>وضعیت</th>
                        <th>فعالیت‌ها</th>
                        <th>تغییر رمز</th>
                        <th>عملیات</th>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <button id="refreshUsersBtn" class="btn">🔄 بازخوانی کاربران</button>
                <button id="addUserBtn" class="btn">➕ افزودن کاربر</button>
            </div>
        </div>

        <div id="panel-stats" class="panel">
            <h2>📊 آمار و نمودارها</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number" id="statTotalUsers">0</div>
                    <p id="statTotalUsersLabel">کاربران کل</p>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="statActiveUsers">0</div>
                    <p id="statActiveUsersLabel">کاربران فعال</p>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="statTodayVisits">0</div>
                    <p id="statTodayVisitsLabel">بازدید امروز</p>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="statActiveTools">0</div>
                    <p id="statActiveToolsLabel">ابزار فعال</p>
                </div>
            </div>
        </div>

        <div id="panel-tools" class="panel">
            <h2>🛠️ مدیریت ابزارها</h2>
            <div id="toolsListContainer" class="tools-grid"></div>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <button id="saveToolsBtn" class="btn">💾 ذخیره تغییرات ابزارها</button>
                <button id="resetToolsBtn" class="btn reset-btn">🔁 بازنشانی پیش‌فرض</button>
            </div>
        </div>

        <div id="panel-settings" class="panel">
            <h2>⚙️ تنظیمات عمومی</h2>
            <div class="form-row"><label>عنوان سایت (فارسی)</label><input type="text" id="siteTitleFa" placeholder="عنوان فارسی"></div>
            <div class="form-row"><label>عنوان سایت (انگلیسی)</label><input type="text" id="siteTitleEn" placeholder="English Title"></div>
            <div class="form-row"><label>شعار (فارسی)</label><input type="text" id="siteSloganFa" placeholder="شعار فارسی"></div>
            <div class="form-row"><label>شعار (انگلیسی)</label><input type="text" id="siteSloganEn" placeholder="English Slogan"></div>
            <div class="form-row"><label>رنگ اصلی (hex)</label><input type="color" id="primaryColor" value="#00e5e5"></div>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button id="saveSettingsBtn" class="btn">💾 ذخیره تنظیمات</button>
                <button id="resetSettingsBtn" class="btn reset-btn">🔁 بازگشت به حالت اولیه</button>
            </div>
        </div>

        <div id="panel-albums" class="panel">
            <h2>🎵 مدیریت آلبوم‌های آنلاین</h2>
            <div style="margin-bottom: 1rem; display: flex; gap: 0.5rem;">
                <button id="syncAlbumsBtn" class="btn">🔄 همگام‌سازی از مرورگر</button>
                <button id="addAlbumBtn" class="btn">➕ افزودن آلبوم جدید</button>
            </div>
            <div id="albumsContainer"></div>
        </div>
    </div>

    <!-- مودال افزودن/ویرایش کاربر -->
    <div id="addUserModal" class="modal" style="display: none;">
        <div class="modal-content glass-modal">
            <div class="modal-header">
                <h3>➕ افزودن کاربر جدید</h3>
                <span class="modal-close" id="closeModalBtn">&times;</span>
            </div>
            <div class="modal-body">
                <div class="form-group"><label>نام کامل:</label><input type="text" id="newFullname" placeholder="نام و نام خانوادگی"></div>
                <div class="form-group"><label>ایمیل:</label><input type="email" id="newEmail" placeholder="example@domain.com"></div>
                <div class="form-group"><label>رمز عبور (حداقل ۶ کاراکتر):</label><input type="password" id="newPassword" placeholder="******"></div>
                <div class="form-group"><label>نقش:</label><select id="newRole">
                    <option value="user">کاربر عادی</option>
                    <option value="admin">مدیر</option>
                </select></div>
                <div class="form-group"><label>وضعیت:</label><select id="newStatus">
                    <option value="active">فعال</option>
                    <option value="inactive">غیرفعال</option>
                </select></div>
                <div id="modalError" class="error-msg" style="display: none;"></div>
            </div>
            <div class="modal-footer">
                <button class="btn" id="confirmAddUserBtn">✅ افزودن کاربر</button>
                <button class="btn cancel-btn" id="cancelAddUserBtn">لغو</button>
            </div>
        </div>
    </div>

    <!-- مودال افزودن/ویرایش آلبوم -->
    <div id="albumModal" class="modal" style="display: none;">
        <div class="modal-content glass-modal" style="max-width: 700px;">
            <div class="modal-header">
                <h3 id="albumModalTitle">➕ افزودن آلبوم جدید</h3>
                <span class="modal-close" id="closeAlbumModalBtn">&times;</span>
            </div>
            <div class="modal-body">
                <input type="hidden" id="editAlbumId" value="">
                <div class="form-row-grid">
                    <div class="form-group"><label>نام آلبوم (فارسی):</label><input type="text" id="albumNameFa" placeholder="مثلاً ذوزنقه"></div>
                    <div class="form-group"><label>نام آلبوم (انگلیسی):</label><input type="text" id="albumNameEn" placeholder="e.g. Zoozanaghe"></div>
                    <div class="form-group"><label>خواننده (فارسی):</label><input type="text" id="albumArtistFa" placeholder="مثلاً مهراد هیدن"></div>
                    <div class="form-group"><label>خواننده (انگلیسی):</label><input type="text" id="albumArtistEn" placeholder="e.g. Mehrad Hidden"></div>
                    <div class="form-group"><label>مسیر تصویر آلبوم:</label><input type="text" id="albumImagePath" placeholder="assests/images/album.jpg"></div>
                </div>
                <div class="songs-section">
                    <label>🎵 لیست آهنگ‌ها:</label>
                    <div id="songsListContainer" class="songs-dynamic-list"></div>
                    <button type="button" id="addSongRowBtn" class="btn-small">➕ افزودن آهنگ جدید</button>
                </div>
                <div id="albumModalError" class="error-msg" style="display: none;"></div>
            </div>
            <div class="modal-footer">
                <button class="btn" id="saveAlbumBtn">💾 ذخیره آلبوم</button>
                <button class="btn cancel-btn" id="cancelAlbumBtn">لغو</button>
            </div>
        </div>
    </div>

    <script src="assests/js/config.js" defer></script>
    <script src="assests/js/iconManager.js" defer></script>
    <script src="assests/js/admin.js" defer></script>
    <script src="assests/js/catalog.js" defer></script>
    <script>
        // ============================================================
        //  مدیریت زبان در ادمین پنل با دایره‌های EN/FA
        // ============================================================

        function getStoredLanguage() {
            var stored = localStorage.getItem('appLang');
            if (stored === 'en' || stored === 'fa') return stored;
            return 'fa';
        }

        function setStoredLanguage(lang) {
            localStorage.setItem('appLang', lang);
        }

        function setActiveCircle(lang) {
            var flagEn = document.getElementById('adminFlagEn');
            var flagFa = document.getElementById('adminFlagFa');
            if (!flagEn || !flagFa) return;
            if (lang === 'en') {
                flagEn.classList.add('active');
                flagFa.classList.remove('active');
            } else {
                flagFa.classList.add('active');
                flagEn.classList.remove('active');
            }
        }

        function setAdminLanguage(lang) {
            if (lang !== 'fa' && lang !== 'en') lang = 'fa';
            setStoredLanguage(lang);
            setActiveCircle(lang);
            if (typeof window.setLang === 'function') {
                window.setLang(lang);
            } else {
                if (typeof currentLang !== 'undefined') currentLang = lang;
                if (typeof applyLanguage === 'function') applyLanguage();
            }
        }

        // بارگذاری اولیه
        document.addEventListener('DOMContentLoaded', function() {
            var savedLang = getStoredLanguage();
            setActiveCircle(savedLang);
            if (typeof window.setLang === 'function') {
                window.setLang(savedLang);
            } else {
                if (typeof currentLang !== 'undefined') currentLang = savedLang;
                if (typeof applyLanguage === 'function') applyLanguage();
            }
        });

        // رویدادهای کلیک روی دایره‌ها
        var flagEn = document.getElementById('adminFlagEn');
        var flagFa = document.getElementById('adminFlagFa');

        if (flagEn) {
            flagEn.addEventListener('click', function() {
                setAdminLanguage('en');
                setActiveCircle('en');
            });
        }
        if (flagFa) {
            flagFa.addEventListener('click', function() {
                setAdminLanguage('fa');
                setActiveCircle('fa');
            });
        }

        // ============================================================
        //  مدیریت حالت آنلاین/آفلاین
        // ============================================================
        var onlineToggleAdmin = document.getElementById('onlineModeToggleAdmin');
        if (onlineToggleAdmin) {
            var savedMode = localStorage.getItem('onlineMode');
            if (savedMode === 'true') onlineToggleAdmin.checked = true;
            onlineToggleAdmin.addEventListener('change', function() {
                var isOnline = this.checked;
                localStorage.setItem('onlineMode', isOnline);
                fetch('api_set_online_mode.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ online: isOnline })
                }).catch(console.error);
                location.reload();
            });
        }
    </script>
</body>

</html>