/** @type { HTMLButtonElement } */
const inicioButton = document.querySelector("div.form > button.button");

inicioButton.addEventListener("click", async (event) => {
    await handleRegister();
});

const inputsQueryDefPath = "div.form > div.form-group";
/** @type { HTMLInputElement } */
const gmailInput = document.querySelector(`${inputsQueryDefPath} > input#email`);
/** @type { HTMLInputElement } */
const passwordInput = document.querySelector(`${inputsQueryDefPath} > input#password`);
/** @type { HTMLInputElement } */
const confirmPasswordInput = document.querySelector(`${inputsQueryDefPath} > input#confirm-password`);

async function handleRegister() {
    const gmail = gmailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    if (!stringArrayIsNotEmpty([gmail, password, confirmPassword])) {
        alert("favor de llenar todos los campos antes de registrarse");
        return;
    }
    if (password !== confirmPassword) {
        alert("las contraseñas no coinciden");
        confirmPasswordInput.value = "";
        return;
    }
    const env = await getenv();
    const response = await fetch(`${env.api_url}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gmail, password })
    });
    if (!response.ok) {
        alert("ha habido un fallo al procesar el registro, intente de nuevo.");
        return;
    }
    const parsedResponse = await response.json();
    if (!parsedResponse.success) {
        alert("ha habido un fallo durante el registro de usuario.\n" + parsedResponse.message);
        console.error(parsedResponse.message);
    }
    window.location.href = "/index.html";
}
