import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Qr from '../../Models/Qr';

const WhatsAppQR = () => {
    const [info, setInfo] = useState({ loggedIn: false, qr: null });
    const [loading, setLoading] = useState(false);

    const obtenerEstadoQR = async () => {
        try {
            setLoading(true);
            const response = await Qr.obtenerToken();
            const data = response.data.getQr;
            setInfo(data);
        } catch (error) {
            console.error('Error al obtener QR:', error);
        } finally {
            setLoading(false);
        }
    };

    const cerrarSesion = async () => {
        try {
            setLoading(true);
            const response = await Qr.logout();
            console.log(response.data.logoutWhatsApp.message);
            await obtenerEstadoQR();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setLoading(false);
        }
    };

    const reiniciar = async () => {
        try {
            setLoading(true);
            const response = await Qr.reiniciarCliente();
            console.log(response.data.forceRestartWhatsApp.message);
            await obtenerEstadoQR();
        } catch (error) {
            console.error('Error al reiniciar WhatsApp:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerEstadoQR().then(r=>r);
    }, []);

    return (
        <div style={{ textAlign: 'center' }}>
            {info.loggedIn ? (
                <>
                    <h1>✅ WhatsApp ya está conectado.</h1>
                    <button onClick={cerrarSesion} disabled={loading}>
                        {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
                    </button>
                </>
            ) : (
                <>
                    <h1>📲 Escanea el código QR para conectarte</h1>
                    {info.qr ? (
                        <QRCodeCanvas value={info.qr} size={256} />
                    ) : (
                        <>
                            <p>QR no disponible. Intenta recargar o reiniciar.</p>
                            <button onClick={reiniciar} disabled={loading}>
                                {loading ? 'Reiniciando...' : 'Reiniciar cliente WhatsApp'}
                            </button>
                        </>
                    )}
                    <div style={{ marginTop: 15 }}>
                        <button onClick={obtenerEstadoQR} disabled={loading}>
                            {loading ? 'Cargando...' : 'Volver a cargar QR'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default WhatsAppQR;
