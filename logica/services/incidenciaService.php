<?php
require_once __DIR__ . '/../../datos/func_datos/func.php';

class incidenciaService {

    public function crearIncidencia($data) {
        if (empty($data["titulo"])) {
            return ["success" => false, "error" => "El título es obligatorio"];
        }
        return insertarIncidencia($data);
    }

    public function listarIncidencias($data) {
        return obtenerIncidencias($data ?? []);
    }

    public function actualizarIncidencia($data) {
        if (empty($data["id_incidencia"])) {
            return ["success" => false, "error" => "El ID es obligatorio"];
        }
        $condiciones = ["id_incidencia" => $data["id_incidencia"]];
        unset($data["id_incidencia"]);
        return actualizarIncidencia($data, $condiciones);
    }

    public function eliminarIncidencia($data) {
        if (empty($data["id_incidencia"])) {
            return ["success" => false, "error" => "El ID es obligatorio"];
        }
        return eliminarIncidencia(["id_incidencia" => $data["id_incidencia"]]);
    }
}
?>