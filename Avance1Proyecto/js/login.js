import { supabase } from "./supabase.js";

// Referencias DOM
const btnLogin = document.getElementById("btnLogin");
const txtCorreo = document.getElementById("correo");
const txtPassword = document.getElementById("password");

// Funciones
const login = async () => {

  const correo = txtCorreo.value.trim();
  const password = txtPassword.value.trim();

  if (!correo || !password) {
    Swal.fire("Ingrese correo y contraseña");
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: password
  });

  if (error) {
    console.error(error);
    Swal.fire("Correo o contraseña incorrectos");
    return;
  }

  Swal.fire("Bienvenido");

  window.location.href = "index.html";
};

//Eventos
if (btnLogin) {
  btnLogin.addEventListener("click", login);
}

if (txtPassword) {
  txtPassword.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      login();
    }
  });
}