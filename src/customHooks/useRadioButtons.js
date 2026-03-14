import React, { useState } from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

function useRadioButtons(initialValue, options, placeholder, disabled) {
    const [selectedOption, setSelectedOption] = useState(initialValue);

    const RadioButtons = () => (
        <FormControl>
            {placeholder && <FormLabel>{placeholder}</FormLabel>}
            <RadioGroup
                row
                value={String(selectedOption)}
                onChange={(event) => {
                    const value = event.target.value === 'true';
                    setSelectedOption(value);
                }}
            >
                {options.map((option) => (
                    <FormControlLabel
                        key={String(option.value)}
                        value={String(option.value)}
                        control={<Radio size="small" disabled={disabled} />}
                        label={option.label}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );

    return [selectedOption, RadioButtons, setSelectedOption];
}

export default useRadioButtons;
