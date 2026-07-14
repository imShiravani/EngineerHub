<?php
ini_set('session.cookie_path', '/');
ini_set('session.cookie_httponly', 1);
session_name('ENGINEERHUB_SESSION');
session_start();
header('Content-Type: application/json');
require_once 'db.php';

$response = ['logged_in' => false, 'role' => null, 'name' => null];

if (isset($_SESSION['user_id'])) {
    $response['logged_in'] = true;
    $response['role'] = $_SESSION['user_role'];
    $response['name'] = $_SESSION['user_name'];
    echo json_encode($response);
    exit;
}

if (isset($_COOKIE['remember_token'])) {
    $token = $_COOKIE['remember_token'];
    $stmt = $pdo->prepare("SELECT user_sessions.user_id, users.fullname, users.role FROM user_sessions JOIN users ON user_sessions.user_id = users.id WHERE user_sessions.token = ? AND user_sessions.expires_at > NOW()");
    $stmt->execute([$token]);
    $session = $stmt->fetch();
    if ($session) {
        $_SESSION['user_id'] = $session['user_id'];
        $_SESSION['user_name'] = $session['fullname'];
        $_SESSION['user_role'] = $session['role'];
        $response['logged_in'] = true;
        $response['role'] = $session['role'];
        $response['name'] = $session['fullname'];
        echo json_encode($response);
        exit;
    }
}

echo json_encode($response);