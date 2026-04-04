import { supabase } from "./supabase.js";

// REFERENCIAS DOM
const btnLogin = document.getElementById("btnLogin");
const txtCorreo = document.getElementById("correo");
const txtPassword = document.getElementById("password");

// FUNCIONES
const login = async () => {

  const correo = txtCorreo.value.trim();
  const password = txtPassword.value.trim();

  if (!correo || !password) {
    Swal.fire("Ingrese correo y contraseña");
    return;
  }

  //  LOGIN SUPABASE
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: password
  });

  if (error) {
    console.error(error);
    Swal.fire("Correo o contraseña incorrectos");
    return;
  }

  //  TRAER ROL DESDE TU TABLA USUARIOS
  const { data: usuarioDB, error: errorRol } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("correo", correo)
    .maybeSingle();

  if (errorRol) {
    console.error(errorRol);
    Swal.fire("Error obteniendo rol");
    return;
  }
  if (errorRol) {
  console.error(errorRol);
  Swal.fire("Error obteniendo rol");
  return;
}

//  SI NO EXISTE → asumir vendedor
const rol = usuarioDB?.rol || "vendedor";

  // GUARDAR TODO EL USUARIO + ROL
  const usuarioCompleto = {
  id: data.user.id,
  email: data.user.email,
  rol: rol
};

localStorage.setItem("usuario", JSON.stringify(usuarioCompleto));

  Swal.fire("Bienvenido " + usuarioDB.rol);

  window.location.href = "index.html";
};

// Eventos
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