<?php

function create_pdo(): PDO
{
    $dsn = getenv('DB_DSN');
    $user = getenv('DB_USER');
    $password = getenv('DB_PASS');

    if ($dsn === false || $user === false || $password === false) {
        die('Error: Database configuration not found. Please ensure DB_DSN, DB_USER, and DB_PASS environment variables are set.');
    }

    try {
        return new PDO($dsn, $user, $password);
    } catch (PDOException $e) {
        print('Error:'.$e->getMessage());
        die();
    }
}
