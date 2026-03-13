import React, {useEffect, useState} from "react";
import Rol from "../../Models/Rol";
import {Box, Button, Card, CardContent, Container} from "@mui/material";
import {Icon} from "@iconify/react";
import ReactTablePagination from "../../utilsComponents/CustomTable";
import ModalRoles from "./ModalRoles";


const RolesPermisos = () => {
    const [roles,setRoles]= useState([])
    const [rol, setRol]= useState({})
    const [loading, setLoading] = useState(false)
    const [config, setConfig]= useState({isOpen: false})

    useEffect(() => {
        setLoading(true)
        Rol.getRoles('id, nombre, descripcion, accesos, es_repartidor')
            .then(response => {
                const {listRol} = response.data
                setRoles(listRol)
                setLoading(false)
            })
    }, [])

    const edirRol= (row)=>{
        setRol(row)
        setConfig({...config, isOpen: true})
    }



    return (
        <Container>

            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="center" marginTop={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                            style={{margin: 3}}
                            onClick={() => {
                                setRol({})
                                setConfig({...config, isOpen: true})
                            }}>
                            <Icon icon="mdi:plus-circle"/> Nuevo Rol
                        </Button>
                    </Box>
                    <ReactTablePagination data={roles} loading={loading}
                                           columns={[
                        {
                            header: '#',
                            accessor: 'nroComprobante',
                            Cell: (row) =>( Number(roles.indexOf(row)) + 1),
                            align: "center",
                        },
                        {
                            header: 'Acciones',
                            buttons: [
                                {
                                    icon: 'mdi:account-edit',
                                    onClick: (div) => edirRol(div), color: "warning"
                                },
                            ],
                            align: "center",

                        },
                        {
                            header: 'Nombre',
                            accessor:'nombre',
                            align: "center",
                        }, {
                            header: 'Descripción',
                            accessor: 'descripcion',
                            align: "center",
                        }]}/>

                </CardContent>
            </Card>
            <ModalRoles setConfig={setConfig} setRoles={setRoles} config={config} rol={rol}/>
        </Container>

    )
}
export default RolesPermisos
