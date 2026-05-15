<?php
require_once __DIR__ . '/../../datos/func_datos/func.php';

class incidenciaService {

    private function errorResponse(string $message): array {
        return ['success' => false, 'message' => $message];
    }

    public function crearIncidencia(array $data): array {
        if (empty($data['titulo'])) {
            return $this->errorResponse('El título es obligatorio');
        }
        if (empty($data['tipo'])) {
            return $this->errorResponse('El tipo de incidencia es obligatorio');
        }
        $tiposValidos = ['Bache', 'Alumbrado', 'Resuidos', 'Arboles', 'Otro'];
        if (!in_array($data['tipo'], $tiposValidos, true)) {
            return $this->errorResponse('Tipo inválido');
        }
        $data['estado'] = 'Reportado';
        $data['prioridad'] = 'Media';
        return insertarIncidencia($data);
    }

    public function listarIncidencias(array $data): array {
        return obtenerIncidencias($data ?? []);
    }

    public function actualizarIncidencia(array $data): array {
        if (empty($data['id_incidencia'])) {
            return $this->errorResponse('El ID es obligatorio');
        }
        $condiciones = ['id_incidencia' => $data['id_incidencia']];
        unset($data['id_incidencia']);
        return actualizarIncidencia($data, $condiciones);
    }

    public function eliminarIncidencia(array $data): array {
        if (empty($data['id_incidencia'])) {
            return $this->errorResponse('El ID es obligatorio');
        }
        return eliminarIncidencia(['id_incidencia' => $data['id_incidencia']]);
    }
}
?>