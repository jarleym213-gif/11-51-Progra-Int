// Usuarios

let usuarios = [
  { correo: "cliente@gmail.com", password: "1234", rol: "cliente" },
  { correo: "empleado@gmail.com", password: "1234", rol: "empleado" }
];

function login() {
  let correo = document.getElementById("correo").value;
  let password = document.getElementById("password").value;

  let usuario = usuarios.find(u => u.correo === correo && u.password === password);

  if (usuario) {

      localStorage.setItem("rol", usuario.rol);

      if (usuario.rol === "cliente") {
          window.location.href = "index.html";
      } else if (usuario.rol === "empleado") {
          window.location.href = "empleado.html";
      }

  } else {
      alert("Credenciales incorrectas");
  }
}

// Productos

class Producto {
    constructor(id, nombre, marca, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.marca = marca;
        this.precio = precio;
        this.stock = stock;
    }
}

let productos = [
    new Producto(1, "Mouse Gamer", "Logitech", 12000, 10),
    new Producto(2, "Teclado Mecánico", "Redragon", 18000, 5),
    new Producto(3, "Audífonos RGB", "HyperX", 25000, 8)
];



// Mostrar productos

if (document.getElementById("productos")) {

    let contenedor = document.getElementById("productos");

    productos.forEach(p => {
        contenedor.innerHTML += `
            <div class="card">
                <h3>${p.nombre}</h3>
                <p>Marca: ${p.marca}</p>
                <p>Precio: ₡${p.precio}</p>
                <button onclick="agregarAlCarrito(${p.id})">
                    Agregar al carrito
                </button>
            </div>
        `;
    });
}


// Carrito

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarAlCarrito(id) {
    let producto = productos.find(p => p.id === id);
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Producto agregado");
}


// Mostrar carrito

if (document.getElementById("listaCarrito")) {

    let lista = document.getElementById("listaCarrito");
    let total = 0;

    carrito.forEach(p => {
        lista.innerHTML += `
            <div class="card">
                <h4>${p.nombre}</h4>
                <p>₡${p.precio}</p>
            </div>
        `;
        total += p.precio;
    });

    document.getElementById("total").innerText = "Total: ₡" + total;
}


// Finalizar compra y cerrar sesión
function finalizarCompra() {
    alert("Pedido generado con estado: Pendiente");
    localStorage.removeItem("carrito");
    window.location.href = "index.html";
}
function cerrarSesion() {
    localStorage.clear();
    window.location.href = "login.html";
}