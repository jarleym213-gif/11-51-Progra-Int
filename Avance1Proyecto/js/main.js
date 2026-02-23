// LOGIN SIMPLE
function login() {
    let correo = document.getElementById("correo").value;
    let password = document.getElementById("password").value;

    if (correo === "admin@gmail.com" && password === "1234") {
        window.location.href = "index.html";
    } else {
        alert("Credenciales incorrectas");
    }
}

// OBTENER CARRITO GUARDADO
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let total = 0;

// AGREGAR PRODUCTO
function agregarAlCarrito(nombre, precio) {

    carrito.push({nombre, precio});

    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert("Producto agregado al carrito");
}

// MOSTRAR CARRITO
if (document.getElementById("listaCarrito")) {

    let lista = document.getElementById("listaCarrito");

    carrito.forEach(p => {
        lista.innerHTML += `
            <div class="card">
                <p>${p.nombre}</p>
                <p>₡${p.precio}</p>
            </div>
        `;
        total += p.precio;
    });

    document.getElementById("total").innerText = "Total: ₡" + total;
}

// FINALIZAR COMPRA
function finalizarCompra() {
    alert("Compra realizada con éxito");
    localStorage.removeItem("carrito");
}