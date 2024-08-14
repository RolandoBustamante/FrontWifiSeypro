import React, {useEffect, useState} from 'react';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
} from '@mui/material';

export default function useInput({
                                     typeState = 'text',
                                     placeholder = '',
                                     initialState = '',
                                     disabled = false,
                                     invalidate = false,
                                     initialMessage = '',
                                     upperCase = false,
                                     onBlur = () => {
                                     },
                                     style = {},
                                     onFocus = () => {
                                     },
                                     valid = false
                                 }) {
    const [value, setValue] = useState(initialState);
    const [invalid, setInvalid] = useState(invalidate);
    const [message, setMessage] = useState(initialMessage);
    const [isDisabled, setIsDisabled] = useState(disabled);
    const [focusValidate, setFocusValidate] = useState(false);

    useEffect(() => {
        if (focusValidate && valid) {
            const inValidate = focusValidate && value === '';
            setInvalid(inValidate);
            setMessage(inValidate ? `${placeholder} es requerido` : '');
        }
    }, [focusValidate, value, placeholder, valid]);

    const inputValue = (
        <FormControl fullWidth error={invalid}>
            <InputLabel htmlFor={`outlined-adornment-${placeholder}`}>
                {placeholder}
            </InputLabel>
            <OutlinedInput
                id={`outlined-adornment-${placeholder}`}
                type={typeState}
                value={value}
                name={placeholder}
                onBlur={() => {
                    onBlur()
                    setFocusValidate(true)
                }}
                onFocus={onFocus}
                onChange={(event) => {
                    if (!isDisabled) {
                        setValue(upperCase ? event.target.value.toUpperCase() : event.target.value);
                    }
                }}
                label={placeholder}
                style={{...style}}
                fullWidth
                disabled={isDisabled}
            />
            {invalid && (
                <FormHelperText id={`standard-weight-helper-text-${placeholder}`} error>
                    {message===''?`${placeholder} es requerido` :message}
                </FormHelperText>
            )}
        </FormControl>
    );

    return [value, inputValue, setValue, setInvalid, setMessage, invalid, setIsDisabled, setFocusValidate];
}
