import React, {useEffect, useState} from 'react';
import {
    Button,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import useInput from "../../customHooks/useInput";
import {cadenaAleatoria, numeroALetras, uploadImg, utilvalidarDni, utilvalidarRuc} from "../../utils/utils";
import ItemFacturas from "./ItemFacturas";
import useAsyncSelect from "../../customHooks/useAsyncSelect";
import Clientes from "../../Models/Clientes";
import moment from "moment";
import useSelect from "../../customHooks/useSelect";
import TipoVenta from "../../Models/TipoVenta";
import {departamentos, distritos, provincias} from "../../utils/constantes";
import Ventas from "../../Models/Ventas";
import Toast from "../../utils/toastUtil";
import {Icon} from "@iconify/react";
import MyDropzone from "../../components/MyDropzone";
import {LoadingButton} from "@mui/lab";
import DialogPdfViewer from "../../components/DialogPdfViewer";


const tiposComprobante = [
    {value: '01', label: 'Factura'},
    {value: '03', label: 'Boleta'},
    {value: '04', label: 'Nota de Venta'}
];


export default function Facturador() {
    const [serie, inputSerie, setSerie] = useInput({
        typeState: 'text',
        placeholder: 'Serie',
        disabled: true
    });
    const [correlativo, inputCorrelativo, setCorrelativo] = useInput({
        typeState: 'text',
        placeholder: 'Número',
        disabled: true
    });
    const [fecha, inputFecha] = useInput({
        typeState: 'date',
        placeholder: 'Fecha Emisión', initialState: moment().format('YYYY-MM-DD')
    });
    const [nroOperacion, inputNumeroOperacion] = useInput({
        typeState: 'text',
        placeholder: 'N° Operación'
    });
    const [moneda, inputMoneda] = useInput({typeState: 'select', initialState: 'PEN', placeholder: 'Moneda'});


    const [detalle, setDetalle] = useState([])
    const [views, setViews] = useState([])
    const [details, setDetails] = useState([])
    const [montos, setMontos] = useState({})
    const [clienteRouter, selectClienteRouter] = useAsyncSelect({
        placeholder: 'Seleccionar Cliente', modelo: {Model: Clientes, respuesta: 'listaClientesRouters'},
        labelPlace: 'Seleccionar Cliente'
    })
    const [loading, setLoading] = useState(false)
    const [ventasTipo, setTipoVentas] = useState([])
    const [infoCliente, setInfoCliente] = useState({})
    const [tipoPago, selectTipoPago, setTipoPago, , setOptionsTipo] = useSelect({
        placeholder: 'Metodo de pago'
    })
    const [comprobante, selectComprobante, setComprobante, , setOptionsComprobante] = useSelect({
        placeholder: 'Comprobante'
    })
    const [tipoDocumento, setTipoDocumento] = useState('')
    const [detallesDireccion, setDetalleDireccion] = useState({})
    const [doc, setDoc] = useState(null)
    const [size, setSize] = useState(4)
    const [bancarizado, setBancarizado] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        setComprobante('')
        setOptionsComprobante([])
        if (infoCliente && infoCliente.documento_identidad) {
            const validar = utilvalidarRuc(infoCliente.documento_identidad)
            if (validar.success) {
                setOptionsComprobante(tiposComprobante)
                setTipoDocumento('6')
                setComprobante('01')
            } else {
                setOptionsComprobante([{value: '03', label: 'Boleta'},{value: '04', label: 'Nota de Venta'}
                ])
                const validaDni = utilvalidarDni(infoCliente.documento_identidad)
                setComprobante('03')
                if (validaDni.success) setTipoDocumento('1')
                else setTipoDocumento('0')
            }
        }
        if (infoCliente.provincia && infoCliente.departamento && infoCliente.distrito) {
            const departamento = departamentos.find(element => element.id_ubigeo === infoCliente.departamento)
            const provincia = provincias[departamento.id_ubigeo].find(element => element.id_ubigeo === infoCliente.provincia)
            const distrito = distritos[provincia.id_ubigeo].find(element => element.id_ubigeo === infoCliente.distrito)
            setDetalleDireccion({
                ubigeo: `${departamento.codigo_ubigeo}${provincia.codigo_ubigeo}${distrito.codigo_ubigeo}`,
                departamento: departamento.nombre_ubigeo,
                provincia: provincia.nombre_ubigeo,
                distrito: distrito.nombre_ubigeo
            })
        }
    }, [infoCliente])
    useEffect(() => {
        TipoVenta.getListTipoBancos()
            .then(response => {
                const {listTipoPago} = response.data
                setTipoVentas(listTipoPago)
            })
    }, [])
    useEffect(() => {
        if (ventasTipo) {
            const elementos = []
            for (const element of ventasTipo) {
                elementos.push({label: element.nombre, value: element.id})
            }
            setOptionsTipo(elementos)
        }
    }, [ventasTipo])
    const onDrop = accepted => {
        uploadImg(accepted[0], 'multimedia', null)
            .then(response => response.json())
            .then(({data}) => {
                setDoc(data.name)
            })
            .catch(({message}) => {
                Toast.Error(message, {autoClose: 4000})
            })
    }


    const agregarItem = () => {
        const id = cadenaAleatoria(8);
        setViews((prevState) => [
            ...prevState,
            {
                id, invalid: true
            },
        ]);
        setDetalle((prevState) => [...prevState, id]);
    };
    const calcularTotales = (itemsConvertidos) => {
        let subtotal = 0;
        let igv = 0;
        let gratuito = 0;
        let total = 0;

        itemsConvertidos.forEach(item => {
            if (item.tipAfeIgv === 11) {
                gratuito += (item.mtoValorVenta || 0) + (item.igv || 0);
            } else {
                subtotal += item.mtoValorVenta || 0;
                igv += item.igv || 0;
                total += item.mtoPrecioUnitario || 0;
            }
        });

        setMontos({
            subtotal: parseFloat(subtotal.toFixed(2)),
            igv: parseFloat(igv.toFixed(2)),
            gratuito: parseFloat(gratuito.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        });
    };
    useEffect(() => {
        if (details) calcularTotales(details)
    }, [details])
    useEffect(() => {
        if (comprobante) Clientes.infoSerieNumero(comprobante).then(response => {
            const data = response.data.obtenerSerieNumero
            setCorrelativo(data.numero ?? '')
            setSerie(data.serie ?? '')
        })
    }, [comprobante])
    useEffect(() => {
        if (!clienteRouter || clienteRouter === '') return
        setLoading(true)
        setInfoCliente({})
        setViews([])
        setDetalle([])
        Clientes.infoFacturacion(clienteRouter).then(response => {
            const {obtenerInfo} = response.data
            if (obtenerInfo.data) {
                const {cliente, movimientos, direccion_servicio} = obtenerInfo.data
                setInfoCliente({...cliente, direccion_servicio})
                for (const mov of movimientos) {
                    setViews((prevState) => [
                        ...prevState,
                        {
                            id: mov.id,
                            monto: mov.monto,
                            servicio: mov.periodo,
                            tipo_movimiento: mov.tipo_movimiento
                        },
                    ]);
                    setDetalle((prevState) => [...prevState, mov.id]);
                }
                setLoading(false)
            }
        })
    }, [clienteRouter])
    const convertirItem = (item) => {
        const cantidad = 1;
        const descripcion = `${item.servicio}(${item.tipo_movimiento})`;
        const valorUnitario = parseFloat(item.subTotal);
        const igv = parseFloat(item.igv);
        const total = parseFloat(item.monto);

        if (item.gratis) {
            return {
                codProducto: 'S002',
                unidad: 'ZZ',
                cantidad,
                descripcion,
                mtoValorUnitario: 0,
                mtoValorGratuito: valorUnitario,
                mtoValorVenta: valorUnitario * cantidad,
                mtoBaseIgv: valorUnitario * cantidad,
                porcentajeIgv: 18,
                igv: igv * cantidad,
                tipAfeIgv: 11,
                totalImpuestos: igv * cantidad,
                mtoPrecioUnitario: 0
            };
        }

        return {
            codProducto: 'S001',
            unidad: 'ZZ',
            cantidad,
            descripcion,
            mtoValorUnitario: valorUnitario,
            mtoValorVenta: valorUnitario * cantidad,
            mtoBaseIgv: valorUnitario * cantidad,
            porcentajeIgv: 18,
            igv: igv * cantidad,
            tipAfeIgv: 10,
            totalImpuestos: igv * cantidad,
            mtoPrecioUnitario: total
        };
    };
    useEffect(() => {
        const array = []
        setDetails([])
        for (const view of views) {
            array.push(convertirItem(view))
        }
        setDetails(array)
    }, [views])
    const generarJsonComprobante = () => {
        const fechaEmision = moment(`${fecha} ${moment().format('HH:mm:ss')}`)
            .utcOffset(-5)
            .format("YYYY-MM-DDTHH:mm:ssZ");
        const tipoOperacion = "0101";
        const tipoDocCliente = tipoDocumento;
        const tipoDocComprobante = comprobante;
        const monedaTipo = moneda;


        return {
            ublVersion: "2.1",
            tipoOperacion,
            tipoDoc: tipoDocComprobante,
            serie: serie,
            correlativo: correlativo,
            fechaEmision,
            formaPago: {
                moneda: monedaTipo,
                tipo: "Contado"
            },
            tipoMoneda: monedaTipo,
            client: {
                tipoDoc: tipoDocCliente,
                numDoc: infoCliente.documento_identidad,
                rznSocial: infoCliente.nombres,
                address: {
                    direccion:infoCliente.direccion_servicio?? infoCliente.direccion ?? "-",
                    provincia: detallesDireccion.provincia ?? "-",
                    departamento: detallesDireccion.departamento ?? "-",
                    distrito: detallesDireccion.distrito ?? "-",
                    ubigueo: detallesDireccion.ubigeo ?? "150101"
                }
            },
            company: {
                ruc: "20613903268",
                razonSocial: "SEYPRO SISTEMA DE REDES INALAMBRICAS S.A.C.",
                nombreComercial: "SEYPRO",
                address: {
                    direccion: "CAL.GETIAS NRO. 190 URB. LAS FLORES",
                    provincia: "LIMA",
                    departamento: "LIMA",
                    distrito: "SAN JUAN DE LURIGANCHO",
                    ubigueo: "150101"
                }
            },
            mtoOperGravadas: montos.subtotal,
            ...(montos.gratuito > 0 && {mtoOperGratuitas: montos.gratuito}),
            mtoIGV: montos.igv,
            totalImpuestos: montos.igv,
            valorVenta: montos.subtotal,
            subTotal: montos.subtotal + montos.igv,
            mtoImpVenta: montos.total,
            details,
            legends: [
                {
                    code: "1000",
                    value: numeroALetras(montos.total)
                },
                ...(montos.gratuito > 0
                    ? [{
                        code: "1002",
                        value:
                            "TRANSFERENCIA GRATUITA DE UN BIEN Y/O SERVICIO PRESTADO GRATUITAMENTE"
                    }]
                    : [])
            ]
        };
    };

    useEffect(() => {
        if (tipoPago) setBancarizado((ventasTipo.find(element => element.id === tipoPago)).bancarizado)
    }, [tipoPago])
    useEffect(() => {
        setSize(bancarizado ? 2 : 4)
    }, [bancarizado])

    const enviar = async () => {
        Toast.Remove()
        if (!clienteRouter) {
            Toast.Error('Debes seleccionar un cliente.');
            return;
        }

        if (!fecha) {
            Toast.Error('Debes seleccionar una fecha.');
            return;
        }

        if (!comprobante) {
            Toast.Error('Debes seleccionar un tipo de comprobante.');
            return;
        }

        if (!serie || !correlativo) {
            Toast.Error('Serie o número no válidos.');
            return;
        }

        if (!tipoPago) {
            Toast.Error('Debes seleccionar un método de pago.');
            return;
        }

        if (!detalle.length) {
            Toast.Error('Debes agregar al menos un item.');
            return;
        }
        if (bancarizado && (doc === '' || !doc)) {
            Toast.Error('Debes cargar el comprobante de pago');
            return;
        }
        if (bancarizado && (nroOperacion === '' || !nroOperacion)) {
            Toast.Error('Debes ingresar el número de operación ');
            return;
        }
        if(views && views.length===0){
            Toast.Error('Debes ingresar al menos un mes de pago ');
            return;
        }
        if(views && views.length>0 && views.some(element=> element.invalid)){
            Toast.Error('Debes ingresar todos los datos del servicio ');
            return;
        }

        const jsonFinal = generarJsonComprobante();
        const descripciones = jsonFinal.details.map((d) => d.descripcion);
        const repetidas = descripciones.filter((desc, idx, arr) => arr.indexOf(desc) !== idx);
        if (repetidas.length) {
            Toast.Error(`Hay periodos repetidos`);
            return
        }
        Toast.Waiting('Emitiendo comprobante de pago')
        setIsLoading(true)
        try {
            const response =(await Ventas.emitirFactura({jsonFinal, doc, tipoPago, views, clienteRouter, nroOperacion}))
            const res= response?.data?.emitirFactura??{}
            if (res?.data?.success && res?.data?.pdfUrl) {
                setPdfUrl(res.data.pdfUrl);
                setDialogOpen(true);
                Toast.Remove()
                Toast.Success('Comprobante emitido correctamente');
                setIsLoading(false)
            } else {
                Toast.Remove()
                Toast.Error('Error al emitir comprobante');
                setIsLoading(false)
            }
        }catch (e) {
            Toast.Remove()
            const msg =
                e?.graphQLErrors?.[0]?.message ||
                e?.message ||
                "Ocurrió un error inesperado";
            Toast.Remove()
            Toast.Error(msg);
            setIsLoading(false)
        }

    };

    return (
        <Paper sx={{p: 3}}>
            <Grid container spacing={2} alignItems="center" mb={2}>
                <Grid item xs={8}>{selectClienteRouter}</Grid>
                <Grid item xs={2}>{inputFecha}</Grid>
                <Grid item xs={2}>{selectComprobante}</Grid>
                <Grid item xs={size}>{inputSerie}</Grid>
                <Grid item xs={size}>{inputCorrelativo}</Grid>
                <Grid item xs={size}>{selectTipoPago}</Grid>
                {bancarizado && <Grid item xs={6}>
                    <Grid container spacing={2} alignItems="center" mb={2}>
                        <Grid item xs={6}> <MyDropzone onDrop={onDrop} placeholder="Recibo"/></Grid>
                        <Grid item xs={6}> {inputNumeroOperacion}</Grid>
                    </Grid>
                </Grid>}
            </Grid>
            <Grid container justifyContent="center" mt={2} style={{paddingBottom: 5}}>
                <Grid item xs={3} sm={3} md={3}>
                    <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        onClick={agregarItem}
                    >
                        <Icon icon="mdi:plus-circle"/>Agregar Pagos
                    </Button>
                </Grid>
            </Grid>

            <Divider sx={{my: 2}} style={{margin: 0, padding: 0}}/>
            {loading && (
                <Grid container spacing={3}>
                    <Stack direction="row" justifyContent="center" m={10} width="100%">
                        <CircularProgress/>
                    </Stack>
                </Grid>
            )}
            {
                !loading && (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{textAlign: 'center', margin: 0, padding: 0}}>Detalle</TableCell>
                                <TableCell style={{textAlign: 'center', margin: 0, padding: 0}}>Servicio</TableCell>
                                <TableCell style={{textAlign: 'center', margin: 0, padding: 0}}>Gratis</TableCell>
                                <TableCell style={{textAlign: 'center', margin: 0, padding: 0}}>Sub Total</TableCell>
                                <TableCell style={{textAlign: 'center', margin: 0, padding: 0}}>IGV</TableCell>
                                <TableCell style={{textAlign: 'center', margin: 0, padding: 0}}>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {detalle.map((element) => {
                                const view = views.find(({id}) => id === element);
                                return (
                                    <ItemFacturas
                                        key={view.id}
                                        setDetalle={setDetalle}
                                        setViews={setViews}
                                        item={view}
                                        views={views}
                                        detalle={detalle}
                                    />
                                );
                            })}
                        </TableBody>
                    </Table>
                )
            }


            <Divider sx={{my: 2}} style={{margin: 0, padding: 0}}/>

            <Grid container direction="column" spacing={1} alignItems="flex-end" sx={{mt: 1}}>
                <Grid item>
                    <Typography variant="body2">
                        <strong>Subtotal:</strong> S/ {montos.subtotal?.toFixed(2) ?? ''}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2">
                        <strong>IGV:</strong> S/ {montos.igv?.toFixed(2) ?? ''}
                    </Typography>
                </Grid>

                {Number(montos.gratuito) > 0 && (
                    <Grid item>
                        <Typography variant="body2" color="text.secondary">
                            <strong>GRATUITO:</strong> S/ {montos.gratuito.toFixed(2)}
                        </Typography>
                    </Grid>
                )}

                <Grid item sx={{width: '100%'}}>
                    <Divider sx={{borderStyle: 'dashed', my: 1}}/>
                </Grid>

                <Grid item>
                    <Typography variant="h6" color="primary">
                        <strong>TOTAL:</strong> S/ {montos.total?.toFixed(2) ?? ''}
                    </Typography>
                </Grid>

                <Grid item>
                    <LoadingButton variant="contained" color="primary" onClick={enviar} loading={isLoading}>
                        Enviar Comprobante
                    </LoadingButton>
                </Grid>
            </Grid>
            <DialogPdfViewer
                open={dialogOpen}
                onClose={() => {
                    window.location.reload();
                }}
                url={pdfUrl}
            />
        </Paper>
    );
}
