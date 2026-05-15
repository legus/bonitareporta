<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../services/incidenciaService.php';

$service  = new incidenciaService();
$response = $service->kpi3_tasaResolucion();
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>