# BonitaReporta - Capa de Datos

Rama de trabajo: `feature/datos`

Esta capa recibe solicitudes en JSON desde las otras capas, las procesa con funciones PHP y devuelve los resultados desde MySQL. Ni la capa de presentación ni la de visualización tocan la base de datos directamente, todo pasa por aquí.

---

## Estructura de carpetas

```
datos/
├── api/
│   ├── Consultas/
│   │   └── endpoint.php        → solo SELECT (incidencias y estadísticas)
│   ├── Incidencias/
│   │   └── endpointdb.php      → INSERT, SELECT, UPDATE, DELETE de incidencias
│   ├── Usuarios/
│   │   └── endpoint.php        → INSERT, SELECT, UPDATE, DELETE de usuarios
│   ├── request.php             → entrada general, enruta por tabla y operación
│   ├── request.json            → ejemplo de solicitud
│   └── response.json           → ejemplo de respuesta
├── conf_datos/
│   └── conexion.php            → conexión PDO a MySQL
└── func_datos/
    ├── func.php                → funciones CRUD de incidencias
    ├── funcUsuarios.php        → funciones CRUD de usuarios
    └── funcConsultas.php       → funciones de solo lectura para consultas y estadísticas
```

---

## Cómo se comunican las capas

```
  [Capa Presentación]                    [Capa Visualización]
  formularios, login, registro           mapa, dashboard, filtros
          |                                       |
          |_______________POST (JSON)_____________|
                                |
                        [Capa de Datos]
                           api/
                            |
                        func_datos/
                            |
                   conf_datos/conexion.php
                            |
                     Base de datos MySQL
                       (bonitareporta)
```

Cada endpoint recibe el JSON, identifica la tabla y la operación, llama a la función de `func_datos/` correspondiente, y esa función ejecuta la consulta usando la conexión de `conf_datos/conexion.php`.

---

## Qué endpoint usa cada capa

| Capa          | Endpoint                         | Para qué lo usa                                           |
|---------------|----------------------------------|-----------------------------------------------------------|
| Presentación  | `api/Incidencias/endpointdb.php` | Crear reportes (INSERT) y actualizarlos (UPDATE)          |
| Presentación  | `api/Usuarios/endpoint.php`      | Registro de ciudadanos (INSERT) y login (SELECT)          |
| Visualización | `api/Consultas/endpoint.php`     | Cargar el dashboard con estadísticas y filtros del mapa   |
| Visualización | `api/Incidencias/endpointdb.php` | Traer las incidencias para mostrarlas en el mapa (SELECT) |

---

## Endpoint general — request.php

**POST** `datos/api/request.php`

Es la entrada general. Recibe cualquier solicitud, lee `table` y `operation`, y la manda a la función correcta. Importa los tres archivos de funciones: `func.php`, `funcUsuarios.php` y `funcConsultas.php`.

| table          | operations que acepta          |
|----------------|--------------------------------|
| `incidencias`  | INSERT, SELECT, UPDATE, DELETE |
| `usuarios`     | INSERT, SELECT, UPDATE, DELETE |
| `estadisticas` | solo SELECT                    |

Estructura base de la solicitud:

```json
{
  "operation": "INSERT",
  "table": "incidencias",
  "insert_data": {},
  "update_data": {},
  "condiciones": {}
}
```

No todos los campos son obligatorios en cada llamada. `insert_data` va en INSERT, `update_data` y `condiciones` van en UPDATE, y `condiciones` solo en SELECT y DELETE.

---

## Endpoint Incidencias — endpointdb.php

**POST** `datos/api/Incidencias/endpointdb.php`

Solo trabaja con la tabla `incidencias`. Si llega otra tabla en el JSON, devuelve error de una vez. Usa las funciones de `func_datos/func.php`.

> **Presentación** lo usa para que el ciudadano cree un reporte (INSERT) o lo edite (UPDATE).  
> **Visualización** lo usa con SELECT para mostrar las incidencias en el mapa.

### INSERT — crear incidencia

Solicitud:
```json
{
  "operation": "INSERT",
  "table": "incidencias",
  "insert_data": {
    "titulo": "Hueco en la carrera 33",
    "tipo": "Hueco",
    "descripcion": "Hueco profundo frente al colegio",
    "zona": "Sur",
    "barrio": "Cabecera",
    "usuario_id": 1,
    "lat": 7.1193,
    "lng": -73.1227,
    "estado": "",
    "prioridad": "Alta",
    "fecha_creacion": "2026-05-14 10:00:00"
  }
}
```

Respuesta:
```json
{
  "success": true,
  "insert_id": 101,
  "affected_rows": 1,
  "error": null
}
```

### SELECT — consultar incidencias

Solicitud:
```json
{
  "operation": "SELECT",
  "table": "incidencias",
  "condiciones": {
    "zona": "Sur"
  }
}
```

