<?php
require_once __DIR__ . "/../../services/incidenciaService.php";

$data = json_decode(file_get_contents("php://input"),true);

$service = new incidenciaService();
$response = $service->listarIncidencias($data);

echo json_encode($response);
?>