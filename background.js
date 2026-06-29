const SERVIDOR = "https://gmail-tracker-api.onrender.com";

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("checkVistas", { periodInMinutes: 0.5 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkVistas") {
    checkearVistas();
  }
});

async function checkearVistas() {
  console.log("Chequeando vistas...");

  chrome.storage.local.get("mails", async (localData) => {
    const mails = localData.mails || [];
    if (mails.length === 0) return;

    try {
      const response = await fetch(`${SERVIDOR}/registros`);
      const data = await response.json();

      let huboCambios = false;

      mails.forEach((mail) => {
        if (mail.visto) return;

        const hits = data.registros.filter(r => r.email_id === mail.id);
        const enviado = new Date(mail.enviado);
        const ahora = new Date();
        const minutosDesdeEnvio = (ahora - enviado) / 1000 / 60;

        console.log(`Mail ${mail.id} - hits: ${hits.length} - minutos desde envío: ${minutosDesdeEnvio.toFixed(1)}`);

        // Esperamos 2 minutos antes de considerar cualquier hit como apertura real
        if (hits.length >= 3 && minutosDesdeEnvio > 2) {
          mail.visto = true;
          huboCambios = true;

          chrome.notifications.create(`notif-${mail.id}`, {
            type: "basic",
            iconUrl: "icon.png",
            title: "Tu mail fue abierto",
            message: `Abierto el ${new Date(hits[0].timestamp).toLocaleString()}`
          });
        }
      });

      if (huboCambios) {
        chrome.storage.local.set({ mails });
      }

    } catch (e) {
      console.log("Error:", e.message);
    }
  });
}