Respuesta:
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "titulo": "Hueco en la carrera 33",
      "zona": "Sur",
      "barrio": "Cabecera",
      "estado": "Reportado",
      "prioridad": "Alta"
    }
  ],
  "error": null
}
```

### UPDATE — actualizar incidencia

Solicitud:
```json
{
  "operation": "UPDATE",
  "table": "incidencias",
  "update_data": {
    "estado": "En proceso"
  },
  "condiciones": {
    "id": 101
  }
}
```

Respuesta:
```json
{
  "success": true,
  "affected_rows": 1,
  "error": null
}
```

### DELETE — eliminar incidencia

Solicitud:
```json
{
  "operation": "DELETE",
  "table": "incidencias",
  "condiciones": {
    "id": 101
  }
}
```

Respuesta:
```json
{
  "success": true,
  "affected_rows": 1,
  "error": null
}
```

---

## Endpoint Usuarios — endpoint.php

**POST** `datos/api/Usuarios/endpoint.php`

Solo trabaja con la tabla `usuarios`. Si llega otra tabla, devuelve error. Usa las funciones de `func_datos/funcUsuarios.php`.

> **Presentación** lo usa para registrar ciudadanos nuevos (INSERT), hacer login (SELECT), editar perfil (UPDATE) y eliminar cuenta (DELETE).

### INSERT — registrar usuario

Solicitud:
```json
{
  "operation": "INSERT",
  "table": "usuarios",
  "insert_data": {
    "nombre": "Laura Torres",
    "email": "laura@correo.com",
    "password": "hash_seguro",
    "rol": "ciudadano"
  }
}
```

Respuesta:
```json
{
  "success": true,
  "insert_id": 5,
  "affected_rows": 1,
  "error": null
}
```

### SELECT — obtener usuario

Solicitud:
```json
{
  "operation": "SELECT",
  "table": "usuarios",
  "condiciones": {
    "email": "laura@correo.com"
  }
}
```

Respuesta:
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "nombre": "Laura Torres",
      "email": "laura@correo.com",
      "rol": "ciudadano"
    }
  ],
  "error": null
}
```

### UPDATE — actualizar usuario

Solicitud:
```json
{
  "operation": "UPDATE",
  "table": "usuarios",
  "update_data": {
    "nombre": "Laura Torres Editada"
  },
  "condiciones": {
    "id": 5
  }
}
```

Respuesta:
```json
{
  "success": true,
  "affected_rows": 1,
  "error": null
}
```

### DELETE — eliminar usuario

Solicitud:
```json
{
  "operation": "DELETE",
  "table": "usuarios",
  "condiciones": {
    "id": 5
  }
}
```

Respuesta:
```json
{
  "success": true,
  "affected_rows": 1,
  "error": null
}
```

---

## Endpoint Consultas — endpoint.php

**POST** `datos/api/Consultas/endpoint.php`

Solo acepta SELECT. Si llega INSERT, UPDATE o DELETE responde con error sin procesar nada. Usa las funciones de `func_datos/funcConsultas.php`.

> **Visualización** lo usa para los filtros del mapa y para cargar el dashboard con estadísticas agrupadas.

### SELECT — consultar incidencias con filtros

Solicitud:
```json
{
  "operation": "SELECT",
  "table": "incidencias",
  "condiciones": {
    "zona": "Norte"
  }
}
```

Respuesta:
```json
{
  "success": true,
  "data": [
    {
      "id": 88,
      "titulo": "Falla de Alumbrado",
      "zona": "Norte",
      "barrio": "La Esperanza",
      "estado": "Reportado"
    }
  ],
  "error": null
}
```

### SELECT — consultar estadísticas

La función `consultarEstadisticas` hace tres consultas internas: total de incidencias, conteo agrupado por estado y conteo agrupado por zona. Todo llega junto en `data`.

Solicitud:
```json
{
  "operation": "SELECT",
  "table": "estadisticas",
  "condiciones": {}
}
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "total_incidencias": 42,
    "por_estado": [
      { "estado": "Reportado", "cantidad": 20 },
      { "estado": "En proceso", "cantidad": 15 },
      { "estado": "Resuelto", "cantidad": 7 }
    ],
    "por_zona": [
      { "zona": "Norte", "cantidad": 18 },
      { "zona": "Sur", "cantidad": 24 }
    ]
  },
  "error": null
}
```

---

## Funciones — func_datos/

### func.php

**Ubicación:** `datos/func_datos/func.php`  
**Lo importan:** `api/Incidencias/endpointdb.php` y `api/request.php`  
**Depende de:** `conf_datos/conexion.php` — todas las funciones usan `global $conn`

Tiene el CRUD completo de `incidencias`. Usa `bind_param` con sentencias preparadas para evitar inyección SQL. El INSERT recibe 11 campos con tipos `"sssssiddsss"`.

| Función | Parámetros | Qué hace |
|---------|------------|----------|
| `insertarIncidencia($data)` | array con titulo, tipo, descripcion, zona, barrio, usuario_id, lat, lng, estado, prioridad, fecha_creacion | Inserta la incidencia con prepared statement. Devuelve `insert_id` si salió bien. |
| `obtenerIncidencias($condiciones)` | array clave-valor, puede ir vacío | SELECT * de incidencias. Si hay condiciones filtra por el primer campo del array con WHERE. |
| `actualizarIncidencia($data, $condiciones)` | `$data` con los campos a cambiar / `$condiciones` con el WHERE | Arma el SET dinámicamente recorriendo `$data`. Agrega el valor de condiciones al final del bind_param. |
| `eliminarIncidencia($condiciones)` | array con campo y valor del filtro | DELETE con prepared statement sobre el campo que llegue en condiciones. |

