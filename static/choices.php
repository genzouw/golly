<?php

$dsn = getenv('DB_DSN');
$user = getenv('DB_USER');
$password = getenv('DB_PASS');

if ($dsn === false || $user === false || $password === false) {
    die('Error: Database configuration not found. Please ensure DB_DSN, DB_USER, and DB_PASS environment variables are set.');
}

try {
    $pdo = new PDO($dsn, $user, $password);
} catch (PDOException $e) {
    print('Error:'.$e->getMessage());
    die();
}

header('Content-Type: application/json;charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT');

$id = null;

switch (mb_strtolower($_SERVER['REQUEST_METHOD'])) {
    case 'put':
        $id = $_GET['id'];

        $sql = 'update choices set selected_number = selected_number + 1 where id = ?;';
        $pdo->prepare($sql)->execute([$id]);
        break;
}

$data = array();
if (isset($_GET['id'])) {
    $id = $_GET['id'];
}

if (!is_null($id)) {
    $sql = 'select * from choices where id = ?';
    $stmt = $pdo->prepare($sql);
    if ($stmt && $stmt->execute([$id])) {
        $data = $stmt->fetch(PDO::FETCH_ASSOC) ?: array();
    }
}

echo json_encode($data);
