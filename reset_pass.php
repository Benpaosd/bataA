<?php
$host = 'localhost';
$dbname = 'mc_guild';
$user = 'ben';
$pass = '2580852ABC';  // 注意改成正确的

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('数据库连接失败: ' . $e->getMessage());
}

$newPassword = 'miaocui2024';
$hash = password_hash($newPassword, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("UPDATE config SET admin_password = ? WHERE id = 1");
$stmt->execute([$hash]);

echo '✅ 密码重置成功！新的哈希是：' . $hash;