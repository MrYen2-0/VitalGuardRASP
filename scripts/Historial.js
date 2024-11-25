const anteriorBpmfechaDia = document.getElementById("anteriorBpmfechaDia");
const anteriorBpmValueDia = document.getElementById("anteriorBpmValueDia");
const actualBpmfechaDia = document.getElementById("actualBpmfechaDia");
const actualBpmValueDia = document.getElementById("actualBpmValueDia");

const anteriorBpmfechaSemana = document.getElementById("anteriorBpmfechaSemana");
const anteriorBpmValueSemana = document.getElementById("anteriorBpmValueSemana");
const actualBpmfechaSemana = document.getElementById("actualBpmfechaSemana");
const actualBpmValueSemana = document.getElementById("actualBpmValueSemana");

const anteriorBpmfechaMes = document.getElementById("anteriorBpmfechaMes");
const anteriorBpmValueMes = document.getElementById("anteriorBpmValueMes");
const actualBpmfechaMes = document.getElementById("actualBpmfechaMes");
const actualBpmValueMes = document.getElementById("actualBpmValueMes");

const anteriorTempfechaDia = document.getElementById("anteriorTempfechaDia");
const anteriorTempValueDia = document.getElementById("anteriorTempValueDia");
const actualTempfechaDia = document.getElementById("actualTempfechaDia");
const actualTempValueDia = document.getElementById("actualTempValueDia");

const anteriorTempfechaSemana = document.getElementById("anteriorTempfechaSemana");
const anteriorTempValueSemana = document.getElementById("anteriorTempValueSemana");
const actualTempfechaSemana = document.getElementById("actualTempfechaSemana");
const actualTempValueSemana = document.getElementById("actualTempValueSemana");

const anteriorTempfechaMes = document.getElementById("anteriorTempfechaMes");
const anteriorTempValueMes = document.getElementById("anteriorTempValueMes");
const actualTempfechaMes = document.getElementById("actualTempfechaMes");
const actualTempValueMes = document.getElementById("actualTempValueMes");

// Estado global para mantener los datos
let estadisticas = {
    actualPromBpm: {
      dia: { valor: 0, fecha: "" },
      semana: { valor: 0, fecha: "" },
      mes: { valor: 0, fecha: "" }
    },
    anteriorPromBpm: {
      dia: { valor: 0, fecha: "" },
      semana: { valor: 0, fecha: "" },
      mes: { valor: 0, fecha: "" }
    },
    actualPromTemperatura: {
      dia: { valor: 0, fecha: "" },
      semana: { valor: 0, fecha: "" },
      mes: { valor: 0, fecha: "" }
    },
    anteriorPromTemperatura: {
      dia: { valor: 0, fecha: "" },
      semana: { valor: 0, fecha: "" },
      mes: { valor: 0, fecha: "" }
    }
  };
  
  // Conexión WebSocket
  const ws = new WebSocket('ws://localhost:9000');
  
  ws.onopen = () => {
    // Solicitar datos iniciales
    solicitarDatos();
  };
  
  ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
    if (data.success) {
      actualizarDatos(data);
    }
  };
  
  function solicitarDatos() {
    const periodos = ['dia', 'semana', 'mes'];
    const tipos = [
      { event: 'getBPMRecords', tipo: 'bpm' },
      { event: 'getTempRecords', tipo: 'temperatura' }
    ];
  
    periodos.forEach(periodo => {
      tipos.forEach(({ event }) => {
        ws.send(JSON.stringify({
          tiempo: periodo,
          event: event
        }));
      });
    });
}
  
