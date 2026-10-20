# Guía del proyecto: Sabores del Perú

Esta guía explica cómo funciona la página web del restaurante **Sabores del Perú**. Está pensada para quien recién empieza con HTML, CSS y JavaScript. Lee primero la sección 1 y luego ve a la parte que te interese.

---

## 1. ¿Qué hace esta página?

Es un sitio web con **cuatro páginas**. Sirve para ver información de un restaurante y simular una reserva de mesa:

| Página | Archivo | Qué muestra |
|---|---|---|
| Inicio | `index.html` | Banner de bienvenida y tres tarjetas |
| Nosotros | `nosotros.html` | Historia, horarios, ubicación y teléfono |
| Menú Semanal | `menu.html` | Platos de lunes a domingo, con foto y precio |
| Reservas | `reservas.html` | Formulario para reservar una mesa |

> **Importante:** la reserva es una **simulación**. Cuando confirmas, la página solo muestra un mensaje. No guarda nada ni envía ningún correo, porque para eso haría falta un servidor.

---

## 2. Estructura de carpetas

```
Sabores_del_Peru_Web_Completo modificado/
├── index.html          ← página de inicio
├── nosotros.html
├── menu.html
├── reservas.html
├── css/
│   └── estilos.css     ← todos los colores, tamaños y posiciones
├── js/
│   └── script.js       ← la lógica (menú por días y reservas)
└── Imagenes del menu/  ← fotos de los platos
```

**Cada archivo hace un trabajo distinto:**

- **HTML** = el *contenido* (títulos, textos, imágenes, formulario).
- **CSS** = el *aspecto* (colores, tamaños, posiciones).
- **JavaScript** = el *comportamiento* (qué pasa cuando haces clic o envías el formulario).

Para ver la página, haz doble clic en `index.html`. No necesitas instalar nada.

---

## 3. Cómo se conectan las páginas

Las cuatro páginas comparten el mismo encabezado (el menú de arriba) y el mismo pie de página. Navegar de una a otra es un **enlace normal**:

```html
<a href="menu.html" class="tab-btn">Menú Semanal</a>
```

Al hacer clic, el navegador abre `menu.html`. La página activa se marca con la clase `active`, que en CSS pinta el botón de rojo:

```html
<a href="menu.html" class="tab-btn active">   <!-- esta es la página actual -->
```

Como el encabezado está copiado en cada archivo, **si cambias el menú de navegación, debes cambiarlo en las cuatro páginas**. Esto es normal en proyectos básicos. Más adelante verás formas de evitar la repetición.

Todas las páginas cargan los mismos archivos en su `<head>` y al final del `<body>`:

```html
<link rel="stylesheet" href="css/estilos.css">   <!-- en el head -->
...
<script src="js/script.js"></script>              <!-- al final del body -->
```

---

## 4. El CSS (`css/estilos.css`)

### 4.1 Variables de color

Al inicio del archivo están los colores guardados con un nombre:

```css
:root {
    --rojo-peru: #B71C1C;
    --dorado: #C68B59;
}
```

Después se usan así:

```css
.btn-primary { background: var(--rojo-peru); }
```

**Ventaja:** si quieres cambiar el rojo de toda la página, lo cambias en **un solo lugar**.

### 4.2 Las clases

En HTML le pones un nombre (`class`) a un elemento, y en CSS le das estilo con un punto delante:

```html
<div class="plato-card">...</div>
```
```css
.plato-card { background: white; border-radius: 12px; }
```

### 4.3 Clases importantes

| Clase | Para qué sirve |
|---|---|
| `.header`, `.nav-tabs`, `.tab-btn` | Encabezado y botones del menú de arriba |
| `.hero-banner` | Banner grande de la página de inicio (la foto de fondo está en el CSS) |
| `.platos-grid` | Cuadrícula de tarjetas de platos |
| `.dia-content` | Contenido de un día del menú; solo se ve el que tiene `active` |
| `.oculto` | Esconde un elemento (`display: none`) |
| `.error-form` | Mensaje de error en rojo bajo un campo |

### 4.4 Que se vea bien en el celular (responsive)

Al final del archivo están las reglas `@media`. Se activan **solo cuando la pantalla es pequeña**:

```css
@media (max-width: 768px) {
    .header-container { flex-direction: column; }
}
```

Eso significa: "si la pantalla mide 768 px de ancho o menos, pon el encabezado en columna".

---

## 5. El JavaScript (`js/script.js`)

Las cuatro páginas cargan el mismo archivo, pero cada parte **solo se ejecuta si encuentra sus elementos**. Por ejemplo, el código del formulario no hace nada en `index.html` porque ahí no existe ningún formulario.

El archivo empieza con esto:

```js
document.addEventListener('DOMContentLoaded', () => {
    iniciarMenuSemanal();
    iniciarReservas();
});
```

Significa: "cuando la página termine de cargar, ejecuta estas dos funciones".

