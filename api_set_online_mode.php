<?php
session_name('ENGINEERHUB_SESSION');
session_start();
$data = json_decode(file_get_contents('php://input'), true);
$online = $data['online'] ?? false;
setcookie('onlineMode', $online ? 'true' : 'false', time() + 30 * 24 * 3600, '/');
echo json_encode(['success' => true]);