/** @param {{ fechaActual: string, fechaAnterior: string, promActual: number, promAnterior: number, success: boolean, tiempo: string, tipo: string }} data */
function actualizarDatos(data){
    if (data.tipo === "bpm") {
        switch (data.tiempo) {
            case "dia":
                actualBpmValueDia.innerText = data.promActual;
                actualBpmfechaDia.innerText = data.fechaActual;
                anteriorBpmValueDia.innerText = data.promAnterior;
                anteriorBpmfechaDia.innerText = data.fechaAnterior;
                break;
            
            case "semana":
                actualBpmValueSemana.innerText = data.promActual;
                actualBpmfechaSemana.innerText = data.fechaActual;
                anteriorBpmValueSemana.innerText = data.promAnterior;
                anteriorBpmfechaSemana.innerText = data.fechaAnterior;
                break;
            
            case "mes":
                actualBpmValueMes.innerText = data.promActual;
                actualBpmfechaMes.innerText = data.fechaActual;
                anteriorBpmfechaMes.innerText = data.fechaAnterior;
                anteriorBpmValueMes.innerText = data.promAnterior;
                break;
            
            default:
                console.warn("not implemented time");
        }
    }else{
        switch (data.tiempo) {
            case "dia":
                actualTempValueDia.innerText = data.promActual;
                actualTempfechaDia.innerText = data.fechaActual;
                anteriorTempValueDia.innerText = data.promAnterior;
                anteriorTempfechaDia.innerText = data.fechaAnterior;
                break;
            
            case "semana":
                actualTempValueSemana.innerText = data.promActual;
                actualTempfechaSemana.innerText = data.fechaActual;
                anteriorTempValueSemana.innerText = data.promAnterior;
                anteriorTempfechaSemana.innerText = data.fechaAnterior;
                break;
            
            case "mes":
                actualTempValueMes.innerText = data.promActual;
                actualTempfechaMes.innerText = data.fechaActual;
                anteriorTempValueMes.innerText = data.promAnterior;
                anteriorTempfechaMes.innerText = data.fechaAnterior;
                break;
            
            default:
                console.warn("event not implemented");
        }
    }
}
  
  
  function downloadExcel() {
    const wsData = [
      ["Periodo", "Valor", "Fecha"],
      ["Día (Actual BPM)", estadisticas.actualPromBpm.dia.valor, estadisticas.actualPromBpm.dia.fecha],
      ["Semana (Actual BPM)", estadisticas.actualPromBpm.semana.valor, estadisticas.actualPromBpm.semana.fecha],
      ["Mes (Actual BPM)", estadisticas.actualPromBpm.mes.valor, estadisticas.actualPromBpm.mes.fecha],
      ["Día (Anterior BPM)", estadisticas.anteriorPromBpm.dia.valor, estadisticas.anteriorPromBpm.dia.fecha],
      ["Semana (Anterior BPM)", estadisticas.anteriorPromBpm.semana.valor, estadisticas.anteriorPromBpm.semana.fecha],
      ["Mes (Anterior BPM)", estadisticas.anteriorPromBpm.mes.valor, estadisticas.anteriorPromBpm.mes.fecha],
      ["Día (Anterior Temperatura)", estadisticas.anteriorPromTemperatura.dia.valor, estadisticas.anteriorPromTemperatura.dia.fecha],
      ["Semana (Anterior Temperatura)", estadisticas.anteriorPromTemperatura.semana.valor, estadisticas.anteriorPromTemperatura.semana.fecha],
      ["Mes (Anterior Temperatura)", estadisticas.anteriorPromTemperatura.mes.valor, estadisticas.anteriorPromTemperatura.mes.fecha],
      ["Día (Actual Temperatura)", estadisticas.actualPromTemperatura.dia.valor, estadisticas.actualPromTemperatura.dia.fecha],
      ["Semana (Actual Temperatura)", estadisticas.actualPromTemperatura.semana.valor, estadisticas.actualPromTemperatura.semana.fecha],
      ["Mes (Actual Temperatura)", estadisticas.actualPromTemperatura.mes.valor, estadisticas.actualPromTemperatura.mes.fecha],
      ["probabilidad de ataque cardiaco", estadisticas.actualPromBpm.semana.valor/150 + "%"]
    ];
  
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, "estadisticas.xlsx");
  }