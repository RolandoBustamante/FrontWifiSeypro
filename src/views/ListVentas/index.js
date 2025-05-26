import Ventas from "../../Models/Ventas";
import React, {useEffect, useState} from "react";
import {Card, CardContent, Container, IconButton, Tooltip} from "@mui/material";
import moment from "moment";
import {Icon} from "@iconify/react";

import CustomTable from "../../utilsComponents/CustomTable";
import DialogPdfViewer from "../../components/DialogPdfViewer";
import Toast from "../../utils/toastUtil";
import Swal from "sweetalert2";


const ListVentas = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [data, setData] = useState([])
    useEffect(() => {
        Ventas.operacionesSimplificadas().then(res => {
            setData(res.data.listOperaciones.data.operaciones);
        });
    }, []);
    const rowCollapse = (row) => (
        <div style={{padding: 10}}>
            <ul style={{padding: 0, margin: 0}}>
                {row.detallesJson.map((item, idx) => (
                    <li key={idx}>
                        {item.descripcion} - {item.cantidad} x S/ {item.mtoPrecioUnitario.toFixed(2)} =
                        S/ {item.mtoValorVenta.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
    return (
        <Container>
            <Card>
                <CardContent>
                    <CustomTable
                        data={data}
                        columns={[
                            {
                                header: '',
                                Cell: (row) => (
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setData((prevState) =>
                                                prevState.map((element) =>
                                                    element.id === row.id ? {
                                                        ...element, open: !row.open, collapseElement: rowCollapse(row)
                                                    } : {...element}
                                                )
                                            );
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.stopPropagation();
                                                setData((prevState) =>
                                                    prevState.map((element) =>
                                                        element.id === row.id ? {
                                                            ...element,
                                                            open: !row.open
                                                        } : {...element}
                                                    )
                                                );
                                            }
                                        }}
                                        style={{cursor: 'pointer'}}
                                    >
                                     {row.open ? '👇' : '👉'}
                                 </span>
                                ),
                                align: 'center'
                            },
                            {
                                header: 'Acción', align: 'center', Cell: (row) => (

                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                        <Tooltip title="Ver PDF">
                                            <IconButton onClick={() => {
                                                Toast.Waiting('Cargando...')
                                                Ventas.obtenerRuta(row.id).then(response => {
                                                    const {label}= response.data.obtenerRuta
                                                    setPdfUrl(label);
                                                    setDialogOpen(true);
                                                    Toast.Remove()
                                                })
                                            }}>
                                                <Icon icon="mdi:file-pdf-box" color="red" width={24} height={24}/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Dar de baja">
                                            <IconButton onClick={async () => {
                                                const { value: motivo } = await Swal.fire({
                                                    title: 'Motivo de la baja',
                                                    input: 'text',
                                                    inputPlaceholder: 'Ingrese el motivo',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Confirmar',
                                                    cancelButtonText: 'Cancelar',
                                                    inputValidator: (value) => {
                                                        if (!value) return 'Debe ingresar un motivo';
                                                    }
                                                });

                                                if (motivo) {
                                                    Toast.Waiting('Enviando a SUNAT...');
                                                    try {
                                                        const res = await Ventas.anularComprobante( row.id, motivo );
                                                        const { anularOperacion } = res.data;
                                                        Toast.Remove();
                                                        if (anularOperacion.success) {
                                                            Toast.Success('Nota de crédito emitida correctamente');
                                                        } else {
                                                            Toast.Error('Error al emitir la nota');
                                                        }
                                                    } catch (e) {
                                                        Toast.Remove();
                                                        Toast.Error(e.message);
                                                    }
                                                }
                                            }}>
                                                <Icon icon="mdi:file-cancel-outline" color="orange" width={24} height={24} />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                   )
                            },
                            {header: 'Cliente', accessor: 'clienteNombre'},
                            {header: 'Serie', accessor: 'serie'},
                            {header: 'Correlativo', accessor: 'correlativo'},
                            {
                                header: 'Fecha Emisión',
                                accessor: 'fechaEmision',
                                Cell: row => moment(row.fechaEmision).format('YYYY-MM-DD')
                            },
                            {header: 'Subtotal', accessor: 'subtotal', Cell: row => `S/ ${row.subtotal.toFixed(2)}`},
                            {header: 'IGV', accessor: 'igv', Cell: row => `S/ ${row.igv.toFixed(2)}`},
                            {header: 'Total', accessor: 'total', Cell: row => `S/ ${row.total.toFixed(2)}`},
                        ]}
                    />
                </CardContent>
            </Card>
            <DialogPdfViewer
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false)
                }}
                url={pdfUrl}
            />
        </Container>
    )
}
export default ListVentas