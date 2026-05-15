<?php
require_once __DIR__ . "/../../services/incidenciaService.php";

$data = json_decode(file_get_contents("php://input"), true);

$service = new incidenciaService();
$response = $service->actualizarIncidencia($data);

echo json_encode($response);
?>