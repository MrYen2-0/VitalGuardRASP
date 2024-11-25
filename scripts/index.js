/** @type {HTMLInputElement} */
const gmailInput = document.getElementById("email");
/** @type {HTMLInputElement} */
const passwordInput = document.getElementById("password");
/** @type {HTMLButtonElement} */
const loginButton = document.querySelector('button.button');

async function handleLogin() {
    const gmail = gmailInput.value;
    const password = passwordInput.value;
    if (!stringArrayIsNotEmpty([gmail, password])) {
        alert("favor de llenar todos los campos antes de continuar");
        return;
    }
    const response = await loginRequest(gmail, password);
    if (response.success) {
        console.log(response.message);
        window.location.href = "/inicio.html";
    }
}

/** @returns {Promise<{ success: boolean, message: string }>} */
async function loginRequest(gmail, password) {
    try {
        const env = await getenv();
        const response = await fetch(`${env.api_url}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ gmail, password })
        });
        const parsedResponse = await response.json();
        if (!response.ok) {
            console.error("la peticion no pudo ser ejecutada exitosamente.", res);
            return { success: false };
        }
        if (!parsedResponse) {
            console.error("la respuesta de la peticion esta dañada o no tiene el formato esperado.")
            return { success: false };
        }
        if (parsedResponse.success) {
            console.error("la peticion ha fallado.\nmotivo:\n", parsedResponse.message);
        }
        return parsedResponse;
    } catch (error) {
        console.error("error al hacer fetch-login al servidor.", error);
        return { success: false, message: error.message };
    }
}