import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Calendar } from "primereact/calendar"
import { Button } from "primereact/button"
import { Card } from "primereact/card"

import dayjs from "dayjs"

// Exportar pdf
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'

function TablaLecturas({ consulta, lecturasFechaInicio, setLecturasFechaInicio, lecturasFechaFin, setLecturasFechaFin, sensorIdentificador, sensorMin, sensorMax, sensorTipo, sensorNombre, refetch, isFetching, user }) {

    // Agregar estado a la lectura del sensor asignado
    const getEstadoLectura = (rowData) => {
        if (rowData.lectura < sensorMin) return "Baja"
        if (rowData.lectura > sensorMax) return "Alta"
        return "Normal"
    }

    // Agregar unidad de medida a lecturas dependiendo del tipo de sensor
    const unidadMedida = (rowData) => {
        if (sensorTipo === 1) return `${rowData.lectura} °C`
        if (sensorTipo === 2) return `${rowData.lectura} %`
    }

    // Unir rango en la fila del sensor
    const unirRango = (rowData) => {
        if (sensorTipo === 1) return `${sensorMin} C° a ${sensorMax} C°`
        if (sensorTipo === 2) return `${sensorMin} H° a ${sensorMax} H°`
    }

    // exportar pdf
    const exportarPDF = async () => {
        const doc = new jsPDF()

        /* const logoData = await convertirImagen("img/logo.png")
        doc.addImage(logoData, 'PNG', 14, 8, 60, 10) */

        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        doc.setTextColor(50)
        doc.text(`Tecnometry monitor-app`, 14, 20)
        doc.text(`Señores`, 14, 29)

        doc.setFont("helvetica", "bold")
        doc.text(user.cliente_nombre, doc.getTextWidth("Señores ") + 14, 29)

        doc.setFont("helvetica", "normal")
        doc.text(`Este informe corresponde al registro de lecturas de acuerdo al rango de fecha seleccionado.`, 14, 35)

        doc.setFont("helvetica", "normal")
        doc.text("Nombre:", 14, 45)

        doc.setFont("helvetica", "bold")
        doc.text(sensorNombre, 14 + doc.getTextWidth("Nombre: "), 45)

        doc.setFont("helvetica", "normal")
        doc.text(`Serial: ${sensorIdentificador}`, 14, 50)

        doc.text(`Rango: ${sensorMin} ${sensorTipo === 1 ? "°C" : "%"} a ${sensorMax} ${sensorTipo === 1 ? "°C" : "%"}`, 14, 55)

        doc.text(`Fecha: ${dayjs(lecturasFechaInicio).format("DD/MM/YYYY")} hasta ${dayjs(lecturasFechaFin).format("DD/MM/YYYY")}`, 14, 60)

        const datos = consulta.map(row => [
            row.sensor_nombre,
            dayjs(row.fecha).format("DD/MM/YYYY HH:mm:ss"),
            unidadMedida(row),
            getEstadoLectura(row),
            unirRango(row),
        ])

        const columnas = ["Nombre", "Lectura", "Fecha", "Estado", "Rango"]

        autoTable(doc, {
            margin: { top: 30, bottom: 35 },
            startY: 70,
            head: [columnas],
            body: datos,
            styles: { fontSize: 8 },
            didDrawPage: function (data) {
                const pageHeight = doc.internal.pageSize.height
                const pageWidth = doc.internal.pageSize.width
                const pageNumber = doc.internal.getNumberOfPages()

                doc.setFontSize(10);
                doc.setTextColor(120);

                const footerLines = [
                    "Elaborado por: Tecnometry",
                    "Teléfono: 3028699819",
                    "Correo: admin@tecnometry.com",
                    "https://monitor-app.cloud"
                ]

                let y = pageHeight - 25
                footerLines.forEach((line) => {
                    doc.text(line, 14, y)
                    y += 5
                })

                doc.text(`Página ${pageNumber}`, pageWidth - 40, pageHeight - 10)
                doc.setFont("helvetica", "bold")
                doc.setFontSize(14)
                doc.setTextColor(41, 128, 185)
                doc.text("Reporte de Lecturas", 14, 15)
            }
        })
        doc.save("Reporte_lecturas.pdf")
    }

    // convertir logo a formato requerido para pdf
    async function convertirImagen(url) {
        const res = await fetch(url)
        const blob = await res.blob()
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.readAsDataURL(blob)
        })
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <div style={{ display: "flex", justifyContent: "space-between" }} >

                <div >
                    <label style={{ color: "#4b4a4a", fontWeight: 500, paddingRight: "1rem" }}>Fecha inicio</label>

                    <Calendar
                        value={lecturasFechaInicio ? dayjs(lecturasFechaInicio).toDate() : null}
                        onChange={(e) => setLecturasFechaInicio(dayjs(e.value).startOf("day").format("YYYY-MM-DD HH:mm:ss"))}
                        showIcon
                        placeholder="Seleccione fecha"
                        dateFormat="dd/mm/yy"
                        style={{ height: '2.5rem', width: '15rem' }}
                    />

                    <label style={{ color: "#4b4a4a", fontWeight: 500, paddingLeft: "1rem", paddingRight: "1rem" }}>Fecha Fin</label>

                    <Calendar
                        value={lecturasFechaFin ? dayjs(lecturasFechaFin).toDate() : null}
                        onChange={(e) => setLecturasFechaFin(dayjs(e.value).endOf("day").format("YYYY-MM-DD HH:mm:ss"))}
                        showIcon
                        placeholder="seleccione fecha"
                        dateFormat="dd/mm/yy"
                        style={{ height: '2.5rem', width: '15rem' }}
                    />

                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <Button
                        label="PDF"
                        icon="pi pi-download"
                        onClick={exportarPDF}
                        style={{ height: '2.5rem' }}
                    />
                    <Button
                        label="Actualizar"
                        icon="pi pi-refresh"
                        loading={isFetching}
                        onClick={() => refetch()}
                        style={{ height: '2.5rem' }}
                    />
                </div>
            </div>

            <div>
                <Card title="Lecturas" subTitle={sensorNombre}>
                    <DataTable
                        className="tabla-lecturas"
                        value={consulta}
                        size="small"
                        emptyMessage="No hay datos para mostrar..."
                        paginator rows={30}
                        stripedRows
                        scrollable
                        scrollHeight="25rem"
                    >
                        <Column field="id" header="id" sortable />
                        <Column field="sensor_nombre" header="NOMBRE" sortable />
                        <Column
                            field="fecha"
                            header="FECHA"
                            sortable
                            body={(rowData) => dayjs(rowData.fecha).format("DD/MM/YYYY HH:mm:ss")
                            }
                        />
                        <Column field="lectura" header="LECTURA" sortable body={unidadMedida} />
                        <Column field="estado_lectura" header="ESTADO" sortable body={getEstadoLectura} />
                        <Column field="min" header="RANGO" sortable body={unirRango} />
                    </DataTable>
                </Card>

            </div>
        </div>
    )
}

export default TablaLecturas