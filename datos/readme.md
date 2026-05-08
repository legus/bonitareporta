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
#### Parámetros de conexión

| Parámetro | Valor     |
|-----------|---------------|
| host      | localhost     |
| user      | root          |
| password  | (vacío)       |
| database  | bonitareporta |

#### Código completo

```php
<?php
// Parámetros de conexión
$host = "localhost";
$user = "root";
$password = "";
$database = "bonitareporta";

// Crear conexión
$conn = new mysqli($host, $user, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "insert_id" => null,
        "affected_rows" => 0,
        "error" => "Error de conexión: " . $conn->connect_error
    ]));
}

// Configurar charset para evitar problemas con acentos
$conn->set_charset("utf8");

?>
#sss
#segunda prueba del login