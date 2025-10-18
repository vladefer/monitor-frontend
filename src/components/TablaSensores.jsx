import { DataTable } from "primereact/datatable"
import { Card } from "primereact/card"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { useState } from "react"
import { TbTemperatureSun } from "react-icons/tb"
import { HiOutlineBellAlert, HiOutlineBellSlash } from "react-icons/hi2"
import { SiRainmeter } from "react-icons/si"

import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

import { useQueryClient } from "@tanstack/react-query";

import dayjs from "dayjs"

function TablaSensores({ consulta, setSensorId, setSensorNombre, setSensorIdentificador, setSensorMax, setSensorMin, setSensorTipo, refetch, isFetching, sensorNombre, setSensorEstado, setSensorUbicacion }) {

    const queryClient = useQueryClient();

    // Actualizar Sensores y Dashboard
    const handleActualizar = async () => {
        await refetch()
        queryClient.invalidateQueries({ queryKey: ["dashboard/lecturas"] })
    }

    // Fila Seleccionada
    const [filaSeleccionada, setFilaSeleccionada] = useState(null)

    // Agregar estado a la lectura del sensor asignado
    const getEstadoLectura = (rowData) => {
        if (rowData.ultima_lectura < rowData.min) {
            return (
                <div style={{ background: 'var(--indigo-600)', color: "white", borderRadius: "6px", paddingLeft: "0.8rem", paddingRight: "0.5rem", textAlign: "center" }}>
                    <span>Baja</span>
                </div>
            )
        }
        else if (rowData.ultima_lectura > rowData.max) {
            return (
                <div style={{ background: 'var(--pink-700)', color: "white", borderRadius: "6px", paddingLeft: "0.8rem", paddingRight: "0.5rem", textAlign: "center" }}>
                    <span>Alta</span>
                </div>
            )
        }
        else {
            return (

                <div style={{ background: 'var(--cyan-700)', color: "white", borderRadius: "6px", paddingLeft: "0.8rem", paddingRight: "0.5rem", textAlign: "center" }}>
                    <span>Normal</span>
                </div>
            )
        }
    }

    // Agregar unidad de medida a lecturas dependiendo del tipo de sensor
    const unidadMedida = (rowData) => {
        if (rowData.variable_id === 1) return <span>{rowData.ultima_lectura}   °C</span>
        if (rowData.variable_id === 2) return <span>{rowData.ultima_lectura}   %</span>
    }

    // Unir rango en la fila del sensor
    const unirRango = (rowData) => {
        if (rowData.variable_id === 1) return `${rowData.min} C° a ${rowData.max} C°`
        if (rowData.variable_id === 2) return `${rowData.min} % a ${rowData.max} %`
    }

    // Cambiar a tipo de sensor
    const tipoSensor = (rowData) => {
        if (rowData.variable_id === 1) {
            return (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TbTemperatureSun style={{ color: 'var(--teal-600)', fontSize: "1.5rem" }} />
                    Temperatura
                </span>
            )
        }
        if (rowData.variable_id === 2) {
            return (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <SiRainmeter style={{ color: 'var(--indigo-700)', fontSize: "1.5rem" }}
                    />
                    Humedad
                </span>
            )
        }
    }

    // Cambiar el estado de alarma de INT a String
    const estadoString = (rowData) => {
        if (rowData.estado_notificacion === 1) {
            return (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HiOutlineBellAlert style={{ color: 'var(--indigo-700)', fontSize: "1.5rem" }}
                    />
                    ON
                </span>
            )
        }
        else {
            return (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HiOutlineBellSlash style={{ color: 'var(--indigo-600)', fontSize: "1.5rem" }} />
                    OFF
                </span>
            )
        }
    }

    // Buscar en tabla
    const [value, setValue] = useState('')

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <div style={{ display: "flex", justifyContent: "space-between" }} >

                {/* Buscador */}
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"> </InputIcon>
                    <InputText
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        style={{ height: '2.5rem', width: '20rem' }}
                    />
                </IconField>

                {/* Boton de Actualizar */}
                <Button
                    label="Actualizar"
                    icon="pi pi-refresh"
                    severity="primary"
                    loading={isFetching}
                    onClick={handleActualizar}
                    style={{ height: '2.5rem'}}
                />

            </div>

            {/* inferior */}
            <div>
                <Card
                    title={<div >Sensores</div>}
                    subTitle={`${sensorNombre}`}
                >
                    <DataTable
                        className="tabla-sensores"
                        value={consulta}
                        size="normal"
                        selectionMode="single"
                        /* paginator rows={10} */
                        scrollable
                        scrollHeight="25rem"
                        selection={filaSeleccionada}
                        globalFilter={value}
                        onSelectionChange={(e) => setFilaSeleccionada(e.value)}
                        onRowSelect={(e) => {
                            setSensorId(e.data.id)
                            setSensorNombre(e.data.sensor_nombre)
                            setSensorIdentificador(e.data.sensor_id)
                            setSensorMin(e.data.min)
                            setSensorMax(e.data.max)
                            setSensorTipo(e.data.variable_id)
                            setSensorEstado(e.data.estado_notificacion)
                            setSensorUbicacion(e.data.ubicacion)
                        }}
                    >
                        <Column field="sensor_nombre" header="NOMBRE" sortable />
                        <Column field="sensor_id" header="IDENTIFICADOR" sortable />
                        <Column field="onac" header="ONAC" sortable />
                        <Column field="ubicacion" header="UBICACION" sortable />
                        <Column field="ultima_lectura" header="LECTURA" sortable body={unidadMedida} />
                        <Column field="fecha_ultima_lectura" header="FECHA" sortable body={(rowData) => dayjs(rowData.fecha_ultima_lectura).format("DD/MM/YYYY HH:mm:ss")}/>
                        <Column field="variable_id" header="TIPO" sortable body={tipoSensor} />
                        <Column field="estado_lectura" header="ESTADO" sortable body={getEstadoLectura} />
                        <Column field="estado_notificacion" header="NOTIFICACION" sortable body={estadoString} />
                        <Column field="min" header="RANGO" sortable body={unirRango} />
                    </DataTable>
                </Card>
            </div>
        </div>
    )
}

export default TablaSensores