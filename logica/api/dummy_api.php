<?php
/**
 * Dummy API - BonitaReporta
 * Archivo unificado para pruebas de integración
 * Cada acción se simula con respuestas predefinidas y validaciones básicas
 * NOTA: Este archivo es solo para desarrollo y pruebas. No debe usarse en producción.
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
    case 'crear_incidencia':
        $datos = $data['datos'];
        
        if (strpos($datos['titulo'], 'error') !== false) {
            http_response_code(500);
            echo json_encode(["exito" => false, "mensaje" => "No se pudo guardar el reporte", "datos" => null]);
            exit;
        }
        
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
                "tipo" => $datos['tipo']
            ]
        ]);
        break;

    // ==================== VER INCIDENCIAS ====================
    case 'ver_incidencia':
        $incidencias = [
            ["id" => 501, "titulo" => "Falla de Alumbrado", "tipo" => "Alumbrado", "ciudad" => "Bucaramanga", "barrio" => "La Esperanza", "direccion" => "Carrera 27 # 45-12", "descripcion" => "Poste parpadea toda la noche", "usuario_id" => 12, "fecha" => "2026-05-12", "estado" => "Pendiente", "prioridad" => "Media"],
            ["id" => 502, "titulo" => "Hueco en la Via", "tipo" => "Vialidad", "ciudad" => "Floridablanca", "barrio" => "Cacique", "direccion" => "Calle 56 # 23-45", "descripcion" => "Hueco grande en la calzada", "usuario_id" => 15, "fecha" => "2026-05-10", "estado" => "En Proceso", "prioridad" => "Alta"],
            ["id" => 503, "titulo" => "Acumulacion de Basura", "tipo" => "Basura", "ciudad" => "Giron", "barrio" => "San Miguel", "direccion" => "Carrera 18 # 34-20", "descripcion" => "Contenedores desbordados", "usuario_id" => 8, "fecha" => "2026-05-08", "estado" => "Pendiente", "prioridad" => "Media"]
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
    case 'editar_incidencia':
        $datos = $data['datos'];
        
        if (empty($datos['incidencia_id'])) {
            http_response_code(400);
            echo json_encode(["exito" => false, "mensaje" => "ID de incidencia requerido", "datos" => null]);
            exit;
        }
        
        echo json_encode([
            "exito" => true,
            "mensaje" => "Incidencia actualizada correctamente",
            "datos" => [
                "incidencia_id" => $datos['incidencia_id'],
                "estado" => $datos['estado'] ?? 'Pendiente',
                "fecha_actualizacion" => date('Y-m-d H:i:s'),
                "cambios_aplicados" => array_keys($datos)
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
