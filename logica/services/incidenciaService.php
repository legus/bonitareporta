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

}
?>
