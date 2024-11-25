(async function () {
    await checkToken(); //aqui esta la funcion de validacion del token, no hace falta que la implementes
})();
/** @type {HTMLTableCellElement} */
const bpmValueDisplayer = document.querySelectorAll("tr#bpmValues > th")[1]; //aqui va actualBpm.valor
/** @type {HTMLTableCellElement} */
const fechaBpmDisplayer = document.querySelectorAll("tr#bpmValues > th")[0]; // aqui va actualBpm.cuando
/** @type {HTMLTableCellElement} */
const tempValueDisplayer = document.querySelectorAll("tr#tempValues > th")[1]; // lo mismo para temperatura
/** @type {HTMLTableCellElement} */
const fechaTempDisplayer = document.querySelectorAll("tr#tempValues > th")[0]; // "" ""
let actualBpm = { valor: 0, cuando: "xx-xx-xx" };
let actualTemperatura = { valor: 0, cuando: "xx-xx-xx" };
let picoBpm = { valor: 0, cuando: "xx-xx-xx" };
let picoTemp = { valor: 0, cuando: "xx-xx-xx" };

let globws;

async function connectToWebsockets() {
    const env = await getenv();
    const ws = new WebSocket(env.ws_url); // Reemplaza con tu URL de WebSocket.
    globws = ws;
    ws.onopen = function (event) {
        console.log("WebSocket abierto:", event);
    };

    ws.onmessage = function (event) {
        const now = new Date();
        const parsedData = JSON.parse(event.data);
    
        switch (parsedData.topic) {
            case "sensor/bpm":
                // Actualizar gráfico de Ritmo Cardíaco
                cardiacoChart.data.labels.push(now.toLocaleTimeString());
                cardiacoChart.data.labels.shift(); // Mantener el tamaño constante
                cardiacoChart.data.datasets[0].data.push(parsedData.parsedData.valor);
                cardiacoChart.data.datasets[0].data.shift();
                cardiacoChart.update();
    
                // Actualizar valores en la interfaz
                bpmValueDisplayer.textContent = parsedData.parsedData.valor;
                fechaBpmDisplayer.textContent = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
    
                // Actualizar pico de BPM
                if (picoBpm.valor < parsedData.parsedData.valor) {
                    picoBpm = { valor: parsedData.parsedData.valor, cuando: now.toLocaleTimeString() };
                }
                break;
    
            case "sensor/temperatura":
                // Actualizar gráfico de Temperatura Corporal
                temperaturaChart.data.labels.push(now.toLocaleTimeString());
                temperaturaChart.data.labels.shift();
                temperaturaChart.data.datasets[0].data.push(parsedData.parsedData.valor);
                temperaturaChart.data.datasets[0].data.shift();
                temperaturaChart.update();
    
                // Actualizar valores en la interfaz
                tempValueDisplayer.textContent = parsedData.parsedData.valor;
                fechaTempDisplayer.textContent = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
    
                // Actualizar pico de Temperatura
                if (picoTemp.valor < parsedData.parsedData.valor) {
                    picoTemp = { valor: parsedData.parsedData.valor, cuando: now.toLocaleTimeString() };
                }
                break;
    
            default:
                console.log("Tema desconocido");
        }
    };
    

}

(async function () {
    await connectToWebsockets(); 
})();

// Crear el gráfico de Ritmo Cardíaco
const cardiacoChart = new Chart(document.getElementById('cardiacoChart'), {
    type: 'line',
    data: {
        labels: ["12:00", "12:03", "12:06", "12:09", "12:12", "12:15", "12:18", "12:21", "12:24", "12:27"],
        datasets: [{
            label: "Ritmo Cardíaco (BPM)",
            data: [70, 72, 74, 75, 73, 72, 71, 72, 73, 80],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true
        }]
    },
    options: {
        scales: {
            x: { title: { display: true, text: 'Tiempo' } },
            y: { title: { display: true, text: 'Valor' }, min: 0, max: 200 }
        }
    }
});

// Crear el gráfico de Temperatura Corporal
const temperaturaChart = new Chart(document.getElementById('temperaturaChart'), {
    type: 'line',
    data: {
        labels: ["12:00", "12:03", "12:06", "12:09", "12:12", "12:15", "12:18", "12:21", "12:24", "12:27"],
        datasets: [{
            label: "Temperatura Corporal (°C)",
            data: [35, 37.9, 36.8, 36.7, 36, 37.7, 36.6, 36.5, 36.6, 34.6],
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: true
        }]
    },
    options: {
        scales: {
            x: { title: { display: true, text: 'Tiempo' } },
            y: { title: { display: true, text: 'Valor' }, min: 0, max: 50 }
        }
    }
});

async function saveRecord(event, valor) {
    const message = {
        event: event,
        body: { valor: valor }
    };
    if (globws.readyState === WebSocket.OPEN) {
        globws.send(JSON.stringify(message));
    } else {
        console.error("WebSocket no está abierto. No se pudo enviar:", message);
    }
}


// Guardar BPM cada 5 minutos
setInterval(() => {
    saveRecord("insertBPMRecords", bpmValueDisplayer.textContent);
}, 300000); // 300000 ms = 5 minutos

// Guardar Temperatura cada 5 minutos 
setInterval(() => {
    saveRecord("insertTempRecords", tempValueDisplayer.textContent);
}, 300000);
