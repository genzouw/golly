<?php

function create_pdo(): PDO
{
    $dsn = getenv('DB_DSN');
    $user = getenv('DB_USER');
    $password = getenv('DB_PASS');

    if ($dsn === false || $user === false || $password === false) {
        error_log('Database configuration not found.');
        header('Content-Type: application/json; charset=UTF-8', true, 500);
        echo json_encode(['error' => 'Internal Server Error']);
        exit;
    }

    try {
        return new PDO($dsn, $user, $password);
    } catch (PDOException $e) {
        error_log('DB connection error: '.$e->getMessage());
        header('Content-Type: application/json; charset=UTF-8', true, 500);
        echo json_encode(['error' => 'Internal Server Error']);
        exit;
    }
}
