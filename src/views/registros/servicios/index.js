import {Button, Card, CardContent, Container, FormControl, FormControlLabel, Stack} from "@mui/material";
import React, {useEffect} from "react";
import useAsyncSelect from "../../../customHooks/useAsyncSelect";
import Routers from "../../../Models/Routers";
import useInput from "../../../customHooks/useInput";
import moment from "moment/moment";
import Vendedores from "../../../Models/Vendedores";
import Clientes from "../../../Models/Clientes";
import {LoadingButton} from "@mui/lab";
import Toast from "../../../utils/toastUtil";
import Ventas from "../../../Models/Ventas";
import {esUUID} from "../../../utils/utils";
import useSwitch from "../../../customHooks/useSwitch";


const Servicios= ()=>{
    const [clienteSelect, selectCliente, setRouterCliente, ]= useAsyncSelect({
        labelPlace:'Cliente', modelo: {Model:Clientes, respuesta: 'clientesParam', getByParam: 'getByParamCliente'},
    })
    const [routerSelect, selectRouter, setRouterSelect]= useAsyncSelect({
        labelPlace:'Router', modelo: {Model:Routers, respuesta: 'routersParam', getByParam: 'getByParam'},
    })
    const [fechaInicio, inputFechaInicio, setFechaInicio]= useInput({
        typeState: 'date', placeholder: 'Fecha Contrato', initialState: moment().format('YYYY-MM-DD')
    })
    const [monto, inputMonto, setMonto]= useInput({
        placeholder: 'Monto', disabled: true
    })
    const [, inputCodigoPago, setCodigoPago]= useInput({
        placeholder: 'Código pago', disabled: true
    })
    const [usuario, selectUsuario, setUsuario, ]= useAsyncSelect({
        labelPlace:'Vendedor', modelo: {Model:Vendedores, respuesta: 'vendedoresParam'},
    })
    const [emitir, switchEmitir,setSwitch] = useSwitch({initialState: true})

    useEffect(()=>{
        if(routerSelect && esUUID(routerSelect)){
            Routers.getById(routerSelect, 'codigo, precio_servicio')
                .then(response=>{
                    const routerId= response.data.routerById
                    setCodigoPago(routerId.codigo??'')
                    setMonto(routerId.precio_servicio??'')
                })
        }
    },[routerSelect])
    const guardarRouterCliente= async ()=>{
        Toast.Waiting('Guardando...')
        let data={cliente_id: clienteSelect, router_id: routerSelect, fecha_inicio:fechaInicio , vendedor: usuario, emitir, monto}
        try {
            await Ventas.createOrUpdateRouters(data)
            Toast.Remove()
            Toast.Success('Guardado exitoso')
            window.location.reload()
        }catch (e) {
            Toast.Remove()
            Toast.Error(e.message)

        }
    }

    return(
        <Container>
            <Card>
                <CardContent>
                    <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                        <FormControl style={{flex: 2}}>
                            {selectCliente}
                        </FormControl>
                        <FormControl style={{flex: 2}}>
                            {selectRouter}
                        </FormControl>
                        <FormControl style={{flex: 1}}>
                            {inputMonto}
                        </FormControl>
                        <FormControl style={{flex: 1}}>
                            {inputCodigoPago}
                        </FormControl>
                    </Stack>
                    <Stack direction={{xs: 'column', sm: 'row'}} style={{paddingBottom: 10, paddingTop: 5}} spacing={2}>
                        <FormControl style={{flex: 2}}>
                            {selectUsuario}
                        </FormControl>
                        <FormControl style={{flex: 1}}>
                            {inputFechaInicio}
                        </FormControl>
                        <FormControl style={{flex: 1}}>
                            <FormControlLabel
                                control={switchEmitir}
                                label="Generar Recibo"
                                labelPlacement="start"
                            />
                        </FormControl>
                    </Stack>
                </CardContent>
                <CardContent>
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        sx={{ paddingTop: 2 }}
                    >
                        <LoadingButton
                            variant="contained"
                            color="success"
                            onClick={guardarRouterCliente}
                        >
                            Guardar
                        </LoadingButton>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                setUsuario('')
                                setCodigoPago('')
                                setMonto('')
                                setFechaInicio(moment().format('YYYY-MM-DD'))
                                setRouterSelect('')
                                setRouterCliente('')
                                setSwitch(true)
                            }}
                        >
                            Cancelar
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    )
}
export default Servicios