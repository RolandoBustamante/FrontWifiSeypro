import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Stack, CircularProgress, Tooltip, Typography, Select, MenuItem, Collapse
} from '@mui/material';
import {Icon} from '@iconify/react';
import {NavigateBeforeRounded, NavigateNextRounded} from "@mui/icons-material";
import {useTheme} from '@mui/system';
import TableNoData from "./TableNoData";


// eslint-disable-next-line react/prop-types
const CustomTable = ({columns, data, getRowProps, loading = false, info, pagination = false, setPage, setLimit}) => {
    CustomTable.propTypes = {
        columns: PropTypes.arrayOf(
            PropTypes.shape({
                header: PropTypes.string.isRequired,
                accessor: PropTypes.string,
                buttons: PropTypes.arrayOf(
                    PropTypes.shape({
                        icon: PropTypes.object.isRequired,
                        onClick: PropTypes.func.isRequired,
                    })
                ),
            })
        ).isRequired,
        data: PropTypes.arrayOf(PropTypes.object).isRequired,
        loading: PropTypes.bool,
        pagination: PropTypes.bool,
        getRowProps: PropTypes.func,
        setPAge: PropTypes.func,
        info: PropTypes.object,
        setLimit: PropTypes.func
    }
    const [limite, setLimite] = useState(10)

    const {prev, next, pages} = info ?? {};
    const handlePagination = (p) => {
        setPage(p)
    }

    const getCellProps = (row, column) => getRowProps ? getRowProps(row, column) : {}
    const renderCellContent = (row, column) => {
        if (column.Cell) {
            return column.Cell(row)
        }
        return row[column.accessor]
    }

    const theme = useTheme();
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead style={{backgroundColor: theme.palette.secondary.main, padding: 0, margin: 0}}>
                    <TableRow style={{padding: 0, margin: 0}}>
                        {columns.map((column, index) => (
                            <TableCell
                                style={{
                                    textAlign: column.align ?? "start",
                                    ...(column.headerStyle || {}),
                                    border: `1px solid white`,
                                    color: 'white',
                                    padding: 0, margin: 0
                                }}
                                key={index}
                            >
                                {column.header ? column.header : ""}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading && (
                        <TableRow>
                            <TableCell colSpan={columns.length}>
                                <Stack
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    style={{height: '200px'}}
                                >
                                    <CircularProgress/>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    )}
                    {!loading &&data&& data.map((row, rowIndex) => (
                        <>
                            <TableRow key={rowIndex} style={{
                                padding: 0,
                                margin: 0,
                                backgroundColor: rowIndex % 2 === 0 ? '#f2f2f2' : 'white'
                            }}>
                                {columns.map((column, colIndex) => {
                                    if (column.buttons) {
                                        return (
                                            <TableCell key={colIndex}
                                                       style={{
                                                           border: `1px solid black`,
                                                           padding: 0, margin: 0, textAlign: column.align || 'start',
                                                           ...(column.cellStyle || {})
                                                       }}>
                                                {column.buttons.map((button, buttonIndex) => (
                                                    <IconButton title={button.tooltip ? button.tooltip : ""}
                                                                style={{margin: 0, padding: 0}}
                                                                key={buttonIndex} color={button.color ? button.color : ""}
                                                                onClick={() => button.onClick(row)}>
                                                        <Icon icon={button.icon}/>
                                                    </IconButton>
                                                ))}
                                            </TableCell>
                                        )
                                    }
                                    return <TableCell
                                        key={colIndex}
                                        style={{
                                            textAlign: column.align || 'start',
                                            border: `1px solid black`,
                                            padding: 0,
                                            margin: 0,
                                            ...(column.cellStyle || {})
                                        }} {...getCellProps(row, column)}>{renderCellContent(row, column)}</TableCell>;
                                })}
                            </TableRow>
                            {
                                row.open && <TableRow>
                                    <TableCell colSpan={columns.length} style={{border: `1px solid black`}} >
                                        <Collapse in={row.open}  sx={{ bgcolor: 'background.neutral' }}>
                                            {row.collapseElement??<></>}
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            }
                        </>

                    ))}
                </TableBody>
                <TableNoData
                    isNotFound={!data.length && !loading}
                />
            </Table>
            {
                pagination && (
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" p={2} spacing={1}>
                        <div style={{display: 'inline-block'}}>
                            <Select
                                value={limite}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setLimite(Number(e.target.value));
                                }}
                                style={{padding: 0, margin: 0}}
                            >
                                <MenuItem style={{padding: 0, margin: 0}} value={5}>
                                    5
                                </MenuItem>
                                <MenuItem style={{padding: 0, margin: 0}} value={10}>
                                    10
                                </MenuItem>
                                <MenuItem style={{padding: 0, margin: 0}} value={20}>
                                    20
                                </MenuItem>
                                <MenuItem style={{padding: 0, margin: 0}} value={50}>
                                    50
                                </MenuItem>
                                <MenuItem style={{padding: 0, margin: 0}} value={100}>
                                    100
                                </MenuItem>
                            </Select>
                        </div>

                        <Tooltip title="ANTERIOR" placement="left">
                        <span>
                          <IconButton color="secondary" disabled={!prev} onClick={() => handlePagination(prev)}>
                            <NavigateBeforeRounded/>
                          </IconButton>
                        </span>
                        </Tooltip>
                        <Typography variant="overline" color="secondary">
                            Página {(pages && prev + 1) || 0} de {pages || 0}
                        </Typography>
                        <Tooltip title="SIGUIENTE" placement="right">
                        <span>
                          <IconButton color="secondary" disabled={!next} onClick={() => handlePagination(next)}>
                            <NavigateNextRounded/>
                          </IconButton>
                        </span>
                        </Tooltip>
                    </Stack>
                )
            }
        </TableContainer>
    )
}


export default CustomTable