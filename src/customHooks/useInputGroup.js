import React, { useEffect, useState } from 'react';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Search } from '@mui/icons-material';

export default function useInputPass({
                                         placeholder = '',
                                         initialState = '',
                                         disabled = false,
                                         typeState = '',
                                         invalidate = false,
                                         initialMessage = '',
                                         upperCase = false,
                                         onBlur = () => {},
                                         style = {},
                                         onFocus = () => {},
                                         onClick = () => {},
                                         valid = false,
                                         icon = <Search />,
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

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
                    onBlur();
                    setFocusValidate(true);
                }}
                onFocus={onFocus}
                onChange={(event) => {
                    if (!isDisabled) {
                        setValue(upperCase ? event.target.value.toUpperCase() : event.target.value);
                    }
                }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={onClick}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                        >
                            {icon}
                        </IconButton>
                    </InputAdornment>
                }
                label={placeholder}
                style={{ ...style }}
                fullWidth
                disabled={isDisabled}
            />
            {invalid && (
                <FormHelperText id={`standard-weight-helper-text-${placeholder}`} error>
                    {message===''? `${placeholder} es requerido`: message}
                </FormHelperText>
            )}
        </FormControl>
    );

    return [value, inputValue, setValue, setInvalid, setMessage, invalid, setIsDisabled, setFocusValidate];
}
