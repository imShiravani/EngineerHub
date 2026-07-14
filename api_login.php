<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_name('ENGINEERHUB_SESSION');
session_start();
header('Content-Type: application/json');
require_once 'db.php';

$response = [];

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        throw new Exception('داده ارسال شده معتبر نیست');
    }

    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $remember = $data['remember'] ?? false;

    if (!$email || !$password) {
        throw new Exception('ایمیل و رمز عبور را وارد کنید');
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new Exception('ایمیل یا رمز عبور اشتباه است');
    }

    if (!password_verify($password, $user['password_hash'])) {
        throw new Exception('ایمیل یا رمز عبور اشتباه است');
    }

    if ($user['status'] !== 'active') {
        throw new Exception('حساب کاربری غیرفعال است');
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['fullname'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['login_time'] = time();

    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $stmtLog = $pdo->prepare("INSERT INTO user_logs (user_id, action, ip_address, user_agent) VALUES (?, 'login', ?, ?)");
        $stmtLog->execute([$user['id'], $ip, $userAgent]);
    } catch (Exception $e) {
        error_log('خطا در ثبت لاگ ورود: ' . $e->getMessage());
    }

    if ($remember) {
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+30 days'));
        $stmt = $pdo->prepare("INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$user['id'], $token, $expires]);
        setcookie('remember_token', $token, time() + 30 * 86400, '/', '', false, true);
    }

    session_write_close();
    echo json_encode(['success' => true, 'message' => 'ورود موفق', 'redirect_url' => 'index.php']);
    exit;

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
}
?>