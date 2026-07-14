<?php
ini_set('session.cookie_path', '/');
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Lax');
session_name('ENGINEERHUB_SESSION');
session_start();
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$fullname = trim($data['fullname'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$fullname || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'همه فیلدها الزامی است']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'ایمیل نامعتبر است']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'رمز عبور باید حداقل ۶ کاراکتر باشد']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'این ایمیل قبلاً ثبت شده است']);
    exit;
}

$hashed = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("INSERT INTO users (fullname, email, password_hash, role, status) VALUES (?, ?, ?, 'user', 'active')");
$stmt->execute([$fullname, $email, $hashed]);
$userId = $pdo->lastInsertId();

session_regenerate_id(true);

$_SESSION['user_id'] = $userId;
$_SESSION['user_name'] = $fullname;
$_SESSION['user_email'] = $email;
$_SESSION['user_role'] = 'user';
$_SESSION['login_time'] = time();

try {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $stmtLog = $pdo->prepare("INSERT INTO user_logs (user_id, action, ip_address, user_agent) VALUES (?, 'register', ?, ?)");
    $stmtLog->execute([$userId, $ip, $userAgent]);
} catch (Exception $e) {
}

session_write_close();

echo json_encode([
    'success' => true,
    'message' => 'ثبت‌نام با موفقیت انجام شد',
    'redirect' => 'index.php'
]);