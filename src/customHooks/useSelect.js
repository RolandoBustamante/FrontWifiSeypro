import React, {useState} from 'react';
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function useSelect({
                                      initialState = '',
                                      optionsState = [],
                                      initialMessage = '',
                                      isDisabled = false,
                                      onBlur,
                                      backgroundColor = '',
                                      placeholder = 'Seleccionar...'
                                  }) {
    const theme = useTheme();
    const [value, setValue] = useState(initialState);
    const [options, setOptions] = useState(optionsState);
    const [invalid, setInvalid] = useState(false);
    const [message, setMessage] = useState(initialMessage);
    const [disabled, setDisabled] = useState(isDisabled);
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const handleOpen = () => {
        setIsMenuOpen(true);
    };

    const handleClose = () => {
        setIsMenuOpen(false);
    };
    const selectElement = (
        <FormControl fullWidth error={invalid}>
            <InputLabel
                id="select-label"
                shrink={value || isMenuOpen ? true : null}
            >
                {placeholder}
            </InputLabel>
            <Select
                labelId="select-label"
                id="select"
                label={placeholder}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    handleClose();
                }}
                onBlur={onBlur || (() => {})}
                disabled={disabled}
                MenuProps={{
                    open: isMenuOpen,
                    onClose: handleClose
                }}
                onOpen={handleOpen}
                style={{
                    backgroundColor: invalid ? theme.palette.error.light : backgroundColor,
                    padding: 2,
                    borderRadius: 5
                }}
                renderValue={(selected) => {
                    const selectedOption = options.find((option) => option.value === selected);
                    return selectedOption ? selectedOption.label : <em>{placeholder}</em>;
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            {invalid && (
                <FormHelperText>{message === '' ? `Debe seleccionar ${placeholder}` : message}</FormHelperText>
            )}
        </FormControl>

    );

    return [value, selectElement, setValue, setInvalid, setOptions, setMessage, invalid, setDisabled];
}
