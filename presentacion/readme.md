# README.md — BonitaReporta

## Descripción del proyecto

**BonitaReporta** es una aplicación web que permite a los ciudadanos registrar reportes sobre incidencias en su ciudad (alumbrado, vías, basura, etc.).

El sistema está construido siguiendo una **arquitectura por capas**, separando claramente la presentación, la lógica y la comunicación mediante API.

---

## Arquitectura

El proyecto se basa en una arquitectura de tres capas:

* **Capa de Presentación**
  Interfaz en HTML, CSS y JavaScript que captura y muestra datos.

* **Capa de Lógica**
  Procesa los datos enviados desde la interfaz y aplica reglas del sistema.

* **Capa de Datos (implícita)**
  Encargada del almacenamiento (no implementada completamente en esta fase).

---
## Estructura del proyecto

```bash
presentacion/
│
├── InicioSesion/
│   ├── inicio.html
│   ├── inicio.css
│   └── inicio.js
│
├── CrearCuenta/
│   ├── crear.html
│   ├── crear.css
│   └── crear.js
│
├── formulario/
│   ├── formulario.html
│   ├── formulario.css
│   └── formulario.js
│
├── VerIncidencias/
│   ├── ver_incidencias.html
│   ├── ver_incidencias.css
│   └── ver_incidencias.js
│
├── editarIncidencias/
│   ├── editarIncidencias.html
│   ├── editarIncidencias.css
│   └── editarIncidencias.js
│
├── index.html
├── index.css
├── index.js
└── README.md
```

---

## Comunicación con la API

La aplicación se comunica con la capa de lógica mediante solicitudes HTTP utilizando `fetch()`.


### contrato KPI 1
```json
{
  "operation": "SELECT",
  "table": "incidencias",
  "fields": ["tipo_incidencia", "estado", "COUNT(*) AS conteo"],
  "where": {
    "condition": "estado IN (?, ?)",
    "params": ["abierto", "en_proceso"]
  },
  "order_by": "tipo_incidencia ASC"
}
```
### contrato KPI 2
```json
{
  "operation": "SELECT",
  "table": "incidencias",
  "fields": [
    "tipo_incidencia",
    "AVG(TIMESTAMPDIFF(HOUR, fecha_reporte, fecha_cierre)) AS promedio_horas"
  ],
  "where": {
    "condition": "estado = ? AND fecha_cierre IS NOT NULL AND fecha_reporte >= ?",
    "params": ["resuelto", "FECHA_HACE_30_DIAS"]
  },
  "order_by": "tipo_incidencia ASC"
}
```

### contrato KPI3 (2 QUERIES)
```json
{
  "operation": "SELECT",
  "table": "incidencias",
  "fields": ["COUNT(*) AS total_reportadas"],
  "where": {
    "condition": "fecha_reporte >= ?",
    "params": ["FECHA_HACE_7_DIAS"]
  }
}
```

```json
{
  "operation": "SELECT",
  "table": "incidencias",
  "fields": ["COUNT(*) AS total_resueltas"],
  "where": {
    "condition": "estado = ? AND fecha_reporte >= ?",
    "params": ["resuelto", "FECHA_HACE_7_DIAS"]
  }
}
```
### contrato KPI 4
```json
{
  "operation": "SELECT",
  "table": "incidencias",
  "fields": [
    "ciudad_zona",
    "barrio",
    "COUNT(*) AS conteo"
  ],
  "where": {
    "condition": "estado NOT IN (?, ?) AND fecha_reporte >= ?",
    "params": ["resuelto", "cerrado", "FECHA_HACE_30_DIAS"]
  },
  "order_by": "conteo DESC, ciudad_zona ASC",
  "limit": [0, 10]
}
```
### contrato Kpi 5
```json
{
  "operation": "SELECT",
  "table": "incidencias",
  "fields": [
    "tipo_incidencia",
    "COUNT(*) AS conteo"
  ],
  "where": {
    "condition": "fecha_reporte >= ?",
    "params": ["FECHA_HACE_30_DIAS"]
  },
  "order_by": "conteo DESC"
}
```