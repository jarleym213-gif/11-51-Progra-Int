function login() {
    let correo = document.getElementById("correo").value;
    let password = document.getElementById("password").value;
    if (correo === "admin" && password === "1234") {
        window.location.href = "index.html";
    } else {
        alert("Credenciales incorrectas");
    }
}

