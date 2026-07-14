<?php
session_name('ENGINEERHUB_SESSION');
session_start();
header('Content-Type: application/json');
require_once 'db.php';

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'دسترسی غیرمجاز']);
    exit;
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

try {
    switch ($action) {
        case 'get_users':
            $stmt = $pdo->query("SELECT id, fullname, email, role, status FROM users ORDER BY id DESC");
            echo json_encode(['success' => true, 'users' => $stmt->fetchAll()]);
            break;
        case 'add_user':
            $data = json_decode(file_get_contents('php://input'), true);
            $fullname = trim($data['fullname'] ?? '');
            $email = trim($data['email'] ?? '');
            $password = $data['password'] ?? '123456';
            $role = $data['role'] ?? 'user';
            $status = $data['status'] ?? 'active';
            if (!$fullname || !$email) {
                echo json_encode(['success' => false, 'message' => 'نام و ایمیل الزامی است']);
                break;
            }
            $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $check->execute([$email]);
            if ($check->fetch()) {
                echo json_encode(['success' => false, 'message' => 'این ایمیل قبلاً ثبت شده است']);
                break;
            }
            $hashed = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (fullname, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$fullname, $email, $hashed, $role, $status]);
            echo json_encode(['success' => true, 'message' => 'کاربر اضافه شد']);
            break;
        case 'update_user':
            $data = json_decode(file_get_contents('php://input'), true);
            $id = $data['id'] ?? 0;
            if (!$id) {
                echo json_encode(['success' => false, 'message' => 'شناسه کاربر نامعتبر']);
                break;
            }
            $updates = [];
            $params = [];
            if (isset($data['role'])) {
                $updates[] = "role = ?";
                $params[] = $data['role'];
            }
            if (isset($data['status'])) {
                $updates[] = "status = ?";
                $params[] = $data['status'];
            }
            if (empty($updates)) {
                echo json_encode(['success' => false, 'message' => 'هیچ فیلدی برای به‌روزرسانی نیست']);
                break;
            }
            $params[] = $id;
            $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            echo json_encode(['success' => true, 'message' => 'کاربر به‌روز شد']);
            break;
        case 'delete_user':
            $data = json_decode(file_get_contents('php://input'), true);
            $id = $data['id'] ?? 0;
            if ($id == $_SESSION['user_id']) {
                echo json_encode(['success' => false, 'message' => 'نمی‌توانید خودتان را حذف کنید']);
                break;
            }
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'کاربر حذف شد']);
            break;
        case 'reset_password':
            $data = json_decode(file_get_contents('php://input'), true);
            $id = $data['id'] ?? 0;
            $newPassword = $data['new_password'] ?? '';
            if (!$id || strlen($newPassword) < 6) {
                echo json_encode(['success' => false, 'message' => 'شناسه کاربر نامعتبر یا رمز کوتاه است (حداقل ۶ کاراکتر)']);
                break;
            }
            $hashed = password_hash($newPassword, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
            $stmt->execute([$hashed, $id]);
            echo json_encode(['success' => true, 'message' => 'رمز عبور با موفقیت تغییر کرد']);
            break;

        case 'get_user_logs':
            $userId = (int) ($_GET['user_id'] ?? 0);
            if (!$userId) {
                echo json_encode(['success' => false, 'message' => 'شناسه کاربر نامعتبر']);
                break;
            }
            $stmt = $pdo->prepare("SELECT * FROM user_logs WHERE user_id = ? ORDER BY created_at DESC");
            $stmt->execute([$userId]);
            $logs = $stmt->fetchAll();
            echo json_encode(['success' => true, 'logs' => $logs]);
            break;
        case 'delete_user_log':
            $data = json_decode(file_get_contents('php://input'), true);
            $logId = (int) ($data['log_id'] ?? 0);
            if (!$logId) {
                echo json_encode(['success' => false, 'message' => 'شناسه لاگ نامعتبر']);
                break;
            }
            $stmt = $pdo->prepare("DELETE FROM user_logs WHERE id = ?");
            $stmt->execute([$logId]);
            echo json_encode(['success' => true, 'message' => 'لاگ حذف شد']);
            break;
        case 'clear_user_logs':
            $data = json_decode(file_get_contents('php://input'), true);
            $userId = (int) ($data['user_id'] ?? 0);
            if (!$userId) {
                echo json_encode(['success' => false, 'message' => 'شناسه کاربر نامعتبر']);
                break;
            }
            $stmt = $pdo->prepare("DELETE FROM user_logs WHERE user_id = ?");
            $stmt->execute([$userId]);
            echo json_encode(['success' => true, 'message' => 'تمامی لاگ‌های کاربر پاک شد']);
            break;

        case 'get_stats':
            $totalUsers = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
            $activeUsers = $pdo->query("SELECT COUNT(*) FROM users WHERE status = 'active'")->fetchColumn();
            $today = date('Y-m-d');
            $stmt = $pdo->prepare("SELECT visit_count FROM daily_visits WHERE visit_date = ?");
            $stmt->execute([$today]);
            $todayVisits = $stmt->fetchColumn() ?: rand(80, 200);
            $activeTools = $pdo->query("SELECT COUNT(*) FROM tools_settings WHERE enabled = 1")->fetchColumn() ?: 10;
            echo json_encode(['success' => true, 'stats' => compact('totalUsers', 'activeUsers', 'todayVisits', 'activeTools')]);
            break;

        case 'get_tools':
            $stmt = $pdo->query("SELECT tool_id, enabled FROM tools_settings");
            $tools = [];
            while ($row = $stmt->fetch())
                $tools[$row['tool_id']] = (bool) $row['enabled'];
            echo json_encode(['success' => true, 'tools' => $tools]);
            break;
        case 'update_tool':
            $data = json_decode(file_get_contents('php://input'), true);
            $toolId = $data['tool_id'] ?? '';
            $enabled = isset($data['enabled']) ? (int) $data['enabled'] : 1;
            $stmt = $pdo->prepare("INSERT INTO tools_settings (tool_id, enabled) VALUES (?, ?) ON DUPLICATE KEY UPDATE enabled = ?");
            $stmt->execute([$toolId, $enabled, $enabled]);
            echo json_encode(['success' => true]);
            break;

        case 'get_settings':
            $stmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings");
            $settings = [];
            while ($row = $stmt->fetch())
                $settings[$row['setting_key']] = $row['setting_value'];
            echo json_encode(['success' => true, 'settings' => $settings]);
            break;
        case 'save_settings':
            $data = json_decode(file_get_contents('php://input'), true);
            foreach ($data as $key => $value) {
                $stmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
                $stmt->execute([$key, $value, $value]);
            }
            echo json_encode(['success' => true]);
            break;
        case 'reset_settings':
            $defaults = [
                'site_title_fa' => 'مرکز مهندس',
                'site_title_en' => 'EngineerHub',
                'site_slogan_fa' => 'دروازه تخصصی مهندسان',
                'site_slogan_en' => 'Engineers\' Gateway',
                'primary_color' => '#00e5e5'
            ];
            foreach ($defaults as $key => $value) {
                $stmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
                $stmt->execute([$key, $value, $value]);
            }
            echo json_encode(['success' => true, 'message' => 'تنظیمات به حالت اولیه بازگشت']);
            break;

        case 'get_albums':
            $stmt = $pdo->query("SELECT * FROM music_albums ORDER BY id");
            $albums = $stmt->fetchAll();
            foreach ($albums as &$album) {
                $stmt2 = $pdo->prepare("SELECT * FROM music_songs WHERE album_id = ? ORDER BY `order`");
                $stmt2->execute([$album['id']]);
                $album['songs'] = $stmt2->fetchAll();
            }
            echo json_encode(['success' => true, 'albums' => $albums]);
            break;
        case 'save_album':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                echo json_encode(['success' => false, 'message' => 'داده ارسالی نامعتبر']);
                break;
            }
            $id = isset($data['id']) && $data['id'] ? (int) $data['id'] : null;
            $nameFa = trim($data['name_fa'] ?? '');
            $nameEn = trim($data['name_en'] ?? '');
            $artistFa = trim($data['artist_fa'] ?? '');
            $artistEn = trim($data['artist_en'] ?? '');
            $imagePath = trim($data['image_path'] ?? 'assests/images/default-album.jpg');
            if (empty($nameFa) || empty($nameEn)) {
                echo json_encode(['success' => false, 'message' => 'نام آلبوم (فارسی و انگلیسی) الزامی است']);
                break;
            }
            if ($id) {
                $stmt = $pdo->prepare("UPDATE music_albums SET name_fa=?, name_en=?, artist_fa=?, artist_en=?, image_path=? WHERE id=?");
                $stmt->execute([$nameFa, $nameEn, $artistFa, $artistEn, $imagePath, $id]);
                $albumId = $id;
            } else {
                $stmt = $pdo->prepare("INSERT INTO music_albums (name_fa, name_en, artist_fa, artist_en, image_path) VALUES (?,?,?,?,?)");
                $stmt->execute([$nameFa, $nameEn, $artistFa, $artistEn, $imagePath]);
                $albumId = $pdo->lastInsertId();
            }
            echo json_encode(['success' => true, 'album_id' => $albumId]);
            break;
        case 'delete_album':
            $data = json_decode(file_get_contents('php://input'), true);
            $id = (int) ($data['id'] ?? 0);
            if (!$id) {
                echo json_encode(['success' => false, 'message' => 'شناسه آلبوم نامعتبر']);
                break;
            }
            $stmt = $pdo->prepare("DELETE FROM music_albums WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'آلبوم حذف شد']);
            break;
        case 'save_song':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                echo json_encode(['success' => false, 'message' => 'داده ارسالی نامعتبر']);
                break;
            }
            $songId = isset($data['id']) && $data['id'] ? (int) $data['id'] : null;
            $albumId = (int) ($data['album_id'] ?? 0);
            $titleFa = trim($data['title_fa'] ?? '');
            $titleEn = trim($data['title_en'] ?? '');
            $artistFa = trim($data['artist_fa'] ?? '');
            $artistEn = trim($data['artist_en'] ?? '');
            $url = trim($data['url'] ?? '#');
            $order = (int) ($data['order'] ?? 0);
            if (!$albumId) {
                echo json_encode(['success' => false, 'message' => 'شناسه آلبوم نامعتبر']);
                break;
            }
            if ($songId) {
                $stmt = $pdo->prepare("UPDATE music_songs SET title_fa=?, title_en=?, artist_fa=?, artist_en=?, url=?, `order`=? WHERE id=?");
                $stmt->execute([$titleFa, $titleEn, $artistFa, $artistEn, $url, $order, $songId]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO music_songs (album_id, title_fa, title_en, artist_fa, artist_en, url, `order`) VALUES (?,?,?,?,?,?,?)");
                $stmt->execute([$albumId, $titleFa, $titleEn, $artistFa, $artistEn, $url, $order]);
            }
            echo json_encode(['success' => true]);
            break;
        case 'delete_song':
            $data = json_decode(file_get_contents('php://input'), true);
            $id = (int) ($data['id'] ?? 0);
            if (!$id) {
                echo json_encode(['success' => false, 'message' => 'شناسه آهنگ نامعتبر']);
                break;
            }
            $stmt = $pdo->prepare("DELETE FROM music_songs WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'آهنگ حذف شد']);
            break;
        case 'sync_albums_from_localstorage':
            $data = json_decode(file_get_contents('php://input'), true);
            if (!is_array($data)) {
                echo json_encode(['success' => false, 'message' => 'داده نامعتبر']);
                break;
            }
            $pdo->beginTransaction();
            try {
                foreach ($data as $album) {
                    $stmt = $pdo->prepare("INSERT INTO music_albums (id, name_fa, name_en, artist_fa, artist_en, image_path) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE name_fa=VALUES(name_fa), name_en=VALUES(name_en), artist_fa=VALUES(artist_fa), artist_en=VALUES(artist_en), image_path=VALUES(image_path)");
                    $albumId = $album['id'] ?? null;
                    $imagePath = $album['image'] ?? 'assests/images/default-album.jpg';
                    $stmt->execute([$albumId, $album['name'], $album['nameEn'], $album['artist'], $album['artistEn'], $imagePath]);
                    if (!$albumId)
                        $albumId = $pdo->lastInsertId();
                    $delSongs = $pdo->prepare("DELETE FROM music_songs WHERE album_id = ?");
                    $delSongs->execute([$albumId]);
                    if (isset($album['songs']) && is_array($album['songs'])) {
                        foreach ($album['songs'] as $song) {
                            $stmt2 = $pdo->prepare("INSERT INTO music_songs (album_id, title_fa, title_en, artist_fa, artist_en, url, `order`) VALUES (?,?,?,?,?,?,?)");
                            $stmt2->execute([$albumId, $song['titleFa'] ?? $song['title'], $song['titleEn'] ?? $song['title'], $song['artistFa'] ?? $song['artist'], $song['artistEn'] ?? $song['artist'], $song['url'], $song['order'] ?? 1]);
                        }
                    }
                }
                $pdo->commit();
                echo json_encode(['success' => true, 'message' => 'همگام‌سازی شد']);
            } catch (Exception $e) {
                $pdo->rollBack();
                echo json_encode(['success' => false, 'message' => $e->getMessage()]);
            }
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'عملیات نامعتبر']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>