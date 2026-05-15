<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../services/incidenciaService.php';

$body = file_get_contents('php://input');
$data = json_decode($body, true);

if ($body !== '' && $data === null && json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'success' => false,
        'message' => 'JSON inválido en el cuerpo de la solicitud',
        'errors' => [json_last_error_msg()]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$data = is_array($data) ? $data : [];
$service = new IncidenciaService();
$response = $service->crearIncidencia($data);
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>
