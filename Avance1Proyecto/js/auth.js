// ================================
// OBTENER USUARIO
// ================================
const user = JSON.parse(localStorage.getItem("usuario"));

// ================================
// VALIDAR SESIÓN
// ================================
if (!user) {
  // si NO está logueado → lo manda al login
  if (!window.location.href.includes("login.html")) {
    window.location.href = "login.html";
  }
}

// ================================
// MOSTRAR USUARIO
// ================================
const usuarioLogueado = document.getElementById("usuarioLogueado");

if (user && usuarioLogueado) {
  usuarioLogueado.innerText = user.email;
}


// ================================
// LOGOUT
// ================================
window.logout = () => {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
};

