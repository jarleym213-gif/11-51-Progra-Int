import { supabase } from "./supabase.js";
import { actualizarContadorCarrito } from "./carrito-utils.js";

// REFERENCIAS DOM
const tbody = document.getElementById("tbodyEmpleados");
const btnLoad = document.getElementById("btnLoad");
const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");

const txtId = document.getElementById("txtId");
const txtNombre = document.getElementById("txtNombre");
const txtCorreo = document.getElementById("txtCorreo");
const txtRol = document.getElementById("txtRol");
const tituloForm = document.getElementById("tituloForm");
const txtPassword = document.getElementById("txtPassword");

// VARIABLES GLOBALES
let rolUsuario = "";

// INICIO
window.onload = async () => {
  await obtenerRol();
  await consultarEmpleados();
};

// OBTENER ROL DEL USUARIO LOGUEADO
const obtenerRol = async () => {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    window.location.href = "login.html";
    return;
  }

  const { data } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("correo", userData.user.email)
    .maybeSingle();

  rolUsuario = (data?.rol || "vendedor").trim().toLowerCase();

  if (rolUsuario === "comprador") {
    window.location.href = "index.html";
  }
};

// CONSULTAR EMPLEADOS
const consultarEmpleados = async () => {
  const { data, error } = await supabase
    .from("empleados")
    .select("id,nombre,correo,cargo,fecha_creacion")
    .order("id");

  if (error) {
    console.error(error);
    Swal.fire("Error cargando empleados");
    return;
  }

  renderEmpleados(data);
};

// RENDERIZAR EMPLEADOS EN LA TABLA
const renderEmpleados = (data) => {
  tbody.innerHTML = "";

  data.forEach((e) => {
    const botonesAdmin = rolUsuario === "admin"
      ? `
        <button class="btnEditar btn btn-warning btn-sm" data-id="${e.id}">Editar</button>
        <button class="btnEliminar btn btn-danger btn-sm" data-id="${e.id}">Eliminar</button>
      `
      : "";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${e.id}</td>
      <td>${e.nombre}</td>
      <td>${e.correo}</td>
      <td>${e.cargo}</td>
      <td>${new Date(e.fecha_creacion).toLocaleDateString()}</td>
      <td>${botonesAdmin}</td>
    `;

    tbody.appendChild(tr);
  });
};

// GUARDAR EMPLEADO (INSERT O UPDATE)
const guardarEmpleado = async () => {
  const empleado = {
    nombre: txtNombre.value.trim(),
    correo: txtCorreo.value.trim(),
    cargo: txtRol.value.trim(),
  };

  if (!empleado.nombre || !empleado.correo || !empleado.cargo) {
    Swal.fire("Complete todos los campos");
    return;
  }

  if (txtId.value) {
    await actualizarEmpleado(empleado);
  } else {
    await crearEmpleado(empleado);
  }

  limpiarFormulario();
  consultarEmpleados();
};

// CREAR EMPLEADO
const crearEmpleado = async (empleado) => {

  const password = txtPassword.value.trim();

  if (!password) {
    Swal.fire("Debe ingresar una contraseña");
    return;
  }

  // validar duplicado
  const { data: existe } = await supabase
    .from("usuarios")
    .select("*")
    .eq("correo", empleado.correo)
    .maybeSingle();

  if (existe) {
    Swal.fire("El correo ya está registrado");
    return;
  }

  // 1. crear auth con password del admin
  const { data: authData, error: errorAuth } =
    await supabase.auth.signUp({
      email: empleado.correo,
      password: password,
    });

  if (errorAuth || !authData.user) {
    console.error(errorAuth);
    Swal.fire("Error creando usuario");
    return;
  }

  const userId = authData.user.id;

  // 2. guardar usuario
  await supabase.from("usuarios").insert([{
    id: userId,
    correo: empleado.correo,
    rol: empleado.cargo
  }]);

  // 3. guardar empleado con usuario_id
  const { error } = await supabase.from("empleados").insert([{
    nombre: empleado.nombre,
    correo: empleado.correo,
    cargo: empleado.cargo,
    usuario_id: userId
  }]);

  if (error) {
    console.error(error);
    Swal.fire("Error guardando empleado");
    return;
  }

  Swal.fire("Empleado creado correctamente");
};

// ACTUALIZAR EMPLEADO
const actualizarEmpleado = async (empleado) => {

  const { error } = await supabase
    .from("empleados")
    .update({
      nombre: empleado.nombre,
      correo: empleado.correo,
      cargo: empleado.cargo
    })
    .eq("id", txtId.value);

  if (error) {
    console.error(error);
    Swal.fire("Error actualizando");
    return;
  }

  await supabase
    .from("usuarios")
    .update({ rol: empleado.cargo })
    .eq("correo", empleado.correo);

  Swal.fire("Empleado actualizado");
};

// ELIMINAR EMPLEADO
const eliminarEmpleado = async (id) => {
  if (rolUsuario !== "admin") return;

  if (!confirm("¿Eliminar empleado?")) return;

  const { error } = await supabase
    .from("empleados")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    Swal.fire("Error eliminando");
  } else {
    consultarEmpleados();
  }
};

//LIMPIAR FORMULARIO
const limpiarFormulario = () => {
  txtId.value = "";
  txtNombre.value = "";
  txtCorreo.value = "";
  txtRol.value = "";
  txtPassword.value = "";
  btnAdd.textContent = "Guardar";
  tituloForm.textContent = "Agregar Empleado";
};

// ACTUALIZAR CONTADOR CARRITO
document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
});

// EVENTOS
btnLoad?.addEventListener("click", consultarEmpleados);
btnAdd?.addEventListener("click", guardarEmpleado);
btnCancel?.addEventListener("click", limpiarFormulario);

tbody?.addEventListener("click", async (e) => {
  const target = e.target;

  if (target.classList.contains("btnEliminar")) {
    await eliminarEmpleado(target.dataset.id);
  }

  if (target.classList.contains("btnEditar")) {
    const { data } = await supabase
      .from("empleados")
      .select("*")
      .eq("id", target.dataset.id)
      .single();

    txtId.value = data.id;
    txtNombre.value = data.nombre;
    txtCorreo.value = data.correo;
    txtRol.value = data.cargo;

    btnAdd.textContent = "Actualizar";
    tituloForm.textContent = "Editar Empleado";
  }
});