<?php

function insertarIncidencia($data) {
    return [
        "success"   => true,
        "insert_id" => 501,
        "error"     => null
    ];
}

function obtenerIncidencias($condiciones = []) {
    return [
        "success" => true,
        "data"    => [
            [
                "id_incidencia"      => 501,
                "titulo"             => "Falla de Alumbrado",
                "tipo"               => "Alumbrado",
                "descripcion"        => "Poste parpadea toda la noche",
                "zona"               => "Norte",
                "barrio"             => "La Esperanza",
                "direccion"          => "Calle 114A #43-25",
                "usuario_id"         => 12,
                "lat"                => 7.1100,
                "lng"                => -73.1130,
                "estado"             => "Reportado",
                "prioridad"          => "Media",
                "fecha_creacion"     => "2026-05-15 10:00:00",
                "fecha_finalizacion" => null
            ],
            [
                "id_incidencia"      => 502,
                "titulo"             => "Bache en la vía",
                "tipo"               => "Bache",
                "descripcion"        => "Bache grande en la carretera",
                "zona"               => "Sur",
                "barrio"             => "Sotomayor",
                "direccion"          => "Carrera 15 #20-10",
                "usuario_id"         => 8,
                "lat"                => 7.1280,
                "lng"                => -73.1190,
                "estado"             => "Resuelto",
                "prioridad"          => "Alta",
                "fecha_creacion"     => "2026-05-10 08:00:00",
                "fecha_finalizacion" => "2026-05-12 16:00:00"
            ]
        ],
        "error" => null
    ];
}

function actualizarIncidencia($data, $condiciones) {
    return [
        "success"       => true,
        "affected_rows" => 1,
        "error"         => null
    ];
}

function eliminarIncidencia($condiciones) {
    return [
        "success"       => true,
        "affected_rows" => 1,
        "error"         => null
    ];
}

function ejecutarConsulta($contrato) {
    // Simula respuestas según la operación y tabla
    $dummy = [
        // KPI 1 - incidentes activos por tipo
        [
            "tipo_incidencia" => "Alumbrado",
            "estado"          => "abierto",
            "conteo"          => 4
        ],
        [
            "tipo_incidencia" => "Bache",
            "estado"          => "en_proceso",
            "conteo"          => 6
        ],
        [
            "tipo_incidencia" => "Residuos",
            "estado"          => "abierto",
            "conteo"          => 3
        ],
        [
            "tipo_incidencia" => "Arboles",
            "estado"          => "en_proceso",
            "conteo"          => 2
        ]
    ];

    return [
        "success" => true,
        "data"    => $dummy,
        "error"   => null
    ];
}
?>