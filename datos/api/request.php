<?php
header('Content-Type: application/json');

require_once '../func_datos/func.php';
require_once '../func_datos/funcUsuarios.php';
require_once '../func_datos/funcConsultas.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(["success" => false, "error" => "JSON inválido"]);
    exit;
}

$operation = $input['operation'];
$table     = $input['table'];

switch ($table) {
    case 'incidencias':
        switch ($operation) {
            case 'INSERT':
                $resultado = insertarIncidencia($input['insert_data']);
                break;
            case 'SELECT':
                $resultado = obtenerIncidencias($input['condiciones'] ?? []);
                break;
            case 'UPDATE':
                $resultado = actualizarIncidencia($input['update_data'], $input['condiciones']);
                break;
            case 'DELETE':
                $resultado = eliminarIncidencia($input['condiciones']);
                break;
            default:
                $resultado = ["success" => false, "error" => "Operación no válida"];
        }
        break;
    case 'usuarios':
        switch ($operation) {
            case 'INSERT':
                $resultado = registrarUsuario($input['insert_data']);
                break;
            case 'SELECT':
                $resultado = obtenerUsuario($input['condiciones'] ?? []);
                break;
            case 'UPDATE':
                $resultado = actualizarUsuario($input['update_data'], $input['condiciones']);
                break;
            case 'DELETE':
                $resultado = eliminarUsuario($input['condiciones']);
                break;
            default:
                $resultado = ["success" => false, "error" => "Operación no válida"];
        }
        break;
    case 'estadisticas':
        if ($operation !== 'SELECT') {
            $resultado = ["success" => false, "error" => "Solo se permite SELECT en estadísticas"];
        } else {
            $resultado = consultarEstadisticas($input['condiciones'] ?? []);
        }
        break;

    default:
        $resultado = ["success" => false, "error" => "Tabla no válida"];
}
echo json_encode($resultado);
?>