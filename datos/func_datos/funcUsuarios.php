<?php
require_once '../conf_datos/conexion.php';

function registrarUsuario($data) {
    global $conn;
    $sql = "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss",
        $data['nombre'],
        $data['email'],
        $data['password'],
        $data['rol']
    );
    if ($stmt->execute()) {
        return ["success" => true, "insert_id" => $conn->insert_id, "affected_rows" => $stmt->affected_rows, "error" => null];
    } else {
        return ["success" => false, "insert_id" => null, "affected_rows" => 0, "error" => $stmt->error];
    }
}

function obtenerUsuario($condiciones = []) {
    global $conn;

    $sql = "SELECT * FROM usuarios";
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

function actualizarUsuario($data, $condiciones) {
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
    $sql = "UPDATE usuarios SET " . implode(", ", $sets) . " WHERE $campo_cond = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($tipos, ...$valores);
    if ($stmt->execute()) {
        return ["success" => true, "affected_rows" => $stmt->affected_rows, "error" => null];
    } else {
        return ["success" => false, "affected_rows" => 0, "error" => $stmt->error];
    }
}

function eliminarUsuario($condiciones) {
    global $conn;
    $campo = array_key_first($condiciones);
    $valor = $condiciones[$campo];
    $sql = "DELETE FROM usuarios WHERE $campo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $valor);
    if ($stmt->execute()) {
        return ["success" => true, "affected_rows" => $stmt->affected_rows, "error" => null];
    } else {
        return ["success" => false, "affected_rows" => 0, "error" => $stmt->error];
    }
}
?>