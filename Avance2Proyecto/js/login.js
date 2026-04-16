import { supabase } from "./supabase.js";

const btnLogin = document.getElementById("btnLogin");
const txtCorreo = document.getElementById("correo");
const txtPassword = document.getElementById("password");

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

  const rol = usuarioDB?.rol || "vendedor";

  const usuarioCompleto = {
    id: data.user.id,
    email: data.user.email,
    rol: rol
  };

  localStorage.setItem("usuario", JSON.stringify(usuarioCompleto));

  Swal.fire("Bienvenido " + rol);

  window.location.href = "index.html";
};

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