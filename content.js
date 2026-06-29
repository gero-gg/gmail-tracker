console.log("Gmail Tracker Activo!");

const SERVIDOR = "http://localhost:5000";

function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function inyectarPixel(emailId) {
  const pixel = document.createElement("img");
  pixel.src = `${SERVIDOR}/track/${emailId}`;
  pixel.width = 1;
  pixel.height = 1;
  pixel.style.display = "none";

  // Busca el cuerpo del mail y lo inyecta ahí
  const cuerpo = document.querySelector('[aria-label="Message Body"]');
  if (cuerpo) {
    cuerpo.appendChild(pixel);
    console.log(`Pixel inyectado con ID: ${emailId}`);

    // Guarda el ID en el storage de la extensión
    chrome.storage.local.get("mails", (data) => {
      const mails = data.mails || [];
      mails.push({ id: emailId, enviado: new Date().toISOString(), visto: false });
      chrome.storage.local.set({ mails });
    });
  }
}

function esperarBotonEnviar() {
  let listenerAgregado = false;

  const observer = new MutationObserver(() => {
    const botonEnviar = document.querySelector(
      '[data-tooltip*="Send"], [data-tooltip*="Enviar"], [aria-label*="Send"], [aria-label*="Enviar"]'
    );

    if (botonEnviar && !listenerAgregado) {
      listenerAgregado = true;

      botonEnviar.addEventListener("click", () => {
        const emailId = generarId();
        inyectarPixel(emailId);
      });

      console.log("Botón Enviar encontrado ✓");
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

esperarBotonEnviar();