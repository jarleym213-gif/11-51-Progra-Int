function login() {
    let correo = document.getElementById("correo").value;
    let password = document.getElementById("password").value;
    if (correo === "admin" && password === "1234") {
        window.location.href = "index.html";
    } else {
        alert("Credenciales incorrectas");
    }
}

function agregarAlCarrito(nombre, precio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push({
        nombre: nombre,
        precio: precio
    });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Producto agregado al carrito");
}

function finalizarCompra() {
    localStorage.removeItem("carrito");
    alert("Compra realizada");
    window.location.reload();
}

