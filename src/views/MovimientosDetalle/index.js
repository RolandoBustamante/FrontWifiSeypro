import React, {useEffect, useState} from 'react';
import {Box, Card, CardContent, Button, Container, Grid} from '@mui/material';
import Toast from '../../utils/toastUtil';
import useInput from '../../customHooks/useInput';
import CustomTable from '../../utilsComponents/CustomTable';
import moment from 'moment';
import Ventas from "../../Models/Ventas";
import useSelect from "../../customHooks/useSelect";
import Label from "../../components/label";
import useMountedRef from "../../customHooks/useMountedRef";

const estadoOpciones = [
    {value: '', label: 'Todos'},
    {value: 'PENDIENTE', label: 'Pendientes'},
    {value: 'PAGADO', label: 'Pagados'}
];

const ListMovimientos = () => {
    const mountedRef = useMountedRef();
    const [data, setData] = useState([]);
    const [infoData, setInfoData] = useState({});
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(null);
    const [limit, setLimit] = useState(10);

    const [estado, selectEstado] = useSelect({
        initialState: '', optionsState: estadoOpciones, placeholder: 'Estado'
    });
    const [buscar, inputBuscar] = useInput({
        typeState: 'text', initialState: '', placeholder: 'Buscar'
    });

    const [desde, inputDesde] = useInput({
        typeState: 'date',
        initialState: moment().subtract(30, 'days').format('YYYY-MM-DD'),
        placeholder: 'Desde'
    });

    const [hasta, inputHasta] = useInput({
        typeState: 'date',
        initialState: moment().add(1, 'days').format('YYYY-MM-DD'),
        placeholder: 'Hasta'
    });

    const fetchData = async () => {
        Toast.Remove();
        if (mountedRef.current) setLoading(true);
        try {
            const res = await Ventas.litarMovimientos(
                page,
                limit,
                buscar.trim(),
                estado || null,
                desde,
                hasta
            );
            if (!mountedRef.current) return;
            const {items, info} = res.data.listarMovimientosMes.data;
            setData(items);
            setInfoData(info);
        } catch (e) {
            console.log(e)
            if (mountedRef.current) Toast.Error('Error al obtener movimientos');
        }
        if (mountedRef.current) setLoading(false);
    };

    useEffect(() => {
        fetchData().then(r => r);
    }, [page, limit]);

    return (
        <Container maxWidth={false} disableGutters sx={{px: {xs: 2, sm: 3}, maxWidth: '100%'}}>
            <Card sx={{overflow: 'hidden'}}>
                <CardContent sx={{overflow: 'hidden'}}>
                    <Grid container spacing={2} alignItems="center" sx={{minWidth: 0}}>
                        <Grid item xs={12} sm={6} md={4}>
                            {inputBuscar}
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            {inputDesde}
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            {inputHasta}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {selectEstado}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box display="flex">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    onClick={() => { setPage(1); fetchData().then(r => r); }}>
                                    Filtrar
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <br/>
                    <div style={{width: '100%', height: '100%'}}>
                        <CustomTable
                            data={data}
                            loading={loading}
                            info={infoData}
                            pagination
                            setLimit={setLimit}
                            setPage={setPage}
                            columns={[
                                {
                                    header: 'Cliente',
                                    Cell: (row) => row.cliente?.nombres || '—',
                                    cellStyle: {minWidth:'325px'},
                                    align: 'left'
                                },
                                {
                                    header: 'DNI',
                                    Cell: (row) => row.cliente?.documento || '—',
                                    align: 'center'
                                },
                                {
                                    header: 'IMEI',
                                    Cell: (row) => row.router?.imei || '—',
                                    align: 'center'
                                },
                                {
                                    header: 'SIM',
                                    Cell: (row) => row.router?.sim || '—',
                                    align: 'center'
                                },
                                {
                                    header: 'Sede',
                                    Cell: (row) => row.sede || '—',
                                    align: 'left'
                                },
                                {
                                    header: 'Tipo',
                                    Cell: (row) => row.tipo || '—',
                                    align: 'center'
                                },
                                {
                                    header: 'Periodo',
                                    Cell: (row) => row.periodo || '—',
                                    cellStyle: {minWidth:'80px'},
                                    align: 'center'
                                },
                                {
                                    header: 'Monto',
                                    align: 'center',
                                    cellStyle: {minWidth:'60px'},
                                    accessor: 'monto',
                                    Cell: (row) => `S/ ${row.monto.toFixed(2)}`
                                },
                                {
                                    header: 'Estado',
                                    align: 'center',
                                    accessor: 'estado',
                                    Cell:(row)=>{
                                        const {estado}= row
                                        return (<Label variant="soft" color={row.estado === 'PAGADO' ? 'success' : 'warning'} sx={{textTransform: 'capitalize', margin: 1}}>
                                            {estado}
                                        </Label>)
                                    }
                                },
                                {
                                    header: 'F. Cobro',
                                    align: 'center',
                                    cellStyle: {minWidth:'80px'},
                                    accessor: 'fecha_cobro',
                                    Cell: (row) => moment(row.fecha_cobro).format('YYYY-MM-DD')
                                },
                                {
                                    header: 'F. Pago',
                                    align: 'center',
                                    cellStyle: {minWidth:'80px'},
                                    accessor: 'fecha_pago',
                                    Cell: (row) => row.estado === 'PAGADO'&&row.fecha_pago ? moment(row.fecha_pago).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')>moment(row.fecha_cobro).format('YYYY-MM-DD')?<Label variant="soft" color='error' sx={{textTransform: 'capitalize', margin: 1}}>
                                        {`Hay ${moment().diff(moment(row.fecha_cobro), 'days')} días de retraso` }
                                    </Label>:'-'
                                }
                            ]}
                        />
                    </div>

                </CardContent>
            </Card>
        </Container>

    );
};

export default ListMovimientos;
