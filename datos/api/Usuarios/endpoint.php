<?php
header('Content-Type: application/json');
require_once '../../func_datos/funcUsuarios.php';
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(["success" => false, "error" => "JSON inválido"]);
    exit;
}

$operation = $input['operation'];
$table     = $input['table'];

if ($table !== 'usuarios') {
    echo json_encode(["success" => false, "error" => "Tabla no válida para este endpoint"]);
    exit;
}

switch ($operation) {
    case 'INSERT':
        $resultado = registrarUsuario($input['insert_data']);
        echo json_encode($resultado);
        break;

    case 'SELECT':
        $resultado = obtenerUsuario($input['condiciones'] ?? []);
        echo json_encode($resultado);
        break;

    case 'UPDATE':
        $resultado = actualizarUsuario($input['update_data'], $input['condiciones']);
        echo json_encode($resultado);
        break;

    case 'DELETE':
        $resultado = eliminarUsuario($input['condiciones']);
        echo json_encode($resultado);
        break;

    default:
        echo json_encode(["success" => false, "error" => "Operación no válida"]);
        break;
}
?>