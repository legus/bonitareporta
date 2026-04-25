/* ============================================================
   reporte.js — BonitaReporta
   Validación del formulario de reporte ciudadano
   ============================================================ */

'use strict';

        const form = document.getElementById('reportForm');
        const formCard = document.getElementById('formCard');
        const responseCard = document.getElementById('responseCard');
        const btnSubmit = document.getElementById('btnSubmit');
        const btnNew = document.getElementById('btnNew');

        // Datos de ejemplo prellenados
        const datosEjemplo = {
            titulo: 'Falla de Alumbrado',
            tipo: 'Alumbrado',
            descripcion: 'Poste parpadea toda la noche',
            zona: 'Bucaramanga',
            barrio: 'La Esperanza',
            usuario_id: '12',
            direccion: 'Carrera 27 # 45-12, cerca al parque principal'
        };

        // Prellenar formulario
        Object.keys(datosEjemplo).forEach(key => {
            const el = document.getElementById(key);
            if (el) el.value = datosEjemplo[key];
        });

        // Validación en tiempo real
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.parentElement.classList.contains('error')) {
                    validateField(input);
                }
            });
        });

        function validateField(field) {
            const group = field.closest('.form-group');
            if (!field.value.trim()) {
                group.classList.add('error');
                return false;
            } else {
                group.classList.remove('error');
                return true;
            }
        }

        function validateForm() {
            let valid = true;
            inputs.forEach(input => {
                if (!validateField(input)) valid = false;
            });
            return valid;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            btnSubmit.classList.add('loading');

            // Simular envío al servidor
            await new Promise(r => setTimeout(r, 1500));

            // Actualizar datos de respuesta
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            document.getElementById('ticketId').textContent = `Incidencia #501`;
            document.getElementById('estadoValue').textContent = 'Pendiente';
            document.getElementById('prioridadValue').textContent = 'Media';
            document.getElementById('sumTitulo').textContent = data.titulo;
            document.getElementById('sumTipo').textContent = data.tipo;
            document.getElementById('sumZona').textContent = `${data.zona} / ${data.barrio}`;
            document.getElementById('sumDireccion').textContent = data.direccion;
            document.getElementById('sumDescripcion').textContent = data.descripcion;

            // Cambiar vistas
            formCard.style.display = 'none';
            responseCard.classList.add('show');
            btnSubmit.classList.remove('loading');

            // Scroll al ticket
            responseCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        btnNew.addEventListener('click', () => {
            form.reset();
            responseCard.classList.remove('show');
            formCard.style.display = 'block';
            formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Volver a prellenar con ejemplo
            Object.keys(datosEjemplo).forEach(key => {
                const el = document.getElementById(key);
                if (el) el.value = datosEjemplo[key];
            });
        });
        