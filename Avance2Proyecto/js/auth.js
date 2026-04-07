// Obtenemos el usuario 
const user = JSON.parse(localStorage.getItem("usuario"));

//Validamos si el usuario está logueado o no
if (!user) {
  // si NO está logueado → lo manda al login
  if (!window.location.href.includes("login.html")) {
    window.location.href = "login.html";
  }
}

// Mostramos el email del usuario logueado en el header
const usuarioLogueado = document.getElementById("usuarioLogueado");

if (user && usuarioLogueado) {
  usuarioLogueado.innerText = user.email;
}


// Logout: 
window.logout = () => {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
};

