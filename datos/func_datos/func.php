<?php
require_once '../conf_datos/conexion.php';

function insertarIncidencia($data) {
    global $conn;
    
    $sql = "INSERT INTO incidencias (
                titulo, tipo, descripcion, zona, barrio,
                usuario_id, lat, lng, estado, prioridad, fecha_creacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "sssssiddss s",
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
        $data['fecha_creacion']
    );
    
    if ($stmt->execute()) {
        return [
            "success"       => true,
            "insert_id"     => $conn->insert_id,
            "affected_rows" => $stmt->affected_rows,
            "error"         => null
        ];
    } else {
        return [
            "success"       => false,
            "insert_id"     => null,
            "affected_rows" => 0,
            "error"         => $stmt->error
        ];
    }
}
?>