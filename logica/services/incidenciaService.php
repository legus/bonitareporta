<?php
class incidenciaService {

    public function crearIncidencia($data){
        if (empty($data["titulo"])){
            return [
                "status" => "error",
                "message" => "El titulo es obligatorio"
            ];
        }

        $tiposValidos = ["Bache", "Alumbrado", "Resuidos", "Arboles", "Otro"];

        if (!in_array($data["tipo"], $tiposValidos)) {
            return [
                "status" => "error",
                "message" => "Tipo invalido"
            ];
        }

        $data["insert_data"]["estado"] = "Reportado";
        $data["insert_data"]["prioridad"] = "Media";

        return [
            "success" => true,
            "operation" => $data["operation"],
            "table" => $data["table"],
            "data_to_save" => $data["insert_data"]
        ];
    }

    public function listarIncidencias($data){
        return [
            "success" => true,
            "operation" => "select_all",
            "table" => "incidencias"
        ];
    }

    public function actualizarIncidencia($data){
        if (empty($data["id_incidencia"])){
            return [
                "status" => "error",
                "message" => "El ID es obligatorio"
            ];
        }

        return [
            "success" => true,
            "operation" => "update",
            "table" => "incidencias",
            "id_incidencia" => $data["id_incidencia"],
            "data_to_update" => $data["update_data"]
        ];
    }

    public function eliminarIncidencias($data){
        if(empty($data["id_incidencia"])){
            return [
                "status" => "error",
                "message" => "El ID es obligatorio"
            ];
        }

        return [
            "success" => true,
            "operation" => "delete",
            "table" => "incidencias",
            "id_incidencia" => $data["id_incidencia"]
        ];
    }
}
?>
