import React, {useEffect, useState} from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Qr from "../../Models/Qr";

const WhatsAppQR = () => {
    const [info, setInfo]= useState({})

    useEffect(()=>{
       Qr.obtenerToken().then(response=>{
           const data= response.data.getQr
           setInfo(data)
       })
    },[])
    return (
        <div>
            {info.loggedIn ? (
                <h1>WhatsApp ya está conectado.</h1>
            ) : (
                <div>
                    <h1>Escanea este código QR para conectarte a WhatsApp</h1>
                    {info.qr && <QRCodeCanvas value={info.qr} />}
                </div>
            )}
        </div>
    );
};

export default WhatsAppQR;