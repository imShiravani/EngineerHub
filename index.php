<?php
session_name('ENGINEERHUB_SESSION');
session_start();
require_once 'db.php';

$loggedIn = false;
$userName = null;
$userEmail = null;
$userRole = null;
$loginTimestamp = null;

if (isset($_SESSION['user_id'])) {
    $loggedIn = true;
    $userName = $_SESSION['user_name'] ?? 'کاربر';
    $userEmail = $_SESSION['user_email'] ?? '';
    $userRole = $_SESSION['user_role'] ?? 'user';
    $loginTimestamp = $_SESSION['login_time'] ?? time();
} elseif (isset($_COOKIE['remember_token'])) {
    $token = $_COOKIE['remember_token'];
    $stmt = $pdo->prepare("SELECT user_sessions.user_id, users.fullname, users.email, users.role 
                           FROM user_sessions JOIN users ON user_sessions.user_id = users.id 
                           WHERE user_sessions.token = ? AND user_sessions.expires_at > NOW()");
    $stmt->execute([$token]);
    $session = $stmt->fetch();
    if ($session) {
        $_SESSION['user_id'] = $session['user_id'];
        $_SESSION['user_name'] = $session['fullname'];
        $_SESSION['user_email'] = $session['email'];
        $_SESSION['user_role'] = $session['role'];
        $_SESSION['login_time'] = time();
        $loggedIn = true;
        $userName = $session['fullname'];
        $userEmail = $session['email'];
        $userRole = $session['role'];
        $loginTimestamp = time();
    }
}

if (!$loggedIn) {
    header('Location: login.html');
    exit;
}

$toolsEnabled = [];
$stmtTools = $pdo->query("SELECT tool_id, enabled FROM tools_settings");
while ($row = $stmtTools->fetch()) {
    $toolsEnabled[$row['tool_id']] = (bool) $row['enabled'];
}

$settings = [];
$stmtSettings = $pdo->query("SELECT setting_key, setting_value FROM site_settings");
while ($row = $stmtSettings->fetch()) {
    $settings[$row['setting_key']] = $row['setting_value'];
}
$siteTitleFa = $settings['site_title_fa'] ?? ($settings['site_title'] ?? 'مرکز مهندس');
$siteTitleEn = $settings['site_title_en'] ?? ($settings['site_title'] ?? 'EngineerHub');
$siteSloganFa = $settings['site_slogan_fa'] ?? ($settings['site_slogan'] ?? 'دروازه تخصصی مهندسان');
$siteSloganEn = $settings['site_slogan_en'] ?? ($settings['site_slogan'] ?? 'Engineers\' Gateway');
$primaryColor = $settings['primary_color'] ?? '#00e5e5';

$templatePath = __DIR__ . '/template.html';
$htmlContent = file_get_contents($templatePath);
if ($htmlContent === false) {
    die("خطا: قالب template.html یافت نشد");
}

$userData = [
    'userName' => $userName,
    'userEmail' => $userEmail,
    'userRole' => $userRole,
    'loginTimestamp' => $loginTimestamp,
    'toolsEnabled' => $toolsEnabled
];
$userDataJson = json_encode($userData, JSON_UNESCAPED_UNICODE);
$userScript = '<script>window.userData = ' . $userDataJson . ';</script>';

$htmlContent = str_replace('<script id="userDataScript"></script>', $userScript, $htmlContent);
$htmlContent = str_replace('{{siteTitleFa}}', 'مرکز مهندس | EngineerHub', $htmlContent);
$htmlContent = str_replace('{{siteTitleEn}}', 'مرکز مهندس | EngineerHub', $htmlContent);
$htmlContent = str_replace('{{siteSloganFa}}', htmlspecialchars($siteSloganFa), $htmlContent);
$htmlContent = str_replace('{{siteSloganEn}}', htmlspecialchars($siteSloganEn), $htmlContent);
$htmlContent = str_replace('{{primaryColor}}', htmlspecialchars($primaryColor), $htmlContent);
$htmlContent = str_replace('{{serverTime}}', '', $htmlContent);
$htmlContent = str_replace('{{userIP}}', '', $htmlContent);

header('Content-Type: text/html; charset=utf-8');
echo $htmlContent;
?>