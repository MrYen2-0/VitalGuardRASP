/**
 * obtiene las "variables de entorno" simuladas en el archivo JSON
 * @returns {Promise<{ api_url: string, ws_url: string, success: boolean }>}
 */
async function getenv() {
    try {
        const response = await fetch("/env.config.json", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error("error al intentar cargar las variables de entorno");
            return { success: false }
        };
        const parsedResponse = await response.json();
        return {
            ...parsedResponse,
            success: true
        }
    } catch (error) {
        console.log("error al intentar obtener las variables de entorno.", error);
        return { success: false };
    }
}

/** @param {[string]} strings */
function stringArrayIsNotEmpty(strings = []) {
    return strings.every(value => value && value.length > 0);
}

/**
 * esta funcion chequea el token almacenado en la cookie, 
 * si la cookie no existe, no es valida o esta expirada devuelve al usuario al inicio
 */

async function checkToken() {
    try {
        const env = await getenv();
        const response = await fetch(`${env.api_url}/auth`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const parsedResponse = await response.json();
        if (!parsedResponse.success) {
            console.error(parsedResponse.message);
            return;
        }
        console.info(parsedResponse.message);
        return;
    } catch (error) {
        console.error("error al intentar chequear el token.", error);
        window.location.href = '/';
        return;
    }
}

/**
 * @typedef BpmOrTempWSMessage
 * @property {string} topic
 * @property {{ Event: string, valor: number }} parsedData
 */

/**
 * @typedef ToqueWSMessage
 * @property {string} topic
 * @property {{ Event: string, valor: boolean }} parsedData
 */