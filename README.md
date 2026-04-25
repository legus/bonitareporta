# BonitaReporta - Sistema de Incidencias Urbanas para Bucaramanga
Bucaramanga y su área metropolitana enfrentan desafíos diarios relacionados con el mantenimiento de la infraestructura pública: huecos en las vías, daños en el alumbrado público, acumulación de basuras en parques, semáforos averiados, etc. Los ciudadanos no cuentan con una herramienta digital sencilla y unificada para reportar estas incidencias a las autoridades locales

El sistema permitirá a los ciudadanos de  Bucaramanga reportar incidencias urbanas como huecos en las vías, luminarias dañadas, aceras en mal estado, basuras acumuladas, entre otras problemáticas comunes de la ciudad. Cada reporte podrá incluir ubicación
geográfica, fotografías, descripción y categoría de la incidencia.

# Detalle técnico
Aplicación web que permite a los ciudadanos de Bucaramanga reportar problemas de infraestructura urbana (huecos, luz dañada, basura, etc.) y a los administradores gestionar el estado de dichos reportes.

El sistema está diseñado bajo una arquitectura cliente-servidor e integra frontend, backend y base de datos, aplicando buenas prácticas de desarrollo web y control de versiones con Git y GitHub.

## Requisitos NO funcionales:
- Rendimiento:
   - El sistema debe responder en menos de 3 segundos
   - API con datos json y códigos HTTP correctos
- Usabilidad
   - Diseño responsivo (mobile-first)
   - Fácil de usar
- Seguridad: Validación de entradas, proteccion contra SQL Injection y XSS
- Escalabilidad y Modularidad:
   - Codigo modular que permita futuras expansiones
   - Separación de capas (FRONTEND / BACKEND y DATOS)
   - Control de versiones
- Compatibilidad: Funcionar en navegadores modernos (Chrome, Firefox, Edge)
-  Documentación técnica en README.md y docs/api.md

## Tecnologías utilizadas
- Frontend: HTML, CSS, JavaScript (Fetch API)
- Backend: PHP
- Base de datos: MySQL
- Servidor: Apache (XAMPP)
- Control de versiones: Git + GitHub

## Requisitos previos

- Servidor local con Apache + PHP (recomendado: XAMPP, WAMP)
- MySQL (incluido en XAMPP)
- Git y cuenta en GitHub
- Navegador web moderno

##  Instalación y configuración

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/legus/bonitareporta.git
   cd bonitareporta