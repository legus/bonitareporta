<?php
require_once __DIR__ . '/../../datos/func_datos/func.php';

class incidenciaService {

    private function errorResponse(string $message): array {
        return ['status' => 'error', 'message' => $message];
    }

    private function successResponse(array $data): array {
        return ['status' => 'success', 'data' => $data];
    }

    // ============================================================
    // CRUD
    // ============================================================

    public function crearIncidencia(array $data): array {
        if (empty($data['titulo'])) {
            return $this->errorResponse('El título es obligatorio');
        }
        if (empty($data['tipo'])) {
            return $this->errorResponse('El tipo de incidencia es obligatorio');
        }
        $tiposValidos = ['Bache', 'Alumbrado', 'Residuos', 'Arboles', 'Otro'];
        if (!in_array($data['tipo'], $tiposValidos, true)) {
            return $this->errorResponse('Tipo inválido. Debe ser: Bache, Alumbrado, Residuos, Arboles u Otro');
        }
        if (empty($data['descripcion'])) {
            return $this->errorResponse('La descripción es obligatoria');
        }
        if (empty($data['zona'])) {
            return $this->errorResponse('La zona es obligatoria');
        }
        if (empty($data['barrio'])) {
            return $this->errorResponse('El barrio es obligatorio');
        }
        if (empty($data['usuario_id'])) {
            return $this->errorResponse('El usuario_id es obligatorio');
        }

        // Campos que asigna la lógica
        $data['estado']         = 'Reportado';
        $data['prioridad']      = 'Media';
        $data['fecha_creacion'] = date('Y-m-d H:i:s');

        // Latitud y longitud opcionales
        $data['lat'] = $data['lat'] ?? null;
        $data['lng'] = $data['lng'] ?? null;

        $resultado = insertarIncidencia($data);

        if ($resultado['success']) {
            return $this->successResponse([
                'id_incidencia' => $resultado['insert_id'],
                'estado'        => $data['estado'],
                'prioridad'     => $data['prioridad'],
                'fecha_creacion'=> $data['fecha_creacion']
            ]);
        }
        return $this->errorResponse('No se pudo crear la incidencia: ' . $resultado['error']);
    }

    public function listarIncidencias(array $data): array {
        $resultado = obtenerIncidencias($data ?? []);
        if ($resultado['success']) {
            return $this->successResponse(['incidencias' => $resultado['data']]);
        }
        return $this->errorResponse('No se pudieron obtener las incidencias');
    }

    public function actualizarIncidencia(array $data): array {
        if (empty($data['id_incidencia'])) {
            return $this->errorResponse('El ID es obligatorio');
        }

        // Si se está cerrando/resolviendo, registrar fecha de finalización
        if (!empty($data['estado']) && in_array($data['estado'], ['Resuelto', 'Cerrado'], true)) {
            $data['fecha_finalizacion'] = date('Y-m-d H:i:s');
        }

        $condiciones = ['id_incidencia' => $data['id_incidencia']];
        unset($data['id_incidencia']);

        $resultado = actualizarIncidencia($data, $condiciones);

        if ($resultado['success']) {
            return $this->successResponse([
                'affected_rows' => $resultado['affected_rows']
            ]);
        }
        return $this->errorResponse('No se pudo actualizar: ' . $resultado['error']);
    }

    public function eliminarIncidencia(array $data): array {
        if (empty($data['id_incidencia'])) {
            return $this->errorResponse('El ID es obligatorio');
        }

        $resultado = eliminarIncidencia(['id_incidencia' => $data['id_incidencia']]);

        if ($resultado['success']) {
            return $this->successResponse([
                'affected_rows' => $resultado['affected_rows']
            ]);
        }
        return $this->errorResponse('No se pudo eliminar: ' . $resultado['error']);
    }

    // ============================================================
    // KPIs - Visualización
    // ============================================================

    public function kpi1_incidentesPorTipo(): array {
        $contrato = [
            "operation" => "SELECT",
            "table"     => "incidencias",
            "fields"    => ["tipo_incidencia", "estado", "COUNT(*) AS conteo"],
            "where"     => [
                "condition" => "estado IN (?, ?)",
                "params"    => ["abierto", "en_proceso"]
            ],
            "order_by"  => "tipo_incidencia ASC"
        ];
        $resultado = ejecutarConsulta($contrato);
        if ($resultado['success']) {
            return $this->successResponse(['kpi' => 1, 'data' => $resultado['data']]);
        }
        return $this->errorResponse('Error KPI 1: ' . $resultado['error']);
    }

