<?php

$dsn = getenv('DB_DSN');
$user = getenv('DB_USER');
$password = getenv('DB_PASS');

try {
    $pdo = new PDO($dsn, $user, $password);
} catch (PDOException $e) {
    print('Error:'.$e->getMessage());
    die();
}

header('Content-Type: application/json;charset=UTF-8');
header('Access-Control-Allow-Origin: *');

$id = null;
$qcode = null;
$data = array();

switch (mb_strtolower($_SERVER['REQUEST_METHOD'])) {
    case 'post':
        if (empty($_POST['question']) || empty($_POST['choices'])) {
            $data = array(
                'message' => '必須項目が未入力です。',
            );
            http_response_code(400);
            break;
        }

        $question = $_POST['question'];
        $choices = $_POST['choices'];

        $sql = 'insert into questionnaires (question, qcode) values (?, ?);';
        $pdo->prepare($sql)->execute([
            $question,
            uniqid(rand(), true)
        ]);
        $id = $pdo->lastInsertId('id');

        foreach ($choices as $choice) {
            $sql = 'insert into choices (questionnaire_id, choice) values (?, ?);';
            $pdo->prepare($sql)->execute([$id, $choice]);
        }
        break;

    default:
        break;
}

if (isset($_GET['qcode'])) {
    $qcode = $_GET['qcode'];
}

if (!is_null($id) || !is_null($qcode)) {
    $sql = 'select * from questionnaires where id = ? or qcode = ?';
    $stmt = $pdo->prepare($sql);
    if ($stmt && $stmt->execute([$id, $qcode])) {
        $data = $stmt->fetch(PDO::FETCH_ASSOC) ?: array();
    }

    // $sql = 'select id, choice' . (isset($_GET['all']) ? ', selected_number' : '')
    // . ' from choices where questionnaire_id = ? order by id';
    $sql = 'select id, choice, selected_number from choices where questionnaire_id = ? order by id';
    $stmt = $pdo->prepare($sql);
    if ($stmt && $stmt->execute([$data['id']])) {
        $data['choices'] = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: array();
    }
}

echo json_encode($data);
