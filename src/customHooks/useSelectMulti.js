import React, {useEffect, useState} from 'react';
import {TextField, Autocomplete, FormControl, FormHelperText} from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function useSelectMulti({
                                           initialState = [],
                                           optionsState = [],
                                           initialMessage = '',
                                           isDisabled = false,
                                           onBlur,
                                           backgroundColor = '',
                                           placeholder = 'Seleccionar...',
                                       }) {
    const theme = useTheme();
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
        <FormControl fullWidth error={invalid}>
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
                        error={invalid}
                        style={{
                            backgroundColor: invalid ? theme.palette.error.light : backgroundColor,
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
            {invalid && (
                <FormHelperText>{message===''? `Debe seleccionar ${placeholder}`:message}</FormHelperText>
            )}
        </FormControl>
    );

    const selectedValues = value.map((selectedOption) => selectedOption.value);

    return [selectedValues, selectElement, setValuesFilter, setInvalid, setOptions, setMessage, invalid, setDisabled];
}
