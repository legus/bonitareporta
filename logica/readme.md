# BonitaReporta - Capa de Lógica (Backend)

## 1. Descripción del Proyecto
Este repositorio contiene la lógica de negocio del sistema BonitaReporta, desarrollada en PHP. Se encarga de la validación, procesamiento y flujo de estados de las incidencias ciudadanas.

## 2. Requisitos de Instalación
1. Tener instalado PHP 8.x y Composer.
2. Clonar el repositorio.
3. Ejecutar `composer install`.
4. Configurar el archivo `.env` con las credenciales de la Capa de Datos.

## 3. Estructura del Proyecto
BonitaReporta-API/
├── config/             # Conexión PDO y configuración global
├── docs/               # api.md (Documentación detallada)
├── public/             # Punto de entrada único (index.php)
├── src/
│   ├── Controllers/    # Orquestadores de peticiones
│   ├── Models/         # Entidades de datos (Usuarios/Incidencias)
│   ├── Services/       # REGLAS DE NEGOCIO (Validaciones y lógica)
│   └── helpers/          # Seguridad y respuestas JSON estándar
├── vendor/             # Librerías de Composer
├── .env                # Variables sensibles (No subir a Git)
└── README.md           # Guía y Publicación de Contratos
## 4. Publicación de Contratos (API)
### Endpoint: POST /api/incidencias
**Request:**
```json
{
  "titulo": "Falla de Alumbrado",
  "tipo": "Alumbrado",
  "descripcion": "Poste parpadea toda la noche",
  "zona": "Norte",
  "barrio": "La Esperanza",
  "usuario_id": 12,
  "ubicacion": {
    "lat": 7.12,
    "lng": -73.11
  }
}

{
  "status": "success",
  "data": {
    "id_incidencia": 501,
    "estado": "Pendiente",
    "prioridad": "Media"
  }
}

{
  "status": "error",
  "message": "El campo 'tipo' es obligatorio y debe ser: Bache, Alumbrado, Residuos, Arboles u Otro."
}