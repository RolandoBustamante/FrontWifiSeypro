import React, {useEffect, useState} from 'react';
import {TextField, Autocomplete, FormControl} from '@mui/material';

export default function useSelectMulti({
                                           initialState = [],
                                           optionsState = [],
                                           initialMessage = '',
                                           isDisabled = false,
                                           onBlur,
                                           backgroundColor = '',
                                           placeholder = 'Seleccionar...',
                                       }) {
    const [value, setValue] = useState(optionsState.filter(element=> initialState.includes(element.value)));
    const [options, setOptions] = useState(optionsState);
    const [invalid, setInvalid] = useState(false);
    const [message, setMessage] = useState(initialMessage);
    const [disabled, setDisabled] = useState(isDisabled);
    const [valuesFilter, setValuesFilter]= useState(null)

    useEffect(()=>{
        if(valuesFilter){
            setValue(options.filter(element=> valuesFilter.includes(element.value)))
        }
    },[options, valuesFilter])
    const selectElement = (
        <FormControl fullWidth>
            <Autocomplete
                multiple
                id="autocomplete"
                options={options}
                getOptionLabel={(option) => option.label}
                value={value}
                onChange={(_, newValue) => setValue(newValue)}
                onBlur={onBlur || (() => {})}
                disabled={disabled}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={placeholder}
                        placeholder={placeholder}
                        style={{
                            backgroundColor: invalid ? '#dc3545' : backgroundColor,
                            borderRadius: 5,
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props}>
                        {option.label}
                    </li>
                )}
            />
            {invalid ? <small className="text-danger">{message===''? `Debe seleccionar ${placeholder}`:message}</small> : null}
        </FormControl>
    );

    const selectedValues = value.map((selectedOption) => selectedOption.value);

    return [selectedValues, selectElement, setValuesFilter, setInvalid, setOptions, setMessage, invalid, setDisabled];
}
