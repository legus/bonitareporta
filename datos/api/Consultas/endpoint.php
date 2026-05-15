<?php
header('Content-Type: application/json');
require_once '../../func_datos/funcConsultas.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(["success" => false, "error" => "JSON inválido"]);
    exit;
}

$operation = $input['operation'];
$table     = $input['table'];

if ($operation !== 'SELECT') {
    echo json_encode(["success" => false, "error" => "Este endpoint solo permite operaciones SELECT"]);
    exit;
}

switch ($table) {
    case 'incidencias':
        $resultado = consultarIncidencias($input['condiciones'] ?? []);
        echo json_encode($resultado);
        break;

    case 'estadisticas':
        $resultado = consultarEstadisticas($input['condiciones'] ?? []);
        echo json_encode($resultado);
        break;

    default:
        echo json_encode(["success" => false, "error" => "Tabla no válida para este endpoint"]);
        break;
}
?>