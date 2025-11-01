import dayjs from "dayjs"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { ProgressSpinner } from 'primereact/progressspinner'
import { Card } from 'primereact/card';

// grafico
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ReferenceArea } from "recharts"

function TablaDashboard({ consultaLecturas, sensorNombre, sensorTipo, sensorMin, sensorMax, sensorIdentificador }) {

  const unidadMedida = () => {
    if (sensorTipo === 1) return " °C"
    if (sensorTipo === 2) return " %"
  }

  // Unir rango en la fila del sensor
  const unirRango = (rowData) => {
    if (sensorTipo === 1) return `${sensorMin} C° a ${sensorMax} C°`
    if (sensorTipo === 2) return `${sensorMin} % a ${sensorMax} %`
  }

  // Agregar unidad de medida a lecturas dependiendo del tipo de sensor
  const unidadMedidaLectura = (rowData) => {
    if (sensorTipo === 1) return ` ${rowData.lectura} °C`
    if (sensorTipo === 2) return ` ${rowData.lectura} %`
  }

  // Agregar estado a la lectura del sensor asignado
  const getEstadoLectura = (rowData) => {
    if (rowData < sensorMin) {
      return (
        <div >
          <span style={{ background: 'var(--indigo-600)', color: "white", borderRadius: "6px", paddingLeft: "1rem", paddingRight: "1rem" }}>Baja</span>
        </div>
      )
    }
    else if (rowData > sensorMax) {
      return (
        <div >
          <span style={{ background: 'var(--pink-600)', color: "white", borderRadius: "6px", paddingLeft: "1rem", paddingRight: "1rem" }}>Alta</span>
        </div>
      )
    }
    else {
      return (

        <div >
          <span style={{ background: 'var(--cyan-700)', color: "white", borderRadius: "6px", paddingLeft: "1rem", paddingRight: "1rem" }}>Normal</span>
        </div>
      )
    }
  }

  const datosRecharts = consultaLecturas.map(l => {
    return {
      fecha: dayjs(l.fecha).format("YY-MM-DD HH:mm:ss"),
      valor: l.lectura,
    }
  })

  const valoresLecturas = datosRecharts.map(d => d.valor);

  // Calcula mínimo y máximo entre límites y lecturas
  const minValor = Math.min(sensorMin, ...valoresLecturas);
  const maxValor = Math.max(sensorMax, ...valoresLecturas);

  // Calcula margen del 10%
  const margen = (maxValor - minValor) * 0.1;

  // Ajusta los valores con margen
  const minValorConMargen = minValor - margen;
  const maxValorConMargen = maxValor + margen;

  // Crear grafico
  const graficoRecharts = (
    datosRecharts.length > 0 ? (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={datosRecharts}>
          <CartesianGrid stroke="#eee" strokeDasharray="" />
          <XAxis
            dataKey="fecha"
            angle={-45}
            textAnchor="end"
            height={80}
            tickSize="0"
            tickMargin="10"
          />
          <YAxis
            domain={[minValorConMargen, maxValorConMargen]}
            tickFormatter={(value) => `${Number(value).toFixed(1)}${unidadMedida()}`}
            tickCount={10}
            tickMargin="10"
          />
          <Tooltip />

          <ReferenceArea
            y1={sensorMin}
            y2={sensorMax}
            strokeOpacity={0} // sin borde
            fill="rgba(0, 153, 255, 0.2)" // azul muy suave, puedes personalizar
          />


          <Line
            type="monotone"
            dataKey="valor"
            name={sensorNombre}
            stroke='var(--indigo-600)'
            strokeWidth={3}
            dot={{ r: 0, strokeWidth: 2, fill: "#ffffff" }}
          />

        </LineChart>
      </ResponsiveContainer>
    ) : (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
        <i className="pi pi-info-circle" style={{ fontSize: '1.5rem' }}></i>
        <p>No hay datos disponibles para graficar.</p>
      </div>
    )
  )


  if (datosRecharts.length > 0) {
    return (


      <div className="flex flex-col md:flex-row gap-4">

        {/* Grafica */}
        <div className="flex-1">
          <Card
            title={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div >Grafica - Ultimas lecturas</div>
              <div style={{ backgroundColor: "#DCFCE7", padding: "1rem", borderRadius: "0.5rem", height: "3rem", width: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="pi pi-chart-line" style={{ color: "#22C55E", fontSize: "1.5rem" }}></i>
              </div>
            </div>}

            subTitle = {sensorNombre}

            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "0rem", borderRadius: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e0e0e0", height: "auto" }}
            >

            <div className="w-full h-87 sm:h-94">
              {graficoRecharts}
            </div>
          </Card>
        </div>

        {/* Tabla de lecturas */}
        <div className="flex-1">
          <Card
            title={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Ultimas Lecturas </span>
              <div style={{ backgroundColor: "#EDE9FE", padding: "0.5rem", borderRadius: "0.5rem", height: "3rem", width: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="pi pi-list-check" style={{ color: "#7C3AED", fontSize: "1.5rem" }}></i>
              </div>
            </div>}

            subTitle = {sensorNombre}

            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "0rem", borderRadius: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e0e0e0", height: "auto" }}>
            <DataTable
              className="tabla-dashboard"
              value={consultaLecturas}
              size="small"
              scrollable
              scrollHeight="22rem"
            >

              
              <Column field="sensor_id" header="IDENTIFICADOR" sortable />
              <Column field="lectura" header="LECTURA" sortable body={unidadMedidaLectura} />
              <Column field="fecha" header="FECHA" sortable body={(rowData) => dayjs(rowData.fecha).format("DD/MM/YYYY HH:mm:ss")} />
              <Column field="estado_lectura" header="ESTADO" sortable body={(rowData) => getEstadoLectura(rowData.lectura)} />
              <Column field="min" header="RANGO" sortable body={unirRango} />
            </DataTable>
          </Card>
        </div>

      </div>
    )
  }

  if (!sensorIdentificador) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
        <p>Por favor seleccione un sensor de la tabla...</p>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
      <p>Cargando datos...</p>
      <ProgressSpinner
        style={{ width: '50px', height: '50px' }}
        strokeWidth="10"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
    </div>
  )
}

export default TablaDashboard