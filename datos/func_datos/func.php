<?php
function obtenerIncidencias($condiciones = []) {
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