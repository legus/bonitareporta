<?php
require_once '../conf_datos/conexion.php';
function insertarIncidencia($data) {
    global $conn;

    // Validación de campos obligatorios
    $camposRequeridos = [
        'titulo',
        'tipo',
        'descripcion',
        'zona',
        'barrio',
        'usuario_id',
        'lat',
        'lng',
        'prioridad'
    ];

    foreach ($camposRequeridos as $campo) {
        if (!isset($data[$campo]) || empty($data[$campo])) {
            return [
                "success" => false,
                "insert_id" => null,
                "affected_rows" => 0,
                "error" => "El campo '$campo' es obligatorio"
            ];
        }
    }

    $sql = "INSERT INTO incidencias 
            (titulo, tipo, descripcion, zona, barrio, usuario_id, lat, lng, estado, prioridad, fecha_creacion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "sssssiddsss",
        $data['titulo'],
        $data['tipo'],
        $data['descripcion'],
        $data['zona'],
        $data['barrio'],
        $data['usuario_id'],
        $data['lat'],
        $data['lng'],
        $data['estado'],
        $data['prioridad'],
        date("Y-m-d H:i:s")
    );

    if ($stmt->execute()) {
        return [
            "success" => true,
            "insert_id" => $conn->insert_id,
            "affected_rows" => $stmt->affected_rows,
            "error" => null
        ];
    } else {
        return [
            "success" => false,
            "insert_id" => null,
            "affected_rows" => 0,
            "error" => $stmt->error
        ];
    }
}

function obtenerIncidencias($condiciones = []) {
    global $conn;

    $sql = "SELECT * FROM incidencias";
    $params = [];
    $types = "";

    if (!empty($condiciones)) {
        $campo = array_key_first($condiciones);
        $valor = $condiciones[$campo];

        $sql .= " WHERE $campo = ?";
        $params[] = $valor;
        $types .= "s";
    }

    $stmt = $conn->prepare($sql);

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $rows = [];

    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    return [
        "success" => true,
        "data" => $rows,
        "error" => null
    ];
}

function actualizarIncidencia($data, $condiciones) {
    global $conn;
    $campo_cond = array_key_first($condiciones);
    $valor_cond = $condiciones[$campo_cond];
    $sets = [];
    $valores = [];
    $tipos = "";
    foreach ($data as $campo => $valor) {
        $sets[] = "$campo = ?";
        $valores[] = $valor;
        $tipos .= "s";
    }
    $valores[] = $valor_cond;
    $tipos .= "s";
    $sql = "UPDATE incidencias SET " . implode(", ", $sets) . " WHERE $campo_cond = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($tipos, ...$valores);
    if ($stmt->execute()) {
        return ["success" => true, "affected_rows" => $stmt->affected_rows, "error" => null];
    } else {
        return ["success" => false, "affected_rows" => 0, "error" => $stmt->error];
    }
}

function eliminarIncidencia($condiciones) {
    global $conn;
    $campo = array_key_first($condiciones);
    $valor = $condiciones[$campo];
    $sql = "DELETE FROM incidencias WHERE $campo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $valor);
    if ($stmt->execute()) {
        return ["success" => true, "affected_rows" => $stmt->affected_rows, "error" => null];
    } else {
        return ["success" => false, "affected_rows" => 0, "error" => $stmt->error];
    }
}