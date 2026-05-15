# BonitaReporta - Capa de Datos

Rama: `feature/datos`

Esta es la capa de datos del proyecto BonitaReporta. Se encarga de recibir solicitudes en formato JSON, procesarlas con funciones PHP y devolver los resultados desde la base de datos MySQL. Las otras capas (presentación y visualización) se comunican con esta capa mandando peticiones POST.

---

## Estructura del proyecto

```
datos/
├── api/
│   ├── Consultas/
│   │   └── endpoint.php        (solo SELECT - para estadísticas y filtros)
│   ├── Incidencias/
│   │   └── endpointdb.php      (INSERT, SELECT, UPDATE, DELETE de incidencias)
│   ├── Usuarios/
│   │   └── endpoint.php        (INSERT, SELECT, UPDATE, DELETE de usuarios)
│   ├── request.php             (entrada general, enruta según tabla y operación)
│   ├── request.json            (ejemplo de solicitud)
│   └── response.json           (ejemplo de respuesta)
├── conf_datos/
│   └── conexion.php            (conexión a MySQL)
└── func_datos/
    ├── func.php                (funciones de incidencias)
    ├── funcUsuarios.php        (funciones de usuarios)
    └── funcConsultas.php       (funciones de consultas y estadísticas)
```

---

## Cómo se conectan las capas

La presentación y la visualización no tocan la base de datos directamente. Todo pasa por esta capa:

```
[Capa Presentación]         [Capa Visualización]
  formularios, login           mapa, dashboard
        |                           |
        |______POST (JSON)__________|
                    |
            [Capa de Datos]
         api/ → func_datos/ → conf_datos/conexion.php
                    |
              Base de datos MySQL
              (bonitareporta)
```

### Qué endpoint usa cada capa

| Capa | Qué usa | Para qué |
|------|---------|----------|
| Presentación | `api/Incidencias/endpointdb.php` | Crear y editar reportes ciudadanos |
| Presentación | `api/Usuarios/endpoint.php` | Registro, login y edición de perfil |
| Visualización | `api/Consultas/endpoint.php` | Dashboard de estadísticas y filtros del mapa |
| Visualización | `api/Incidencias/endpointdb.php` (SELECT) | Mostrar incidencias en el mapa |

---

## Endpoint general — request.php

**POST** `datos/api/request.php`

Es la puerta de entrada general. Recibe la solicitud y la redirige a la función correcta dependiendo de `table` y `operation`. Internamente usa los tres archivos de funciones: `func.php`, `funcUsuarios.php` y `funcConsultas.php`.

Tablas y operaciones que acepta:

| table | operations permitidas |
|-------|-----------------------|
| `incidencias` | INSERT, SELECT, UPDATE, DELETE |
| `usuarios` | INSERT, SELECT, UPDATE, DELETE |
| `estadisticas` | solo SELECT |

Estructura base de cualquier solicitud:

```json
{
  "operation": "INSERT",
  "table": "incidencias",
  "insert_data": {},
  "update_data": {},
  "condiciones": {}
}
```

Los campos `insert_data`, `update_data` y `condiciones` se usan según la operación. No todos son obligatorios en cada llamada.

---

## Endpoint Incidencias — endpointdb.php

**POST** `datos/api/Incidencias/endpointdb.php`

Trabaja únicamente con la tabla `incidencias`. Si se manda otra tabla, devuelve error. Usa las funciones de `func_datos/func.php`.

**Lo usan:**
- Capa de presentación → para que el ciudadano cree un reporte nuevo (INSERT) o lo edite (UPDATE)
- Capa de visualización → para traer los reportes y mostrarlos en el mapa (SELECT)

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

Respuesta exitosa:
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

Respuesta exitosa:
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

Respuesta exitosa:
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

Respuesta exitosa:
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

Trabaja únicamente con la tabla `usuarios`. Si se manda otra tabla, devuelve error. Usa las funciones de `func_datos/funcUsuarios.php`.

**Lo usa:**
- Capa de presentación → para registrar ciudadanos nuevos (INSERT), hacer login (SELECT), actualizar perfil (UPDATE) y eliminar cuenta (DELETE)

### INSERT — registrar usuario

Solicitud:
```json
{
  "operation": "INSERT",
  "table": "usuarios",
  "insert_data": {
    "nombre": "Laura Torres",
    "correo": "laura@correo.com",
    "password": "hash_seguro"
  }
}
```

