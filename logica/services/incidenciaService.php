<?php
class IncidenciaService
{
    private function errorResponse(string $message): array
    {
        return [
            'success' => false,
            'message' => $message
        ];
    }

    public function crearIncidencia(array $data): array
    {
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

        $insertData = isset($data['insert_data']) && is_array($data['insert_data']) ? $data['insert_data'] : [];
        $insertData['estado'] = 'Reportado';
        $insertData['prioridad'] = 'Media';

        return [
            'success' => true,
            'operation' => $data['operation'] ?? 'create',
            'table' => $data['table'] ?? 'incidencias',
            'data_to_save' => $insertData
        ];
    }

    public function listarIncidencias(array $data): array
    {
        return [
            'success' => true,
            'operation' => 'select_all',
            'table' => 'incidencias'
        ];
    }

    public function actualizarIncidencia(array $data): array
    {
        if (empty($data['id_incidencia'])) {
            return $this->errorResponse('El ID es obligatorio');
        }

        return [
            'success' => true,
            'operation' => 'update',
            'table' => 'incidencias',
            'id_incidencia' => $data['id_incidencia'],
            'data_to_update' => isset($data['update_data']) && is_array($data['update_data']) ? $data['update_data'] : []
        ];
    }

    public function eliminarIncidencias(array $data): array
    {
        if (empty($data['id_incidencia'])) {
            return $this->errorResponse('El ID es obligatorio');
        }

        return [
            'success' => true,
            'operation' => 'delete',
            'table' => 'incidencias',
            'id_incidencia' => $data['id_incidencia']
        ];
    }
}
?>
