
📩 Gmail Tracker 📩

Gmail Tracker es una extensión de Chrome que notifica al remitente cuando el 
destinatario abre su mail, usando un pixel de tracking invisible y un backend en python.

**¿Qué hace?**

Cada vez que enviás un mail desde Gmail, la exntensión inyecta una imagen 1x1
transparente en el cuerpo del mensaje. Cuando el destinatario abre el mail, 
su cliente de correo carga esa imagen desde tu servidos y vos recibís 
una notificación (notificación de windows) en menos de 30 segundos.


**Stack**

Extensión -> Chrome Extension (manifest V3, Javascript vanilla)
Backend -> Python + Flask 
Deploy -> Render (Versión gratuita)
Comunicación -> REST API + fetch
Persistencia local -> Chrome Storage API
Notificaciones -> Chrome Notifications API + Alarms API

**Cómo funciona**

Remitente hace click en Send 
            ↓
content.js intercepta el click
            ↓
inyecta <img src="servidor/track/ID_UNICO"> en el cuerpo del mail
            ↓
Mail viaja con el pixel embebido en el HTML 
            ↓
Destinatario abre el mail -> Su browser carga la imagen 
            ↓
Servidor Flask registra: email_id + timestamp
            ↓
 background.js consulta el servidor cada 30 segundos via Chrome Alarms
            ↓
 Detecta hit nuevo -> notificación en windows

**Instalación**

1. Clonar repositorio
git clone https://github.com/gero-gg/gmail-tracker.git
cd gmail-tracker

2. Levantar localmente el servidor
pip install -r requirements.txt
python server.py
⚠ El servidor corre en "http://localhost:5000", es decir, en tu propia compu.
Para que funcione con destinatarios reales, necestiás deployar el servidor
ver sección Deploy ⚠

3. Cargar la extensión en Chrome
    * Ir a chrome://Extension
    * Activar el modo desarrollador
    * Click en Cargar descomprimida o Load unpacked
    * Seleccionar la carpeta del proyecto

4. Configurar la URL del servidor
En content.js y background.js:
const SERVIDOR = "https://tu-servidor.onrender.com";

**Deploy en producción (Render)**

1. Crear cuenta gratis en render.com
2. Conectar el repositorio de github
3. Crear un nuevo Web Service en python
4. Render detecta automaticamente el requirements.txt
5. Una vez deployado, actualizar el servidor en ambos archivos js

**Endpoints**

* GET /track/<email_id> Registra una vista y devuelve el pixel transparente
* GET /registros Lista todos los registros de vistas

**Decisiones técnicas y problemas resueltos**

Estas son las cosas que aprendí y no estaban en ningún tutorial:

**Gmail pre-renderiza el botón Send**

Al cargar Gmail, la extensión detecta el botón Send inmediatamente aunque el Compose no esté visible. Gmail optimiza su interfaz pre-renderizando elementos del DOM en segundo plano. El MutationObserver permite detectar el momento exacto en que ese elemento aparece, sin importar si el usuario abrió el Compose o no.

**mousedown en el documento en lugar de click en el botón**

El listener directo en el botón Send no se disparaba porque Gmail tiene elementos superpuestos encima. La solución fue escuchar todos los clicks del documento y usar `.closest()` para detectar si el click fue dentro del botón o alguno de sus elementos hijo.

**El cuerpo del mail es un div, no un textarea**

Gmail renderiza dos elementos con `aria-label="Message Body"` — un textarea oculto y un div contenteditable visible. Inyectar el pixel en el textarea no funciona porque los textareas no aceptan elementos HTML hijo. Hay que apuntar específicamente al div usando `querySelectorAll` y filtrando por `tagName === "DIV"`.

**Timing: el cuerpo desaparece antes de que el código lo procese**

Al hacer click en Send, Gmail cierra el Compose casi instantáneamente. Para cuando el evento se procesa, el `[aria-label="Message Body"]` ya no existe en el DOM. La solución fue capturar la referencia al elemento en el momento del mousedown, cuando el Compose todavía está abierto, y usarla directamente.

**Pre-fetch de Gmail (el problema más interesante)**

Gmail escanea automáticamente todas las imágenes de los mails entrantes para detectar contenido malicioso. Esto genera hits en el servidor antes de que el destinatario abra nada. 
Después de medir, confirmé que Gmail hace exactamente 2 pre-fetches automáticos por mail enviado.
La solución fue ignorar los primeros 2 hits y notificar recién a partir del 3ro, además de esperar 2 minutos desde el envío para descartar los pre-fetches inmediatos.

**Lo que aprendí**

* Arquitectura de Chrome Extensions (Manifest V3): content scripts, service workers, storage API, alarms API, notifications API
* Por qué localhost no funciona para comunicación entre distintas máquinas
* CORS y por qué los browsers lo implementan
* Cómo funciona el DOM de Gmail como Single Page App
* El comportamiento interno de los clientes de mail: pre-fetch, bloqueo de imágenes, sandboxing
* Deploy de APIs Python en Render

**Autor**

Gerónimo Garcia
https://www.linkedin.com/in/gerogg

Proyecto construido como ejercicio de portfolio para practicar el desarrollo de extensiones de Chrome y APIs con python