Respuesta exitosa:
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
    "correo": "laura@correo.com"
  }
}
```

Respuesta exitosa:
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "nombre": "Laura Torres",
      "correo": "laura@correo.com"
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

Respuesta exitosa:
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

Respuesta exitosa:
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

Este endpoint solo permite operaciones SELECT. Si se manda INSERT, UPDATE o DELETE, responde con error automáticamente. Usa las funciones de `func_datos/funcConsultas.php`.

**Lo usa:**
- Capa de visualización → para los filtros del mapa y para alimentar el dashboard con estadísticas

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

Respuesta exitosa:
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

Solicitud:
```json
{
  "operation": "SELECT",
  "table": "estadisticas",
  "condiciones": {
    "zona": "Norte"
  }
}
```

Respuesta exitosa:
```json
{
  "success": true,
  "data": [
    {
      "zona": "Norte",
      "total": 15,
      "pendientes": 8,
      "en_proceso": 5,
      "resueltas": 2
    }
  ],
  "error": null
}
```

---

## Funciones — func_datos/

### func.php

**Ubicación:** `datos/func_datos/func.php`
**Lo importan:** `api/Incidencias/endpointdb.php` y `api/request.php`
**Depende de:** `conf_datos/conexion.php`

Tiene todas las funciones para manejar la tabla `incidencias`. Usa sentencias preparadas para evitar inyección SQL.

| Función | Parámetros | Qué hace |
|---------|------------|----------|
| `insertarIncidencia($data)` | array con los campos de la incidencia | Inserta una incidencia nueva. Usa `bind_param` con 11 campos. Devuelve el `insert_id` si fue exitoso. |
| `obtenerIncidencias($condiciones)` | array clave-valor, puede ir vacío | Trae todas las incidencias. Si se pasan condiciones, filtra por el primer campo del array. |
| `actualizarIncidencia($data, $condiciones)` | `$data` campos a cambiar / `$condiciones` filtro | Arma el UPDATE dinámicamente con los campos que lleguen. Usa sentencia preparada. |
| `eliminarIncidencia($condiciones)` | array con el campo y valor del filtro | Elimina la incidencia que coincida. Usa sentencia preparada. |

---

### funcUsuarios.php

**Ubicación:** `datos/func_datos/funcUsuarios.php`
**Lo importan:** `api/Usuarios/endpoint.php` y `api/request.php`
**Depende de:** `conf_datos/conexion.php`

Tiene todas las funciones para manejar la tabla `usuarios`.

| Función | Parámetros | Qué hace |
|---------|------------|----------|
| `registrarUsuario($data)` | array con los datos del usuario | Inserta un usuario nuevo en la base de datos. |
| `obtenerUsuario($condiciones)` | array clave-valor, puede ir vacío | Trae uno o varios usuarios. Si se pasan condiciones, filtra por el primer campo. |
| `actualizarUsuario($data, $condiciones)` | `$data` campos a cambiar / `$condiciones` filtro | Actualiza los datos del usuario que coincida con la condición. |
| `eliminarUsuario($condiciones)` | array con el campo y valor del filtro | Elimina el usuario que coincida con la condición. |

---

### funcConsultas.php

**Ubicación:** `datos/func_datos/funcConsultas.php`
**Lo importan:** `api/Consultas/endpoint.php` y `api/request.php`
**Depende de:** `conf_datos/conexion.php`

Solo tiene funciones de lectura. No hace INSERT, UPDATE ni DELETE. Está pensada para alimentar la capa de visualización con datos ya procesados.

| Función | Parámetros | Qué hace |
|---------|------------|----------|
| `consultarIncidencias($condiciones)` | array clave-valor con filtros opcionales | Devuelve incidencias filtradas por zona, estado, tipo, etc. La usa principalmente el mapa. |
| `consultarEstadisticas($condiciones)` | array clave-valor con filtros opcionales | Devuelve conteos y agrupaciones (totales por zona, por estado) para el dashboard de visualización. |

---

## Conexión a base de datos — conexion.php

**Ubicación:** `datos/conf_datos/conexion.php`

Crea la conexión MySQL con `mysqli`. La usan todos los archivos de `func_datos/` importándola con `require_once` y accediendo a `$conn` como variable global.

Si la conexión falla, devuelve un JSON de error con la misma estructura que usan todos los endpoints, para que la respuesta sea uniforme siempre.

| Parámetro | Valor |
|-----------|-------|
| host | localhost |
| user | root |
| password | (vacío) |
| database | bonitareporta |
| charset | utf8 |

Cómo fluye la conexión:

```
func.php / funcUsuarios.php / funcConsultas.php
    |
    └── require_once '../conf_datos/conexion.php'
              |
              └── $conn disponible como global en todas las funciones
```

---

## Formato de respuesta

Todos los endpoints de esta capa devuelven siempre la misma estructura JSON para que la presentación y la visualización puedan manejar las respuestas de forma predecible.

Respuesta exitosa:
```json
{
  "success": true,
  "insert_id": 101,
  "affected_rows": 1,
  "error": null
}
```

Respuesta con error:
```json
{
  "success": false,
  "insert_id": null,
  "affected_rows": 0,
  "error": "Descripción del error"
}
```

Notas:
- `insert_id` solo tiene valor en operaciones INSERT. En SELECT, UPDATE y DELETE siempre es `null`.
- `affected_rows` indica cuántas filas fueron modificadas. En SELECT es `null`.
- `error` siempre es `null` cuando `success` es `true`.

---

## Tablas en la base de datos

| Tabla | Descripción |
|-------|-------------|
| `incidencias` | Guarda los reportes que hacen los ciudadanos |
| `usuarios` | Guarda los ciudadanos registrados en la plataforma |
| `sectores` | Guarda las zonas y barrios del municipio |

---

## Barrios de Bucaramanga

- La Esperanza
- Cabecera
- Real de Minas
- Provenza