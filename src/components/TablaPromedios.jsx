import { DataTable } from "primereact/datatable"
import { Calendar } from "primereact/calendar"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Card } from "primereact/card"

import dayjs from "dayjs"

// Exportar pdf
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'

function TablaPromedios({ consulta, promediosFechaInicio, setPromediosFechaInicio, promediosFechaFin, setPromediosFechaFin, sensorIdentificador, sensorTipo, sensorNombre, sensorMin, sensorMax, refetch, isFetching, user }) {

    // Agregar unidad de medida a lecturas dependiendo del tipo de sensor
    const unidadMedida = (rowData, field) => {
        if (sensorTipo === 1) return `${rowData[field]} °C`
        if (sensorTipo === 2) return `${rowData[field]} %`
        return rowData[field];
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
        doc.text(`Este informe corresponde al promedio de 12 horas de acuerdo al rango de fecha seleccionado.`, 14, 35)

        doc.setFont("helvetica", "normal")
        doc.text("Nombre:", 14, 45)

        doc.setFont("helvetica", "bold")
        doc.text(sensorNombre, 14 + doc.getTextWidth("Nombre: "), 45)

        doc.setFont("helvetica", "normal")
        doc.text(`Serial: ${sensorIdentificador}`, 14, 50)

        doc.text(`Rango: ${sensorMin} ${sensorTipo === 1 ? "°C" : "%"} a ${sensorMax} ${sensorTipo === 1 ? "°C" : "%"}`, 14, 55)

        doc.text(`Fecha inicio: ${dayjs(promediosFechaInicio).format("DD/MM/YYYY")} hasta ${dayjs(promediosFechaFin).format("DD/MM/YYYY")}`, 14, 60)

        const datos = consulta.map(row => [
            row.sensor_nombre,
            dayjs(row.fecha).format("DD/MM/YYYY"),
            unidadMedida(row, "min_am"),
            unidadMedida(row, "promedio_am"),
            unidadMedida(row, "max_am"),
            unidadMedida(row, "min_pm"),
            unidadMedida(row, "promedio_pm"),
            unidadMedida(row, "max_pm"),
        ]);

        const columnas = ["Nombre", "Fecha", "Minima AM", "Promedia AM", "Maxima AM", "Minima PM", "Promedio PM", "Maxima PM"]

        autoTable(doc, {
            margin: { top: 30, bottom: 35 },
            startY: 70,
            head: [columnas],
            body: datos,
            styles: { fontSize: 8 },
            didDrawPage: function (data) {
                const pageHeight = doc.internal.pageSize.height;
                const pageWidth = doc.internal.pageSize.width;
                const pageNumber = doc.internal.getNumberOfPages();

                doc.setFontSize(10);
                doc.setTextColor(120);

                const footerLines = [
                    "Elaborado por: Tecnometry",
                    "Teléfono: 3028699819",
                    "Correo: admin@tecnometry.com",
                    "https://monitor-app.cloud"
                ];

                let y = pageHeight - 25
                footerLines.forEach((line) => {
                    doc.text(line, 14, y)
                    y += 5
                })

                doc.text(`Página ${pageNumber}`, pageWidth - 40, pageHeight - 10);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(14);
                doc.setTextColor(41, 128, 185);
                doc.text("Reporte de Promedios", 14, 15)
            }
        })
        doc.save("Reporte_Promedios.pdf")
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

                <div>
                    <label style={{ color: "#4b4a4a", fontWeight: 500, paddingRight: "1rem" }}>Fecha inicio</label>

                    <Calendar
                        value={promediosFechaInicio ? dayjs(promediosFechaInicio).toDate() : null}
                        showIcon
                        onChange={(newValue) => setPromediosFechaInicio(dayjs(newValue.value).startOf("day").format("YYYY-MM-DD HH:mm:ss"))}
                        placeholder="Seleccione Fecha"
                        dateFormat="yy/mm/dd "
                        style={{ height: '2.5rem', width: '15rem' }}
                    />

                    <label style={{ color: "#4b4a4a", fontWeight: 500, paddingLeft: "1rem", paddingRight: "1rem" }}>Fecha Fin</label>

                    <Calendar
                        value={promediosFechaFin ? dayjs(promediosFechaFin).toDate() : null}
                        showIcon
                        onChange={(newValue) => setPromediosFechaFin(dayjs(newValue.value).endOf("day").format("YYYY-MM-DD HH:mm:ss"))}
                        placeholder="Seleccione Fecha"
                        dateFormat="yy/mm/dd"
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


            <Card title="Promedio" subTitle={sensorNombre}>
                <DataTable
                    className="tabla-promedios"
                    value={consulta}
                    emptyMessage="No hay datos para mostrar..."
                    paginator rows={30}
                    size="small"
                    stripedRows
                    scrollable
                    scrollHeight="25rem"
                >
                    <Column field="sensor_nombre" header="NOMBRE" sortable />

                    <Column
                        field="fecha"
                        header="FECHA"
                        sortable
                        body={(rowData) => dayjs(rowData.fecha).format('DD/MM/YYYY')}
                    />
                    <Column field="min_am" header="MINIMA AM" sortable body={(rowData) => unidadMedida(rowData, "min_am")} />
                    <Column field="promedio_am" header="PROMEDIO AM" sortable body={(rowData) => unidadMedida(rowData, "promedio_am")} />
                    <Column field="max_am" header="MAXIMA AM" sortable body={(rowData) => unidadMedida(rowData, "max_am")} />
                    <Column field="min_pm" header="MINIMA PM" sortable body={(rowData) => unidadMedida(rowData, "min_pm")} />
                    <Column field="promedio_pm" header="PROMEDIO PM" sortable body={(rowData) => unidadMedida(rowData, "promedio_pm")} />
                    <Column field="max_pm" header="MAXIMA PM" sortable body={(rowData) => unidadMedida(rowData, "max_pm")} />
                </DataTable>
            </Card>
        </div>

    )
}

export default TablaPromedios