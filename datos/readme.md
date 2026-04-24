## BonitaReporta - Capa de Datos

### Endpoint
POST /datos/api/request.php

### Solicitud (INSERT - crear reporte)

{
    "operacion": "INSERT",
    "tabla": "incidencias",
    "datos": {
        "titulo": "Hueco en la carrera 33",
        "tipo": "Hueco",
        "descripcion": "Hueco profundo frente al colegio",
        "sector": "Cabecera",
        "direccion": "Calle 55 # 33-22",
        "ciudadano_id": 1,
        "prioridad": "Alta"
    }
}

### Respuesta exitosa

{
    "success": true,
    "mensaje": "Incidencia reportada exitosamente",
    "insert_id": 101,
    "estado": "Reportado"
}

### Solicitud (SELECT - listar incidencias)

{
    "operacion": "SELECT",
    "tabla": "incidencias",
    "condiciones": {
        "sector": "Cabecera"
    }
}

### Respuesta SELECT

{
    "success": true,
    "rows": [
        {
            "id": 101,
            "titulo": "Hueco en la carrera 33",
            "sector": "Cabecera",
            "estado": "Reportado"
        }
    ]
}

### Barrios de Bucaramanga

- Cabecera
- Real de Minas
- Provenza

### Tablas creadas

- incidencias
- sectores

### Rama de trabajo

feature/datos

### Archivo: conexion.php

**Ubicación:** `datos/conf_datos/conexion.php`

**Función:** Establece la conexión con la base de datos MySQL.

