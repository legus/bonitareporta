<?php
header('Content-Type: application/json; charset=utf-8');

function sendJsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

$body = file_get_contents('php://input');
$request = json_decode($body, true);

if ($body !== '' && $request === null && json_last_error() !== JSON_ERROR_NONE) {
    sendJsonResponse([
        'success' => false,
        'code' => 400,
        'message' => 'JSON inválido en la solicitud',
        'errors' => [json_last_error_msg()]
    ], 400);
}

if (!is_array($request) || empty($request)) {
    $request = [
        'operation' => 'SELECT',
        'table' => 'usuarios'
    ];
}

$response = [
    'success' => true,
    'code' => 200,
    'message' => 'Operación recibida correctamente',
    'data' => [
        'operation' => $request['operation'] ?? null,
        'table' => $request['table'] ?? null
    ],
    'errors' => []
];

sendJsonResponse($response);
?>
