const user = JSON.parse(localStorage.getItem("usuario"));

// páginas públicas
const publicPages = ["login.html"];
const isPublic = publicPages.some(p =>
  window.location.pathname.includes(p)
);

// si no hay usuario → login
if (!user && !isPublic) {
  window.location.href = "login.html";
}

// mostrar email
const usuarioLogueado = document.getElementById("usuarioLogueado");
if (user && usuarioLogueado) {
  usuarioLogueado.innerText = user.email;
}

// CONTROL DE MENÚ POR ROL
const menuClientes = document.getElementById("menuClientes");
const menuEmpleados = document.getElementById("menuEmpleados");

// SOLO OCULTAR SI ES COMPRADOR
if (user?.rol === "comprador") {
  if (menuClientes) menuClientes.style.display = "none";
  if (menuEmpleados) menuEmpleados.style.display = "none";
} else {
  // admin o vendedor → se muestran
  if (menuClientes) menuClientes.style.display = "block";
  if (menuEmpleados) menuEmpleados.style.display = "block";
}

// logout global
window.logout = () => {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
};