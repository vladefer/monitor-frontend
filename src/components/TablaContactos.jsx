import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';

function TablaContactos({ consulta, sensorNombre }) {
    return (
        <div>
            <Card title="Contactos">
                
                    <DataTable
                        value={consulta}
                        paginator
                        rows={10}
                        scrollable
                        emptyMessage="No se encontraron contactos"
                    >
                        <Column field="nombre" header="NOMBRE" sortable />
                        <Column field="telefono" header="TELEFONO" />
                        <Column field="correo" header="CORREO" />
                        <Column field="orden" header="ORDEN DE LLAMADA" />
                        <Column field="nombre_cliente" header="Cliente" />
                    </DataTable>
                
            </Card>
        </div>
    )
}

export default TablaContactos