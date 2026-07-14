<?php
session_name('ENGINEERHUB_SESSION');
session_start();
require_once 'db.php';

if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $stmtLog = $pdo->prepare("INSERT INTO user_logs (user_id, action, ip_address, user_agent) VALUES (?, 'logout', ?, ?)");
    $stmtLog->execute([$userId, $ip, $userAgent]);
}

session_destroy();

if (isset($_COOKIE['remember_token'])) {
    $token = $_COOKIE['remember_token'];
    setcookie('remember_token', '', time() - 3600, '/');
    $stmt = $pdo->prepare("DELETE FROM user_sessions WHERE token = ?");
    $stmt->execute([$token]);
}

echo json_encode(['success' => true, 'message' => 'خروج انجام شد']);
?>