import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

const MyDropzone = ({
                        onDrop,
                        accept,
                        placeholder,
                        disabled,
                        height = 50,
                        maxSize = Infinity,
                        borderColor = '#cccccc',
                        borderHoverColor = '#0000ff',
                        backgroundColor = '#f9f9f9',
                        textColor = '#666',
                        disabledColor = '#e0e0e0',
                    }) => {
    const [fileName, setFileName] = useState(null);

    const handleFileNameUpdate = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFileName(acceptedFiles[0].name);
        }
        onDrop(acceptedFiles);
    };

    const dynamicStyles = {
        height,
        border: `2px dashed ${borderColor}`,
        borderRadius: '8px',
        backgroundColor: disabled ? disabledColor : backgroundColor,
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        transition: 'border-color 0.3s ease, background-color 0.3s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
    };

    return (
        <Dropzone
            onDrop={handleFileNameUpdate}
            accept={accept}
            multiple={false}
            disabled={disabled}
            maxSize={maxSize}
        >
            {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
                <section className="dropzone-wrapper" style={{ height }}>
                    <div
                        {...getRootProps()}
                        style={{
                            ...dynamicStyles,
                            borderColor: isDragActive ? borderHoverColor : borderColor,
                        }}
                    >
                        <input {...getInputProps()} />
                        <p className="m-0" style={{ margin: 0 }}>
                            {isDragReject
                                ? 'Archivo no soportado'
                                : fileName || placeholder || 'Arrastra o haz clic para seleccionar un archivo'}
                        </p>
                    </div>
                </section>
            )}
        </Dropzone>
    );
};

MyDropzone.propTypes = {
    onDrop: PropTypes.func.isRequired,
    accept: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxSize: PropTypes.number,
    borderColor: PropTypes.string,
    borderHoverColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    disabledColor: PropTypes.string,
};

export default MyDropzone;
