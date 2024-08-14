import { useState } from 'react';

function useRadioButtons(initialValue, options, placeholder,disabled) {
    const [selectedOption, setSelectedOption] = useState(initialValue);
    const RadioButtons = () => (
        <div style={{ position: "relative", marginBottom: 10 }}>
            <div style={{ position: "absolute", top: -20, left: 0 }}>{placeholder}</div>
            <div style={{ display: "flex", flexDirection: "row" }}>
                {options.map((option) => (
                    <div
                        key={option.value}
                        style={{ margin: 3, padding: 0, display: "flex", alignItems: "center" }}
                    >
                        <input
                            type="radio"
                            id={option.value}
                            value={option.value}
                            checked={selectedOption === option.value}
                            onChange={(event) => setSelectedOption(event.target.value)}
                            disabled={disabled}
                        />
                        <label htmlFor={option.value} style={{ marginLeft: 5 }}>
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );

    return [selectedOption, RadioButtons, setSelectedOption];
}

export default useRadioButtons;