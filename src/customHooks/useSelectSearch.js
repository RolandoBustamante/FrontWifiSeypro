import React, {useEffect, useState} from 'react';
import {Autocomplete, TextField} from '@mui/material';

export default function useSelectSearch({
                                                 initialState = [],
                                                 optionsState = [],
                                                 initialMessage = '',
                                                 isDisabled = false,
                                                 placeholder = 'Buscar',
                                                 modelo = {}
                                             }) {
    const [values, setValue] = useState(initialState);
    const [options, setOptions] = useState(optionsState);
    const [message, setMessage] = useState(initialMessage);
    const [disabled, setDisabled] = useState(isDisabled);
    const [invalid, setInvalid] = useState(false)
    const [textValue, setTextValue] = useState('')


    const handleInputChange = (event, newValue) => {
        setValue(newValue)
    }
    useEffect(() => {
        if (textValue==='') return
        const {Model, respuesta, table, getByParam, moreParam} = modelo
        const getByParamFunc = getByParam || 'getByParam'
        const query = table ? {table, param: textValue} : {param: textValue, ...moreParam}
        setTimeout(() => {
                Model[getByParamFunc](query)
                    .then((response) => {
                        const data = response.data[respuesta]
                        setOptions(data)
                        setTextValue("")
                        return data
                    })
            },
            500)
    }, [textValue, modelo])

    const autocompleteValue = (
        <Autocomplete
            multiple
            id="tags-outlined"
            options={options}
            getOptionLabel={({label}) => label}
            getOptionSelected={({value}) => value === values}
            value={values}
            onChange={handleInputChange}
            disabled={disabled}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField {...params} label={placeholder} placeholder={placeholder}
                           disabled={disabled}
                           onChange={({target}) => {
                               if (target.value.length && target.value.length >= 2) setTextValue(target.value)
                           }}
                           error={invalid}
                           helperText={invalid ? message : null}
                />
            )}
            />
    );
    const selectedValues = values.map((selectedValue) => selectedValue.value);

    return [selectedValues, autocompleteValue, setValue, setInvalid, setOptions, setMessage, setDisabled];
}