    public function kpi2_tiempoPromedioAtencion(): array {
        $hace30Dias = date('Y-m-d H:i:s', strtotime('-30 days'));
        $contrato = [
            "operation" => "SELECT",
            "table"     => "incidencias",
            "fields"    => [
                "tipo_incidencia",
                "AVG(TIMESTAMPDIFF(HOUR, fecha_creacion, fecha_finalizacion)) AS promedio_horas"
            ],
            "where"     => [
                "condition" => "estado = ? AND fecha_finalizacion IS NOT NULL AND fecha_creacion >= ?",
                "params"    => ["resuelto", $hace30Dias]
            ],
            "order_by"  => "tipo_incidencia ASC"
        ];
        $resultado = ejecutarConsulta($contrato);
        if ($resultado['success']) {
            return $this->successResponse(['kpi' => 2, 'data' => $resultado['data']]);
        }
        return $this->errorResponse('Error KPI 2: ' . $resultado['error']);
    }

    public function kpi3_tasaResolucion(): array {
        $hace7Dias = date('Y-m-d H:i:s', strtotime('-7 days'));

        $contratoTotal = [
            "operation" => "SELECT",
            "table"     => "incidencias",
            "fields"    => ["COUNT(*) AS total_reportadas"],
            "where"     => [
                "condition" => "fecha_creacion >= ?",
                "params"    => [$hace7Dias]
            ]
        ];

        $contratoResueltas = [
            "operation" => "SELECT",
            "table"     => "incidencias",
            "fields"    => ["COUNT(*) AS total_resueltas"],
            "where"     => [
                "condition" => "estado = ? AND fecha_creacion >= ?",
                "params"    => ["resuelto", $hace7Dias]
            ]
        ];

        $total     = ejecutarConsulta($contratoTotal);
        $resueltas = ejecutarConsulta($contratoResueltas);

        if ($total['success'] && $resueltas['success']) {
            $totalVal    = $total['data'][0]['total_reportadas'] ?? 0;
            $resueltasVal= $resueltas['data'][0]['total_resueltas'] ?? 0;
            $tasa        = $totalVal > 0 ? round(($resueltasVal / $totalVal) * 100, 2) : 0;

            return $this->successResponse([
                'kpi'              => 3,
                'total_reportadas' => $totalVal,
                'total_resueltas'  => $resueltasVal,
                'tasa_resolucion'  => $tasa
            ]);
        }
        return $this->errorResponse('Error KPI 3');
    }

    public function kpi4_zonasMasAfectadas(): array {
        $hace30Dias = date('Y-m-d H:i:s', strtotime('-30 days'));
        $contrato = [
            "operation" => "SELECT",
            "table"     => "incidencias",
            "fields"    => ["zona", "barrio", "COUNT(*) AS conteo"],
            "where"     => [
                "condition" => "estado NOT IN (?, ?) AND fecha_creacion >= ?",
                "params"    => ["resuelto", "cerrado", $hace30Dias]
            ],
            "order_by"  => "conteo DESC, zona ASC",
            "limit"     => [0, 10]
        ];
        $resultado = ejecutarConsulta($contrato);
        if ($resultado['success']) {
            return $this->successResponse(['kpi' => 4, 'data' => $resultado['data']]);
        }
        return $this->errorResponse('Error KPI 4: ' . $resultado['error']);
    }

    public function kpi5_tipoMasFrecuente(): array {
        $hace30Dias = date('Y-m-d H:i:s', strtotime('-30 days'));
        $contrato = [
            "operation" => "SELECT",
            "table"     => "incidencias",
            "fields"    => ["tipo", "COUNT(*) AS conteo"],
            "where"     => [
                "condition" => "fecha_creacion >= ?",
                "params"    => [$hace30Dias]
            ],
            "order_by"  => "conteo DESC"
        ];
        $resultado = ejecutarConsulta($contrato);
        if ($resultado['success']) {
            return $this->successResponse(['kpi' => 5, 'data' => $resultado['data']]);
        }
        return $this->errorResponse('Error KPI 5: ' . $resultado['error']);
    }
}
?>