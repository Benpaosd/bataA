<?php
$host = 'localhost';
$dbname = 'mc_guild';
$user = 'ben';
$pass = '2580852ABC';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    echo "✅ 数据库连接成功";
} catch (PDOException $e) {
    echo "❌ 连接失败: " . $e->getMessage();
}