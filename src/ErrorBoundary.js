import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        if(this.state.error?.message.includes('node')) window.location.reload()
        console.error("Error atrapado por ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>Algo salió mal.</h2>
                    <p>{this.state.error?.message || 'Error inesperado.'}</p>
                    <button onClick={() => window.location.reload()}>Recargar página</button>
                </div>
            );
        }

        return this.props.children;
    }
}
ErrorBoundary.propTypes = {
    children: PropTypes.object,
};
export default ErrorBoundary;
