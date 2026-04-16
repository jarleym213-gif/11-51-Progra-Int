import { supabase } from "./supabase.js";

const txtNombre = document.getElementById("txtNombre");
const txtCorreo = document.getElementById("txtCorreo");
const txtPassword = document.getElementById("txtPassword");
const txtConfirmPassword = document.getElementById("txtConfirmPassword");
const txtTelefono = document.getElementById("txtTelefono");
const btnRegistrar = document.getElementById("btnRegistrar");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
console.log(togglePassword);
const registrar = async () => {
  const nombre = txtNombre.value.trim();
  const correo = txtCorreo.value.trim();
  const password = txtPassword.value.trim();
  const telefono = txtTelefono.value.trim();
  const confirmPassword = txtConfirmPassword.value.trim();

  // validar campos
  if (!password || !confirmPassword) {
    Swal.fire("Ingrese la contraseña");
    return;
  }

  // validar longitud
  if (password.length < 6) {
    Swal.fire("La contraseña debe tener mínimo 6 caracteres");
    return;
  }

  // validar coincidencia
  if (password !== confirmPassword) {
    Swal.fire("Las contraseñas no coinciden");
    return;
  }
  console.log(togglePassword);

  //  Validar si ya existe
  const { data: existe } = await supabase
    .from("usuarios")
    .select("*")
    .eq("correo", correo)
    .maybeSingle();

  if (existe) {
    Swal.fire("El correo ya está registrado");
    return;
  }

  // 🔹 1. Crear usuario en AUTH
const { data, error } = await supabase.auth.signUp({
  email: correo,
  password: password,
});

if (error) {
  console.error("ERROR AUTH:", error);
  Swal.fire(error.message);
  return;
}

// IMPORTANTE
if (!data.user) {
  Swal.fire("No se pudo crear el usuario");
  return;
}

const user = data.user;

// 🔹 2. Guardar rol = comprador
const { error: errorInsert } = await supabase.from("usuarios").insert([
  {
    id: user.id,
    correo: correo,
    rol: "comprador",
  },
]);

if (errorInsert) {
  console.error(errorInsert);
  Swal.fire("Error guardando usuario");
  return;
}

  // 🔹 2. Guardar rol = comprador
  await supabase.from("usuarios").insert([
    {
      id: user.id,
      correo: correo,
      rol: "comprador",
    },
  ]);

  // 🔹 3. Guardar cliente
  await supabase.from("clientes").insert([
    {
      nombre: nombre,
      correo: correo,
      telefono: telefono,
    },
  ]);

  Swal.fire("Registro exitoso");

  window.location.href = "login.html";
};

btnRegistrar.addEventListener("click", registrar);
// Mostrar / ocultar password
if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    if (txtPassword.type === "password") {
      txtPassword.type = "text";
      togglePassword.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
      txtPassword.type = "password";
      togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
    }
  });
}

// Mostrar / ocultar confirm password
if (toggleConfirmPassword) {
  toggleConfirmPassword.addEventListener("click", () => {
    if (txtConfirmPassword.type === "password") {
      txtConfirmPassword.type = "text";
      toggleConfirmPassword.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
      txtConfirmPassword.type = "password";
      toggleConfirmPassword.innerHTML = '<i class="fas fa-eye"></i>';
    }
  });
}
