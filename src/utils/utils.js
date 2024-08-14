import axios from "axios";
import numeral from 'numeral';

function result(format, key = '.00') {
    const isInteger = format.includes(key);

    return isInteger ? format.replace(key, '') : format;
}
export const utilvalidarRuc = ruc => {
    ruc = ruc.trim()

    if (ruc === null) return {success: false, mensaje: 'Ingrese el número de RUC'}

    if (ruc.length !== 11) return {success: false, mensaje: 'Ha ingresado un RUC con menos de 11 digitos'}

    if (!/^([0-9])*$/.test(ruc)) return {success: false, mensaje: 'Ha ingresado un RUC con letras'}

    if (!((ruc >= 1e10 && ruc < 11e9) || (ruc >= 15e9 && ruc < 18e9) || (ruc >= 2e10 && ruc < 21e9))) return {
        success: false, mensaje: 'RUC no válido!'
    }

    const ultimo = ruc.substring(10, 11)
    let suma = 0
    const factores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
    factores.forEach((valor, index) => {
        suma += (Number(ruc.substring(index, index + 1)) * valor)
    })

    const di = Math.trunc(suma / 11)
    let resultado = 11 - (Number(suma) - Number(di) * 11)

    if (resultado === 10) resultado = 0
    if (resultado === 11) resultado = 1

    return Number(ultimo) === resultado ? {success: true, mensaje: 'Ok'} : {success: false, mensaje: 'RUC no válido!'}
}
export const decodeToken = auth => {
    const [, payload] = auth.split('.')
    const decodedPayload = atob(payload)
    return JSON.parse(decodedPayload)
}

export function isJWT(token) {
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    return jwtRegex.test(token);
}
export const cadenaAleatoria = (longitud) => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let resultado = ''
    for (let i = 0; i < longitud; i += 1) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    }
    return resultado
}
export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${process.env.REACT_APP_API_URL}/upload/allFile`, formData, {
        headers: {
            authorization: localStorage.getItem('accessToken') ? `Bearer ${localStorage.getItem('accessToken')}` : '',
            'Content-Type': 'multipart/form-data',
        },
    })
        .then((response) => ({ success: true, file:response.data }))
        .catch((error) => {
            console.error('Error:', error);
            return { success: false, error };
        });
}
export function fCurrency(number) {
    const format = number ? numeral(number).format('0,0.00') : '';

    return result(format, '.00');
}
export function esUUID(str) {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(str);
}