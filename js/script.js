
document.addEventListener('DOMContentLoaded', () => {
    iniciarMenuSemanal();
    iniciarReservas();
});

// menu semanal

function iniciarMenuSemanal() {
    const diaBtns = document.querySelectorAll('.dias-nav .dia-btn');
    const diaContents = document.querySelectorAll('.menu-dias-container .dia-content');

    diaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetDia = btn.getAttribute('data-dia');

            diaBtns.forEach(b => b.classList.remove('active'));
            diaContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(targetDia).classList.add('active');
        });
    });
}

// reservas
const IDIOMA = "es-PE";

// Devuelve la fecha de hoy 
// toISOString usa UTC y en Lima cambia de día a las 7 pm
function fechaDeHoy() {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
}

// cambio de formato de fecha a letras
function formatearFecha(valor) {
    const [anio, mes, dia] = valor.split('-').map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    return fecha.toLocaleDateString(IDIOMA, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// formato pm am
function formatearHora(valor) {
    const [h, m] = valor.split(':').map(Number);
    const sufijo = h >= 12 ? 'p. m.' : 'a. m.';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`;
}

// deshabilita las horas que ya pasaron
function actualizarHorasDisponibles() {
    const fechaInput = document.getElementById('fecha');
    const horaSelect = document.getElementById('hora');
    const ahora = new Date();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
    const esHoy = fechaInput.value === fechaDeHoy();

    Array.from(horaSelect.options).forEach(opcion => {
        const [h, m] = opcion.value.split(':').map(Number);
        opcion.disabled = esHoy && (h * 60 + m) <= minutosAhora;
    });

    // Si la hora elegida quedó deshabilitada, pasar a la primera disponible
    if (horaSelect.selectedOptions[0].disabled) {
        const libre = Array.from(horaSelect.options).find(o => !o.disabled);
        if (libre) horaSelect.value = libre.value;
    }
}

// devuelve un mensaje de error o "" si la fecha y la hora son validas
function validarFechaHora() {
    const fecha = document.getElementById('fecha').value;
    const horaSelect = document.getElementById('hora');

    if (!fecha) {
        return 'Elige una fecha para tu reserva.';
    }
    if (fecha < fechaDeHoy()) {
        return 'La fecha ya pasó. Elige hoy o un día futuro.';
    }
    if (horaSelect.selectedOptions[0].disabled) {
        return 'Ya no hay horarios disponibles hoy. Elige otro día.';
    }
    return '';
}

function iniciarReservas() {
    const form = document.getElementById('formReserva');
    if (!form) return; // No estamos en reservas.html

    const fechaInput = document.getElementById('fecha');
    const errorFecha = document.getElementById('errorFecha');

    fechaInput.min = fechaDeHoy();
    fechaInput.value = fechaDeHoy();
    actualizarHorasDisponibles();

    fechaInput.addEventListener('change', () => {
        errorFecha.textContent = '';
        actualizarHorasDisponibles();
    });

    form.addEventListener('submit', enviarReserva);
    document.getElementById('btnOtraReserva').addEventListener('click', resetFormulario);
}

function enviarReserva(event) {
    event.preventDefault();

    const errorFecha = document.getElementById('errorFecha');
    const error = validarFechaHora();
    errorFecha.textContent = error;
    if (error) {
        document.getElementById('fecha').focus();
        return;
    }

    const nombre = document.getElementById('nombre').value;
    const personasValor = document.getElementById('personas').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    const personas = personasValor === '1' ? '1 persona' : `${personasValor} personas`;

    // textContent evita que el nombre se interprete como HTML
    const detalles = document.getElementById('detallesReserva');
    detalles.textContent = '';
    detalles.append(
        'Gracias ', negrita(nombre),
        ', tu mesa para ', negrita(personas),
        ' ha sido programada con éxito para el ', negrita(formatearFecha(fecha)),
        ' a las ', negrita(formatearHora(hora)),
        '. Te enviaremos un SMS/WhatsApp con el código de confirmación.'
    );

    document.getElementById('formReserva').classList.add('oculto');
    document.getElementById('mensajeConfirmacion').classList.remove('oculto');
}

function negrita(texto) {
    const el = document.createElement('strong');
    el.textContent = texto;
    return el;
}

function resetFormulario() {
    const form = document.getElementById('formReserva');

    form.reset();
    document.getElementById('fecha').value = fechaDeHoy();
    document.getElementById('errorFecha').textContent = '';
    actualizarHorasDisponibles();

    form.classList.remove('oculto');
    document.getElementById('mensajeConfirmacion').classList.add('oculto');
}
