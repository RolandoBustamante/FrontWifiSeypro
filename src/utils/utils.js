import axios from "axios";
import numeral from 'numeral';
import {HOST_API_KEY} from '../config-global';


function result(format, key = '.00') {
    const isInteger = format.includes(key);

    return isInteger ? format.replace(key, '') : format;
}
export const utilvalidarDni = dni => {
    dni = dni.trim()

    if (!dni) return { success: false, mensaje: 'Ingrese el número de DNI' }

    if (dni.length !== 8) return { success: false, mensaje: 'El DNI debe tener 8 dígitos' }

    if (!/^\d{8}$/.test(dni)) return { success: false, mensaje: 'El DNI solo debe contener números' }

    return { success: true, mensaje: 'Ok' }
}
export const numeroALetras = (num) => {
    const UNIDADES = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
    const DECENAS = ["", "DIEZ", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
    const CENTENAS = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

    const getCientos = (n) => {
        if (n === 100) return "CIEN";
        const c = Math.floor(n / 100);
        const d = Math.floor((n % 100) / 10);
        const u = n % 10;

        let result = CENTENAS[c];
        if (d === 1 && u > 0) {
            const especiales = ["ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE"];
            return result + " " + (especiales[u - 1] || "DIECI" + UNIDADES[u]);
        }

        if (d === 2 && u > 0) {
            return result + " VEINTI" + UNIDADES[u];
        }

        return result + (DECENAS[d] ? " " + DECENAS[d] : "") + (u > 0 ? " Y " + UNIDADES[u] : "");
    };

    const entero = Math.floor(num);
    const centimos = Math.round((num - entero) * 100);

    let literal = "";
    if (entero === 0) literal = "CERO";
    else if (entero <= 999) literal = getCientos(entero);
    else if (entero < 1000000) {
        const miles = Math.floor(entero / 1000);
        const resto = entero % 1000;
        literal = (miles === 1 ? "MIL" : getCientos(miles) + " MIL") + (resto > 0 ? " " + getCientos(resto) : "");
    } else {
        literal = "UN MILLÓN O MÁS";
    }

    const cent = centimos.toString().padStart(2, "0");

    return `${literal} CON ${cent}/100 SOLES`;
};


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
        .then((response) => ({success: true, file: response.data}))
        .catch((error) => {
            console.error('Error:', error);
            return {success: false, error};
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

export const uploadImg = (file, type, name = null,) => {
    const formData = new FormData()
    formData.append('img', file)
    formData.append('type', type)
    formData.append('name', name ? name.toString().split('.')[0] : null)

    return fetch(`${HOST_API_KEY}/uploadDrive`, {
        method: 'POST',
        headers: {
            authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
    })
}
export const filtrarMenuConAccesos = (items, accesosGuardados) => {
    return items
        .map(item => {
            if (item.children) {
                const hijosFiltrados = filtrarMenuConAccesos(item.children, accesosGuardados);
                if (hijosFiltrados.length > 0) {
                    return { ...item, children: hijosFiltrados };
                }
                return null;
            }

            const encontrado = accesosGuardados.some(acceso => acceso.id === item.id);
            return encontrado ? item : null;
        })
        .filter(item => item !== null);
};