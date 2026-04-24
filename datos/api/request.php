<?php
// api/request.php
header('Content-Type: application/json');

require_once '../func_datos/db_operations.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(["success" => false, "error" => "JSON inválido"]);
    exit;
}

$operation = $input['operation'];
$table     = $input['table'];

if ($operation === 'INSERT' && $table === 'incidencias') {
    $resultado = insertarIncidencia($input['insert_data']);
    echo json_encode($resultado);
} else {
    echo json_encode(["success" => false, "error" => "Operación no válida"]);
}
?>