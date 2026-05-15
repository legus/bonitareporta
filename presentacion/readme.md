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

### Ejemplo: Crear reporte

```json
{
  "accion": "crear_incidencia",
  "datos": {
    "titulo": "Falla de Alumbrado",
    "tipo": "Alumbrado",
    "descripcion": "No funcionan las luces",
    "zona": "Centro",
    "barrio": "La Esperanza",
    "direccion": "Cra 15 #45-32",
    "usuario_id": 12,
    "latitud": 7.1186,
    "longitud": -73.1161,
    "fecha_hora_registro": "15/05/26 16:55"
  }
}
```

### Ejemplo: Editar incidencia

```json

{
  "accion": "editar_incidencia",
  "datos": {
    "incidencia_id": 501,
    "titulo": "Falla de Alumbrado",
    "tipo": "Alumbrado",
    "estado": "Resuelto",
    "prioridad": "Media",
    "ciudad": "Bucaramanga",
    "barrio": "La Esperanza",
    "direccion": "Cra 15 #45-32",
    "descripcion": "Poste parpadea toda la noche",
    "fecha_hora_resolucion": "15/05/26 17:01"
  }
}

### Ejemplo: Inicio de sesión

```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}