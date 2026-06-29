const SERVIDOR = "https://gmail-tracker-api.onrender.com";

// Cada 30 segundos consulta el servidor
chrome.alarms.create("checkVistas", { periodInMinutes: 0.5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkVistas") {
    checkearVistas();
  }
});

async function checkearVistas() {
  try {
    const response = await fetch(`${SERVIDOR}/registros`);
    const data = await response.json();
    const registrosRemotos = data.registros;

    // Traemos los mails que enviamos
    chrome.storage.local.get("mails", (localData) => {
      const mails = localData.mails || [];

      mails.forEach((mail) => {
        if (mail.visto) return; // ya notificamos este

        const fueVisto = registrosRemotos.some(r => r.email_id === mail.id);

        if (fueVisto) {
          mail.visto = true;

          chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "📬 Tu mail fue abierto",
            message: `ID: ${mail.id}`
          });
        }
      });

      // Actualizamos el storage con los mails marcados como vistos
      chrome.storage.local.set({ mails });
    });

  } catch (e) {
    console.log("Error chequeando vistas:", e);
  }
}