### 5.1 Menú por días (`menu.html`)

Cada botón de día (Lunes, Martes...) tiene un atributo `data-dia`, y cada bloque de platos tiene un `id` igual:

```html
<button class="dia-btn" data-dia="martes">Martes</button>
...
<div id="martes" class="dia-content">...</div>
```

Cuando haces clic en un botón, el JavaScript hace tres pasos:

1. Le quita la clase `active` a **todos** los botones y bloques.
2. Le pone `active` al botón que presionaste.
3. Le pone `active` al bloque cuyo `id` coincide con el `data-dia`.

En CSS, `.dia-content` está oculto y `.dia-content.active` se muestra. Así se ve un solo día a la vez.

### 5.2 Reservas (`reservas.html`)

#### Qué pasa al abrir la página

- La fecha se llena con el día de **hoy**.
- No se pueden elegir días anteriores.
- Si la fecha es hoy, las **horas que ya pasaron aparecen deshabilitadas**.

#### Qué pasa al enviar el formulario

Funciones de ayuda:

| Función | Qué hace |
|---|---|
| `fechaDeHoy()` | Devuelve la fecha de hoy como `2026-10-14`, usando la hora de tu computadora |
| `formatearFecha()` | Convierte `2026-10-14` en *miércoles, 14 de octubre de 2026* |
| `formatearHora()` | Convierte `19:00` en *7:00 p. m.* |
| `actualizarHorasDisponibles()` | Deshabilita las horas que ya pasaron cuando la fecha es hoy |
| `validarFechaHora()` | Revisa que la fecha y la hora sean correctas y devuelve un mensaje de error si no |
| `enviarReserva()` | Se ejecuta al enviar el formulario: valida y muestra la confirmación |
| `resetFormulario()` | Limpia todo para hacer otra reserva |

El proceso al presionar **Confirmar Mi Reserva** es:

1. El navegador revisa los campos obligatorios (`required`). Si falta alguno, no deja continuar.
2. `enviarReserva()` llama a `validarFechaHora()`. Si hay error, lo muestra en rojo bajo la fecha y se detiene.
3. Si todo está bien, arma el mensaje con el nombre, las personas, la fecha y la hora, y lo muestra.
4. El formulario se esconde y aparece el mensaje de éxito.

#### Un detalle: mostrar y esconder

Para esconder el formulario no se escribe estilo directamente en JavaScript. Se le agrega la clase `oculto`, y el CSS hace el trabajo:

```js
form.classList.add('oculto');      // esconder
form.classList.remove('oculto');   // mostrar
```

Es una forma común y ordenada de trabajar: **el JavaScript cambia las clases y el CSS decide cómo se ve**.

#### Por qué se usa `textContent` y no `innerHTML`

El nombre lo escribe el usuario. Si se pusiera con `innerHTML`, alguien podría escribir código HTML como nombre y la página lo ejecutaría. Con `textContent` todo se trata como texto simple, así que es más seguro.

---

## 6. Cómo hacer cambios comunes

**Cambiar el color principal:** edita `--rojo-peru` al inicio de `css/estilos.css`.

**Cambiar un precio o descripción:** busca el nombre del plato en `menu.html` y edita el texto.

**Agregar un plato:** copia un bloque completo `<div class="plato-card">...</div>` dentro del día que quieras y cambia la imagen, el nombre, el precio y la descripción.

**Cambiar las horas de reserva:** en `reservas.html` busca el `<select id="hora">` y edita sus `<option>`. El `value` debe tener formato `HH:MM` (por ejemplo `19:00`), porque el JavaScript lo usa para comparar con la hora actual.

**Cambiar horario o teléfono:** edita `nosotros.html` y `reservas.html`. El teléfono aparece en ambas.

**Agregar una página nueva:**
1. Copia una página existente y cámbiale el contenido.
2. Agrega el enlace nuevo en el menú de **todas** las páginas.

---

## 7. Errores comunes

| Problema | Posible causa |
|---|---|
| La página se ve sin estilos | La ruta del CSS está mal (`css/estilos.css`) o moviste los archivos |
| Una imagen no aparece | El nombre no coincide exacto con el archivo (mayúsculas, espacios, extensión) |
| Los botones de día no funcionan | El `data-dia` del botón no es igual al `id` del bloque |
| El formulario no hace nada | Revisa la consola del navegador (tecla **F12**, pestaña *Consola*) |
| Los iconos o fuentes no cargan | Sin internet; las fuentes y los iconos vienen de internet |

---

## 8. Ideas para practicar

1. Cambia los colores de la página usando solo las variables del CSS.
2. Agrega un plato nuevo al menú del día que prefieras.
3. Agrega una cuarta opción de horario de cena.
4. Haz que el botón del día actual del menú aparezca seleccionado al abrir la página (pista: `new Date().getDay()`).
5. Valida que el teléfono tenga 9 dígitos (pista: el atributo `pattern` de HTML).
