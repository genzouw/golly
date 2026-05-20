<?php

require_once __DIR__.'/db.php';

$pdo = create_pdo();

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
