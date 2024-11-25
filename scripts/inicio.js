(async function () {
  await checkToken();
})();

/** @type {HTMLHeadingElement} */
const temperaturaCorporalDisplayer = document.getElementById("temperature");
/** @type {HTMLDivElement} */
const bpmDisplayer = document.getElementById("bpm");
/** @type {HTMLHeadingElement} */
const helpStatus = document.getElementById("helpStatus");

// Actualizar el color del borde del círculo según el valor del ritmo cardíaco
const getBpmBorderColor = (bpm) => {
  if (bpm > 110) return "#ff1b00";
  if (bpm >= 58 && bpm <= 109) return "#00d9ff";
  return "#001f4d";
};

// Actualizar el color del borde del círculo según la temperatura
const getTempBorderColor = (temperatura) => {
  if (temperatura > 37.9) return "#ff1b00";
  if (temperatura >= 36 && temperatura <= 37.5) return "#00d9ff";
  return "#001f4d";
};

// Cambiar estado de ayuda
const toggleNecesitaAyuda = () => {
  necesitaAyuda = necesitaAyuda === "Sí" ? "No" : "Sí";
  document.getElementById(
    "helpStatus"
  ).innerText = `Necesita Ayuda: ${necesitaAyuda}`;
  if (necesitaAyuda === "Sí") {
    alert("La persona necesita ayuda");
  }
};

async function connectToWebsockets() {
  const env = await getenv();
  const ws = new WebSocket(env.ws_url);

  ws.onopen = function (event) {
    console.info("conexion a websockets iniciada", event);
  };

  ws.onmessage = function (event) {
    console.log(event.data);
    /** @type {BpmOrTempWSMessage | ToqueWSMessage} */
    const data = JSON.parse(event.data);
    if (!data.topic) return;
    switch (data.topic) {
      case "sensor/bpm":
        handleBpmChanges(data.parsedData.valor);
        break;

      case "sensor/temperatura":
        handleTempChanges(data.parsedData.valor);
        break;

      case "sensor/toque":
        handleToqueEvent(data.parsedData.valor);
        break;

      default:
        console.info("no implementado");
    }
  };

  ws.onclose = function (event) {
    console.warn(event);
    setTimeout(() => connectToWebsockets(), 5000);
  };

  ws.onerror = function (event) {
    console.error(event);
  };
}

function handleTempChanges(temp) {
  temperaturaCorporalDisplayer.innerText = temp;
  document.getElementById("tempCircle").style.borderColor =
    getTempBorderColor(temp);

  if (temperatura > 37.8) {
    alert("Advertencia: La temperatura corporal es alta");
  } else if (temperatura < 35.5) {
    alert("Advertencia: La temperatura corporal es baja");
  }
}

function handleBpmChanges(bpm) {
  bpmDisplayer.innerText = bpm;
  document.getElementById("bpmCircle").style.borderColor =
    getBpmBorderColor(bpm);

  if (bpm > 110) {
    alert("Advertencia: El ritmo cardíaco es alto");
  } else if (bpm < 58) {
    alert("Advertencia: El ritmo cardíaco es bajo");
  }
}

let lastTrueTimeout;

function handleToqueEvent(value) {
  if (value === true) {
    // Cancelar el temporizador anterior si existe
    if (lastTrueTimeout) {
      clearTimeout(lastTrueTimeout);
    }

    // Establecer el texto en "sí"
    helpStatus.innerText = "sí";

    // Configurar un nuevo temporizador para cambiar el texto a "no" después de 5 segundos
    lastTrueTimeout = setTimeout(() => {
      helpStatus.innerText = "no";
    }, 5000);
  }
}

// Asignar evento al botón
document
  .getElementById("toggleHelpButton")
  .addEventListener("click", toggleNecesitaAyuda);
connectToWebsockets();
