
📩 Gmail Tracker 📩

Gmail Tracker es una extensión de Chrome que notifica al remitente cuando el 
destinatario abre su mail, usando un pixel de tracking invisible y un backend en python.

¿Qué hace?

Cada vez que enviás un mail desde Gmail, la exntensión inyecta una imagen 1x1
transparente en el cuerpo del mensaje. Cuando el destinatario abre el mail, 
su cliente de correo carga esa imagen desde tu servidos y vos recibís 
una notificación (notificación de windows) en menos de 30 segundos.


Stack

Extensión -> Chrome Extension (manifest V3, Javascript vanilla)
Backend -> Python + Flask 
Deploy 