console.log("Gmail Tracker Inicializando...");

const SERVIDOR = "https://gmail-tracker-api.onrender.com";

function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ARREGLADO: Envolvemos el bloque flotante adentro de la función correspondiente
function inyectarPixel(cuerpo, emailId) {
  const pixel = document.createElement("img");
  pixel.src = `${SERVIDOR}/track/${emailId}`;
  pixel.width = 1;
  pixel.height = 1;
  pixel.style.position = "absolute"; // Lo saca del flujo normal del texto
  pixel.style.opacity = "0";         // Invisible pero detectable
  pixel.className = "gmail-tracker-pixel";

  cuerpo.appendChild(pixel);
  console.log(`Pixel inyectado con ID: ${emailId}`);

  chrome.storage.local.get("mails", (data) => {
    const mails = data.mails || [];
    mails.push({ id: emailId, enviado: new Date().toISOString(), visto: false });
    chrome.storage.local.set({ mails });
  });
}

// Escuchamos el clic antes de que se envíe
document.addEventListener("mousedown", (event) => {
  const botonEnviar = event.target.closest(
    '[data-tooltip*="Send"], [data-tooltip*="Enviar"], [aria-label*="Send"], [aria-label*="Enviar"]'
  );

  if (botonEnviar) {
    // Tomamos todos los que matchean y buscamos el div, no el textarea
    const cuerpos = document.querySelectorAll('[aria-label="Message Body"]');
    const cuerpo = Array.from(cuerpos).find(el => el.tagName === "DIV");

    console.log("Cuerpo encontrado:", cuerpo);

    if (cuerpo) {
      const emailId = generarId();
      inyectarPixel(cuerpo, emailId);
    } else {
      console.log("ERROR: no se encontró el div del cuerpo");
    }
  }
});

console.log("Gmail Tracker Activo! 🚀");