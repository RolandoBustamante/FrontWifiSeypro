import { Worker, Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import PropTypes from 'prop-types';

// Estilos necesarios
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const VisorPDFWrapper = ({ fileUrl }) => {
    VisorPDFWrapper.propTypes = {
        fileUrl: PropTypes.string.isRequired,
    };
    if (!fileUrl) return null;

    const toolbarPluginInstance = toolbarPlugin();
    const {Toolbar} = toolbarPluginInstance;


    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div style={{height: '40px', backgroundColor: '#f5f5f5'}}>
                <Toolbar />
            </div>
            <div>
                <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
            </div>
        </Worker>
    );
};

export default VisorPDFWrapper;
