//Usuario logueado
let user = null;

try {
  user = JSON.parse(localStorage.getItem("usuario"));
} catch {
  user = null;
}

// Validar acceso 
const publicPages = ["login.html"];
const isPublic = publicPages.some(p =>
  window.location.pathname.includes(p)
);

if (!user && !isPublic) {
  window.location.href = "login.html";
}

//Mostrar usuario logueado
const usuarioLogueado = document.getElementById("usuarioLogueado");

if (user && usuarioLogueado) {
  usuarioLogueado.innerText = user.email;
}

// Menu según rol
const menuClientes = document.getElementById("menuClientes");
const menuEmpleados = document.getElementById("menuEmpleados");

if (user?.rol === "comprador") {
  if (menuClientes) menuClientes.style.display = "none";
  if (menuEmpleados) menuEmpleados.style.display = "none";
} else {
  if (menuClientes) menuClientes.style.display = "block";
  if (menuEmpleados) menuEmpleados.style.display = "block";
}

//logout
window.logout = () => {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
};