document.addEventListener('DOMContentLoaded', function() {
    const reservaForm = document.getElementById('reservaForm');
    const guardarConsultaBtn = document.getElementById('guardarConsulta');
    const verConsultasBtn = document.getElementById('verConsultas');
    const cerrarConsultasBtn = document.getElementById('cerrarConsultas');
    const consultasContainer = document.getElementById('consultasContainer');
    const listaConsultas = document.getElementById('listaConsultas');

    // Obtener el paquete seleccionado desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const paquete = urlParams.get('paquete');
    
    if (paquete && document.getElementById('paquete')) {
        document.getElementById('paquete').value = decodeURIComponent(paquete);
    }
    
    // Manejar envío del formulario de reserva
    if (reservaForm) {
        reservaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validarFormulario()) {
                guardarReserva();
                mostrarConfirmacion('¡Reserva enviada con éxito! ✔️');
                reservaForm.reset();
            }
        });
    }

    // Manejar guardado de consulta
    if (guardarConsultaBtn) {
        guardarConsultaBtn.addEventListener('click', function() {
            if (validarFormulario()) {
                guardarConsulta();
                mostrarConfirmacion('¡Consulta guardada correctamente! ✔️');
            }
        });
    }

    // Manejar visualización de consultas
    if (verConsultasBtn) {
        verConsultasBtn.addEventListener('click', function() {
            mostrarConsultasGuardadas();
        });
    }

    // Manejar cierre del panel de consultas
    if (cerrarConsultasBtn) {
        cerrarConsultasBtn.addEventListener('click', function() {
            consultasContainer.style.display = 'none';
        });
    }
});

function validarFormulario() {
    const nombre = document.getElementById('nombre')?.value;
    const email = document.getElementById('email')?.value;
    
    if (!nombre || nombre.trim() === '') {
        alert('Por favor ingresa tu nombre completo');
        return false;
    }
    
    if (!email || !email.includes('@') || !email.includes('.')) {
        alert('Ingresa un correo electrónico válido');
        return false;
    }
    
    return true;
}

function guardarReserva() {
    const reserva = {
        tipo: 'reserva',
        paquete: document.getElementById('paquete').value,
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        fecha: document.getElementById('fecha').value,
        personas: document.getElementById('personas').value,
        comentarios: document.getElementById('comentarios').value,
        fechaRegistro: new Date().toLocaleString()
    };
    
    // Guardar en localStorage
    localStorage.setItem('ultimaReservaViajesDaya', JSON.stringify(reserva));
    console.log('Reserva guardada:', reserva);
}

function guardarConsulta() {
    const consulta = {
        tipo: 'consulta',
        paquete: document.getElementById('paquete').value,
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        fecha: document.getElementById('fecha').value,
        personas: document.getElementById('personas').value,
        comentarios: document.getElementById('comentarios').value,
        fechaRegistro: new Date().toLocaleString()
    };
    
    // Obtener consultas existentes o crear array vacío
    const consultas = JSON.parse(localStorage.getItem('consultasViajesDaya')) || [];
    
    // Agregar nueva consulta
    consultas.push(consulta);
    
    // Guardar en localStorage (limitado a 50 consultas)
    localStorage.setItem('consultasViajesDaya', JSON.stringify(consultas.slice(-50)));
    console.log('Consulta guardada:', consulta);
}

function mostrarConsultasGuardadas() {
    const consultasContainer = document.getElementById('consultasContainer');
    const listaConsultas = document.getElementById('listaConsultas');
    
    // Obtener consultas de localStorage
    const consultas = JSON.parse(localStorage.getItem('consultasViajesDaya')) || [];
    
    // Limpiar lista
    listaConsultas.innerHTML = '';
    
    if (consultas.length === 0) {
        listaConsultas.innerHTML = '<p>No hay consultas guardadas.</p>';
    } else {
        consultas.forEach((consulta, index) => {
            const consultaItem = document.createElement('div');
            consultaItem.className = 'consulta-item';
            consultaItem.innerHTML = `
                <h4>Consulta #${index + 1} - ${consulta.paquete}</h4>
                <p><strong>Nombre:</strong> ${consulta.nombre}</p>
                <p><strong>Email:</strong> ${consulta.email}</p>
                <p><strong>Teléfono:</strong> ${consulta.telefono || 'No especificado'}</p>
                <p><strong>Fecha de viaje:</strong> ${consulta.fecha || 'No especificada'}</p>
                <p><strong>Personas:</strong> ${consulta.personas || 'No especificado'}</p>
                <p><strong>Comentarios:</strong> ${consulta.comentarios || 'Ninguno'}</p>
                <p class="consulta-fecha">Guardado el: ${consulta.fechaRegistro}</p>
            `;
            listaConsultas.appendChild(consultaItem);
        });
    }
    
    consultasContainer.style.display = 'block';
}

function mostrarConfirmacion(mensaje) {
    const confirmation = document.getElementById('confirmation');
    if (confirmation) {
        confirmation.textContent = mensaje;
        confirmation.style.display = 'block';
        
        setTimeout(() => {
            confirmation.style.display = 'none';
        }, 5000);
    }
}

// Función opcional para limpiar consultas antiguas (puedes llamarla cuando sea necesario)
function limpiarConsultasAntiguas() {
    localStorage.removeItem('consultasViajesDaya');
    if (document.getElementById('listaConsultas')) {
        document.getElementById('listaConsultas').innerHTML = '<p>No hay consultas guardadas.</p>';
    }
    mostrarConfirmacion('Consultas limpiadas correctamente');
}