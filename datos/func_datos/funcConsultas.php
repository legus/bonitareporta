<?php
require_once '../conf_datos/conexion.php';

function consultarIncidencias($condiciones = []) {
    global $conn;
    $sql = "SELECT * FROM incidencias";
    if (!empty($condiciones)) {
        $campo = array_key_first($condiciones);
        $valor = $condiciones[$campo];
        $sql .= " WHERE $campo = '$valor'";
    }
    $result = $conn->query($sql);
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    return ["success" => true, "data" => $rows, "error" => null];
}

function consultarEstadisticas($condiciones = []) {
    global $conn;
    $stats = [];
    $r1 = $conn->query("SELECT COUNT(*) as total FROM incidencias");
    $stats['total_incidencias'] = $r1->fetch_assoc()['total'];

    $r2 = $conn->query("SELECT estado, COUNT(*) as cantidad FROM incidencias GROUP BY estado");
    $stats['por_estado'] = [];
    while ($row = $r2->fetch_assoc()) {
        $stats['por_estado'][] = $row;
    }

    $r3 = $conn->query("SELECT zona, COUNT(*) as cantidad FROM incidencias GROUP BY zona");
    $stats['por_zona'] = [];
    while ($row = $r3->fetch_assoc()) {
        $stats['por_zona'][] = $row;
    }

    return ["success" => true, "data" => $stats, "error" => null];
}
?>