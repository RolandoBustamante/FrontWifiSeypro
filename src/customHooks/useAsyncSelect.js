import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, FormControl, TextField, Typography } from '@mui/material';

export default function useAsyncSelect({
  initialState = '',
  optionsState = [],
  initialMessage = '',
  noOptions = 'Escriba para buscar',
  modelo = {},
  labelPlace = '',
  disabled = false
}) {
  const [values, setValue] = useState(initialState);
  const [options, setOptions] = useState(optionsState);
  const [invalid, setInvalid] = useState(false);
  const [message, setMessage] = useState(initialMessage);
  const [textValue, setTextValue] = useState('');
  const [dis, setDisabled] = useState(disabled);
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);
  const { Model, respuesta, table, getByParam } = modelo;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!textValue || textValue.length < 2) return undefined;

    const currentRequestId = requestIdRef.current + 1;
    requestIdRef.current = currentRequestId;

    const timer = setTimeout(() => {
      if (!Model || !respuesta) return;

      const getByParamFunc = getByParam || 'getByParam';
      const query = table ? { table, param: textValue } : textValue;

      Promise.resolve(Model[getByParamFunc](query))
        .then((response) => {
          if (!mountedRef.current || requestIdRef.current !== currentRequestId) return;
          const data = response?.data?.[respuesta] || [];
          setOptions(data);
        })
        .catch(() => {
          if (!mountedRef.current || requestIdRef.current !== currentRequestId) return;
          setOptions([]);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [textValue, Model, respuesta, table, getByParam]);

  const renderOption = (props, option) => (
    <li {...props}>
      <Typography variant="body2">{option.label}</Typography>
    </li>
  );

  const selectElement = (
    <FormControl error={invalid} style={{ minWidth: '100%' }}>
      <Autocomplete
        options={options}
        disabled={dis}
        getOptionLabel={({ label }) => label}
        getOptionSelected={({ value }) => value === values}
        value={options.find((element) => element.value === values) || null}
        onChange={(e, newValue) => setValue(newValue ? newValue.value : '')}
        isOptionEqualToValue={(option, value) => option?.value === value?.value}
        filterOptions={(x) => x}
        renderInput={(params) => (
          <TextField
            {...params}
            label={labelPlace}
            disabled={disabled}
            onChange={({ target }) => {
              setTextValue(target.value || '');
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
  );

  return [values, selectElement, setValue, setInvalid, setOptions, setMessage, invalid, options, setDisabled];
}
