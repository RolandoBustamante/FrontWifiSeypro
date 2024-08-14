import React, {useEffect, useState} from 'react';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText, InputAdornment, IconButton,
} from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function useInputPass({
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
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (focusValidate && valid) {
            const inValidate = focusValidate && value === '';
            setInvalid(inValidate);
            setMessage(inValidate ? initialMessage??`${placeholder} es requerido` : '');
        }
    }, [focusValidate, value, placeholder, valid, initialMessage]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

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
                type={showPassword ? 'text' : 'password'}
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
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
                label={placeholder}
                style={{...style}}
                fullWidth
                disabled={isDisabled}
            />
            {invalid && (
                <FormHelperText id={`standard-weight-helper-text-${placeholder}`} error>
                    {message!==''?message:`${placeholder} es requerido`}
                </FormHelperText>
            )}
        </FormControl>
    );

    return [value, inputValue, setValue, setInvalid, setMessage, invalid, setIsDisabled, setFocusValidate];
}
