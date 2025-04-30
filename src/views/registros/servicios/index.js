import {Card, CardContent, Container, FormControl, Stack} from "@mui/material";
import React from "react";
import useAsyncSelect from "../../../customHooks/useAsyncSelect";
import Routers from "../../../Models/Routers";
import useInput from "../../../customHooks/useInput";
import moment from "moment/moment";
import Vendedores from "../../../Models/Vendedores";
import Clientes from "../../../Models/Clientes";


const Servicios= ()=>{
    const [clienteSelect, selectCliente, setRouterCliente, ]= useAsyncSelect({
        labelPlace:'Cliente', modelo: {Model:Clientes, respuesta: 'clientesParam', getByParam: 'getByParamCliente'},
    })
    const [routerSelect, selectRouter, setRouterSelect, ,setOptionsSelectRouter,,,,setDisabledRouter]= useAsyncSelect({
        labelPlace:'Router', modelo: {Model:Routers, respuesta: 'routersParam', getByParam: 'getByParam'},
    })
    const [fechaInicio, inputFechaInicio, setFechaInicio]= useInput({
        typeState: 'date', placeholder: 'Fecha Contrato', initialState: moment().format('YYYY-MM-DD')
    })
    const [, inputMonto, setMonto]= useInput({
        placeholder: 'Monto', disabled: true
    })
    const [, inputCodigoPago, setCodigoPago]= useInput({
        placeholder: 'Código pago', disabled: true
    })
    const [usuario, selectUsuario, setUsuario, , setOptionsUsuario,,,,setDisableUsuario]= useAsyncSelect({
        labelPlace:'Vendedor', modelo: {Model:Vendedores, respuesta: 'vendedoresParam'},
    })

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
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    )
}
export default Servicios