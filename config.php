<?php
session_start();
$host = 'localhost';
$dbname = 'mc_guild';
$user = 'ben';
$pass = '2580852ABC';   // 改成实际密码，如 root 或空 ''

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => '数据库连接失败']);
    exit;
}
?>