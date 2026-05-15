<?php
/**
 * Dummy API - BonitaReporta
 * Archivo unificado para pruebas de integración
 * Cada acción se simula con respuestas predefinidas y validaciones básicas
 * NOTA: Este archivo es solo para desarrollo y pruebas. No debe usarse en producción.
 * ACTUALIZADO: Incluye campos nuevos de formulario, ver y editar incidencias
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$accion = $data['accion'] ?? '';

switch ($accion) {
    // ==================== LOGIN ====================
    case 'login':
        $datos = $data['datos'];

        if (strpos($datos['email'], 'fallo') !== false || $datos['password'] === 'wrong') {
            http_response_code(401);
            echo json_encode(["exito" => false, "mensaje" => "Credenciales incorrectas", "datos" => null]);
            exit;
        }

        echo json_encode([
            "exito" => true,
            "mensaje" => "Inicio de sesion exitoso",
            "datos" => [
                "token_sesion" => "token_" . bin2hex(random_bytes(8)),
                "usuario" => [
                    "usuario_id" => rand(10, 99),
                    "nombre" => "Usuario Demo",
                    "email" => $datos['email']
                ]
            ]
        ]);
        break;

    // ==================== REGISTRO ====================
    case 'registro_usuario':
        $datos = $data['datos'];

        if (strpos($datos['email'], 'error') !== false) {
            http_response_code(400);
            echo json_encode(["exito" => false, "mensaje" => "No se pudo registrar el usuario", "datos" => null]);
            exit;
        }

        echo json_encode([
            "exito" => true,
            "mensaje" => "Usuario registrado correctamente",
            "datos" => [
                "usuario_id" => rand(100, 999),
                "nombre_completo" => $datos['nombre'] . " " . $datos['apellido'],
                "email" => $datos['email'],
                "fecha_registro" => date('Y-m-d H:i:s')
            ]
        ]);
        break;

    // ==================== CREAR INCIDENCIA ====================
    // ACTUALIZADO: Ahora acepta latitud, longitud y fecha_hora_registro
    // desde formulario(1).js
    // ============================================================
    case 'crear_incidencia':
        $datos = $data['datos'];

        if (strpos($datos['titulo'], 'error') !== false) {
            http_response_code(500);
            echo json_encode(["exito" => false, "mensaje" => "No se pudo guardar el reporte", "datos" => null]);
            exit;
        }

        // Guardar campos opcionales si vienen
        $latitud = $datos['latitud'] ?? null;
        $longitud = $datos['longitud'] ?? null;
        $fecha_hora_registro = $datos['fecha_hora_registro'] ?? date('d/m/y H:i');

        http_response_code(201);
        echo json_encode([
            "exito" => true,
            "mensaje" => "Incidencia creada exitosamente",
            "datos" => [
                "incidencia_id" => rand(500, 999),
                "estado" => "Pendiente",
                "prioridad" => "Media",
                "fecha_creacion" => date('Y-m-d H:i:s'),
                "titulo" => $datos['titulo'],
                "tipo" => $datos['tipo'],
                // AÑADIDO: Devolver campos geo y fecha/hora en la respuesta
                "latitud" => $latitud,
                "longitud" => $longitud,
                "fecha_hora_registro" => $fecha_hora_registro
            ]
        ]);
        break;

    // ==================== VER INCIDENCIAS ====================
    // ACTUALIZADO: Datos de incidencias actualizados con todos los campos
    // que espera ver_incidencias(2).js
    // ============================================================
    case 'ver_incidencia':
        // Datos de ejemplo con todos los campos del área metropolitana
        $incidencias = [
            [
                "id" => 501,
                "titulo" => "Falla de Alumbrado",
                "tipo" => "Alumbrado",
                "ciudad" => "Bucaramanga",
                "barrio" => "La Esperanza",
                "direccion" => "Carrera 27 # 45-12, cerca al parque principal",
                "descripcion" => "Poste parpadea toda la noche en la esquina de la carrera 27 con calle 45. El parpadeo es intermitente pero muy molesto para los residentes del sector. Se solicita revision urgente ya que lleva mas de una semana asi.",
                "usuario_id" => 12,
                "fecha" => "12 may 2026",
                "estado" => "Pendiente",
                "prioridad" => "Media",
                // AÑADIDO: Campos nuevos
                "latitud" => 7.1254,
                "longitud" => -73.1198,
                "fecha_hora_registro" => "12/05/26 08:30",
                "fecha_hora_resolucion" => null
            ],
            [
                "id" => 502,
                "titulo" => "Hueco en la Via",
                "tipo" => "Vialidad",
                "ciudad" => "Floridablanca",
                "barrio" => "Cacique",
                "direccion" => "Calle 56 # 23-45",
                "descripcion" => "Hueco grande en la calzada que dificulta el transito de vehiculos. Se solicita reparacion urgente.",
                "usuario_id" => 15,
                "fecha" => "10 may 2026",
                "estado" => "En Proceso",
                "prioridad" => "Alta",
                // AÑADIDO: Campos nuevos
                "latitud" => 7.0622,
                "longitud" => -73.0865,
                "fecha_hora_registro" => "10/05/26 14:15",
                "fecha_hora_resolucion" => null
            ],
            [
                "id" => 503,
                "titulo" => "Acumulacion de Basura",
                "tipo" => "Basura",
                "ciudad" => "Giron",
                "barrio" => "San Miguel",
                "direccion" => "Carrera 18 # 34-20",
                "descripcion" => "Contenedores desbordados desde hace 3 dias. Mal olor y proliferacion de insectos.",
                "usuario_id" => 8,
                "fecha" => "08 may 2026",
                "estado" => "Pendiente",
                "prioridad" => "Media",
                // AÑADIDO: Campos nuevos
                "latitud" => null,
                "longitud" => null,
                "fecha_hora_registro" => "08/05/26 09:45",
                "fecha_hora_resolucion" => null
            ],
            [
                "id" => 504,
                "titulo" => "Fuga de Agua",
                "tipo" => "Acueducto",
                "ciudad" => "Bucaramanga",
                "barrio" => "Cabecera",
                "direccion" => "Calle 36 # 19-50",
                "descripcion" => "Fuga de agua potable en la acera frente al parque. El agua se esta desperdiciando desde ayer.",
                "usuario_id" => 22,
                "fecha" => "15 may 2026",
                "estado" => "Resuelto",
                "prioridad" => "Alta",
                // AÑADIDO: Campos nuevos
                "latitud" => 7.1189,
                "longitud" => -73.1123,
                "fecha_hora_registro" => "14/05/26 16:20",
                "fecha_hora_resolucion" => "15/05/26 10:30"
            ],
            [
                "id" => 505,
                "titulo" => "Semaforo Danado",
                "tipo" => "Vialidad",
                "ciudad" => "Piedecuesta",
                "barrio" => "Centro",
                "direccion" => "Carrera 10 # 8-15",
                "descripcion" => "El semaforo de la esquina no cambia de luz. Peligro para peatones y conductores.",
                "usuario_id" => 33,
                "fecha" => "14 may 2026",
                "estado" => "En Proceso",
                "prioridad" => "Alta",
                // AÑADIDO: Campos nuevos
                "latitud" => 6.9875,
                "longitud" => -73.0512,
                "fecha_hora_registro" => "14/05/26 11:00",
                "fecha_hora_resolucion" => null
            ]
        ];

        $datos = $data['datos'] ?? [];

        if (!empty($datos['filtro_ciudad'])) {
            $incidencias = array_filter($incidencias, fn($i) => $i['ciudad'] === $datos['filtro_ciudad']);
        }
        if (!empty($datos['filtro_estado'])) {
            $incidencias = array_filter($incidencias, fn($i) => $i['estado'] === $datos['filtro_estado']);
        }
        if (!empty($datos['filtro_tipo'])) {
            $incidencias = array_filter($incidencias, fn($i) => $i['tipo'] === $datos['filtro_tipo']);
        }

        echo json_encode([
            "exito" => true,
            "mensaje" => "Incidencias obtenidas correctamente",
            "datos" => [
                "total" => count($incidencias),
                "incidencias" => array_values($incidencias)
            ]
        ]);
        break;

    // ==================== EDITAR INCIDENCIA ====================
    // ACTUALIZADO: Ahora acepta fecha_hora_resolucion desde
    // editarIncidencias(2).js
    // ============================================================
    case 'editar_incidencia':
        $datos = $data['datos'];

        if (empty($datos['incidencia_id'])) {
            http_response_code(400);
            echo json_encode(["exito" => false, "mensaje" => "ID de incidencia requerido", "datos" => null]);
            exit;
        }

        // AÑADIDO: Capturar fecha_hora_resolucion si viene
        $fecha_hora_resolucion = $datos['fecha_hora_resolucion'] ?? null;

        echo json_encode([
            "exito" => true,
            "mensaje" => "Incidencia actualizada correctamente",
            "datos" => [
                "incidencia_id" => $datos['incidencia_id'],
                "estado" => $datos['estado'] ?? 'Pendiente',
                "fecha_actualizacion" => date('Y-m-d H:i:s'),
                "cambios_aplicados" => array_keys($datos),
                // AÑADIDO: Devolver fecha_hora_resolucion en la respuesta
                "fecha_hora_resolucion" => $fecha_hora_resolucion
            ]
        ]);
        break;

    // ==================== DEFAULT ====================
    default:
        http_response_code(400);
        echo json_encode(["exito" => false, "mensaje" => "Accion no valida: '$accion'", "datos" => null]);
        break;
}
?>