<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../services/incidenciaService.php';

$service  = new incidenciaService();
$response = $service->kpi5_tipoMasFrecuente();
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>