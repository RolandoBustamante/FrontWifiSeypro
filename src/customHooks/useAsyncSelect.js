import React, {useEffect, useState} from 'react'
import {Autocomplete, FormControl, TextField, Typography} from '@mui/material'

export default function useAsyncSelect({
                                           initialState = "",
                                           optionsState = [],
                                           initialMessage = "",
                                           isClearable,
                                           noOptions = "Escriba para buscar",
                                           modelo = {}, labelPlace = "", disabled = false
                                       }) {
    const [values, setValue] = useState(initialState)
    const [options, setOptions] = useState(optionsState)
    const [invalid, setInvalid] = useState(false)
    const [message, setMessage] = useState(initialMessage)
    const [textValue, setTextValue] = useState('')
    const [dis, setDisabled] = useState(disabled)

    useEffect(() => {
        if (!textValue && textValue === '') return
        const {Model, respuesta, table, getByParam} = modelo
        const getByParamFunc = getByParam || 'getByParam'
        const query = table ? {table, param: textValue} : textValue
        setTimeout(() => {
                Model[getByParamFunc](query)
                    .then((response) => {
                        const data = response.data[respuesta]
                        setOptions(data)
                        setTextValue('')
                        return data
                    })
            },
            500)
    }, [textValue, modelo])
    const renderOption = (props, option) => (
        <li {...props}>
            <Typography variant="body2">{option.label}</Typography>
        </li>
    )
    const selectElement = (
        <FormControl error={invalid} style={{minWidth: "100%"}}>
            <Autocomplete
                options={options}
                disabled={dis}
                getOptionLabel={({label}) => label}
                getOptionSelected={({value}) => value === values}
                value={options.find((element) => element.value === values) || null}
                onChange={(e, newValue) => setValue(newValue ? newValue.value : '')}
                isOptionEqualToValue={(option, value) =>
                    option?.value === value?.value
                }
                filterOptions={(x) => x}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={labelPlace}
                        disabled={disabled}
                        onChange={({target}) => {
                            if (target.value && target.value.length > 1) setTextValue(target.value)
                        }}
                        error={invalid}
                        helperText={invalid ? message : null}
                    />
                )}
                noOptionsText={
                    <Typography variant="caption" color="textSecondary">
                        {noOptions}
                    </Typography>
                }
                renderOption={renderOption}
            />
        </FormControl>
    )

    return [values, selectElement, setValue, setInvalid, setOptions, setMessage, invalid, options, setDisabled]
}