---

### funcUsuarios.php

**Ubicación:** `datos/func_datos/funcUsuarios.php`  
**Lo importan:** `api/Usuarios/endpoint.php` y `api/request.php`  
**Depende de:** `conf_datos/conexion.php` — todas las funciones usan `global $conn`

Tiene el CRUD completo de `usuarios`. Misma lógica que `func.php` pero para la tabla de usuarios. El INSERT trabaja con cuatro campos: `nombre`, `email`, `password` y `rol`.

| Función | Parámetros | Qué hace |
|---------|------------|----------|
| `registrarUsuario($data)` | array con nombre, email, password y rol | Inserta el usuario con `bind_param("ssss", ...)`. Devuelve `insert_id` si salió bien. |
| `obtenerUsuario($condiciones)` | array clave-valor, puede ir vacío | SELECT * de usuarios. Si hay condiciones filtra por el primer campo. Sirve para el login buscando por email. |
| `actualizarUsuario($data, $condiciones)` | `$data` con los campos a cambiar / `$condiciones` con el WHERE | Construye el UPDATE dinámicamente igual que en incidencias. |
| `eliminarUsuario($condiciones)` | array con campo y valor del filtro | DELETE con prepared statement sobre el campo que llegue en condiciones. |

---

### funcConsultas.php

**Ubicación:** `datos/func_datos/funcConsultas.php`  
**Lo importan:** `api/Consultas/endpoint.php` y `api/request.php`  
**Depende de:** `conf_datos/conexion.php` — todas las funciones usan `global $conn`

Solo lectura. No tiene INSERT, UPDATE ni DELETE. Está hecha para darle a la capa de visualización los datos que necesita ya procesados, sin que tenga que hacer lógica extra.

| Función | Parámetros | Qué hace |
|---------|------------|----------|
| `consultarIncidencias($condiciones)` | array clave-valor con filtros opcionales | SELECT * de incidencias con filtro opcional por zona, estado, tipo, etc. La usa el mapa para cargar los puntos. |
| `consultarEstadisticas($condiciones)` | array clave-valor con filtros opcionales | Hace tres queries: `COUNT(*)` total, `GROUP BY estado` y `GROUP BY zona`. Devuelve todo junto en `data` con las claves `total_incidencias`, `por_estado` y `por_zona`. |

---

## Conexión a base de datos — conexion.php

**Ubicación:** `datos/conf_datos/conexion.php`

Crea la conexión usando PDO con `utf8mb4`. Todos los archivos de `func_datos/` la importan con `require_once` y acceden a la conexión con `global $conn`.

Si la conexión falla, registra el error en el log del servidor con `error_log()` y devuelve `null`, sin exponer el mensaje de error en la respuesta HTTP.

| Parámetro  | Valor             |
|------------|-------------------|
| host       | localhost         |
| user       | root              |
| password   | (vacío)           |
| database   | bonitareporta     |
| charset    | utf8mb4           |
| fetch mode | FETCH_ASSOC       |
| error mode | ERRMODE_EXCEPTION |

Opciones que se configuran en PDO:

- `ERRMODE_EXCEPTION` — los errores de SQL lanzan excepciones en vez de fallar silenciosamente
- `FETCH_ASSOC` — los resultados llegan como arrays asociativos
- `EMULATE_PREPARES => false` — usa prepared statements reales del servidor MySQL

Cómo la usan los archivos de funciones:

```
func.php / funcUsuarios.php / funcConsultas.php
    |
    └── require_once '../conf_datos/conexion.php'
              |
              └── $conn disponible con global $conn dentro de cada función
```

---

## Formato de respuesta

Todos los endpoints devuelven siempre la misma estructura para que presentación y visualización puedan manejar las respuestas de forma predecible sin casos especiales.

Cuando sale bien:
```json
{
  "success": true,
  "insert_id": 101,
  "affected_rows": 1,
  "error": null
}
```

Cuando falla algo:
```json
{
  "success": false,
  "insert_id": null,
  "affected_rows": 0,
  "error": "Descripción del error"
}
```

Notas:
- `insert_id` solo tiene valor en INSERT. En el resto siempre es `null`.
- `affected_rows` aplica en INSERT, UPDATE y DELETE.
- En SELECT exitoso los datos vienen en el campo `data` como array.
- `error` siempre es `null` cuando `success` es `true`.

---

## Tablas en la base de datos

| Tabla         | Descripción                                        |
|---------------|----------------------------------------------------|
| `incidencias` | Guarda los reportes que hacen los ciudadanos       |
| `usuarios`    | Guarda los ciudadanos registrados en la plataforma |
| `sectores`    | Guarda las zonas y barrios del municipio           |

---

## Barrios de Bucaramanga

- La Esperanza
- Cabecera
- Real de Minas
- Provenza