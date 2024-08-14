import React, {useEffect, useState} from "react"
import ReactTablePagination from "../../utilsComponents/CustomTable";
import {Box, Button, Card, CardContent, Container} from "@mui/material";
import {Icon} from "@iconify/react";
import ModalUser from "./components/ModalUser";
import Usuario from "../../Models/Usuario";

const Admin = () => {
    const [data, setData] = useState([])
    const [config, setConfig] = useState({isOpen: false})
    const [user, setUser] = useState({})
    const [infoData, setInfoData] = useState({})
    const [page, setPage] = useState(null)
    const [limit, setLimit] = useState(10)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        Usuario.usuarios(page, limit)
            .then(response => {
                const {usuarios, info} = response.data.listaUsuarios.data
                setData(usuarios)
                setInfoData(info)
                setLoading(false)
            })
    }, [limit, page])
    const editUsuarios= (row)=>{
        setUser(row)
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
                                setUser({})
                                setConfig({...config, isOpen: true})
                            }}>
                            <Icon icon="mdi:plus-circle"/> Nuevo usuario
                        </Button>
                    </Box>
                    <ReactTablePagination data={data} setLimit={setLimit} loading={loading} info={infoData}
                                          setPage={setPage} pagination columns={[
                        {
                            header: '#',
                            accessor: 'nroComprobante',
                            Cell: (row) => data.indexOf(row) + 1 +(page? (page-1)*limit: 0),
                            align: "center",
                        },

                        {
                            header: 'Acciones',
                            buttons: [
                                {
                                    icon: 'mdi:account-edit',
                                    onClick: (div) => editUsuarios(div), color: "warning"
                                },
                            ],
                            align: "center",

                        },
                        {
                            header: 'Nombre',
                            Cell: (row) => {
                                const {nombres, apellidos} = row
                                return (<div>{nombres + ' ' + apellidos}</div>)
                            },
                            align: "center",
                        }, {
                            header: 'Correo',
                            accessor: 'correo',
                            align: "center",
                        }, {
                            header: 'Cuenta',
                            accessor: 'cuenta',
                            align: "center",
                        }]}/>
                </CardContent>
            </Card>
            <ModalUser config={config} user={user} setConfig={setConfig} setData={setData}/>
        </Container>
    )

}
export default Admin