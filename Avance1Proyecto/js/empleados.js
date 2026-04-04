import { supabase } from "./supabase.js";

// REFERENCIAS DOM
const tbody = document.getElementById("tbodyEmpleados");
const btnLoad = document.getElementById("btnLoad");
const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");


const txtId = document.getElementById("txtId");
const txtNombre = document.getElementById("txtNombre");
const txtCorreo = document.getElementById("txtCorreo");
const txtPuesto = document.getElementById("txtPuesto");
const tituloForm = document.getElementById("tituloForm");

// FUNCIONES
let rolUsuario = "";

// CONSULTAR
const consultarEmpleados = async () => {

  const { data, error } = await supabase
    .from("empleados")
    .select("id,nombre,correo,cargo")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    Swal.fire("Error cargando empleados");
    return;
  }

  tbody.innerHTML = "";

  data.forEach((e) => {

    const botonesAdmin = rolUsuario === "admin"
      ? `
        <button class="btnEditar btn btn-warning btn-sm" data-id="${e.id}">
          Editar
        </button>
        <button class="btnEliminar btn btn-danger btn-sm" data-id="${e.id}">
          Eliminar
        </button>
      `
      : "";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${e.id}</td>
      <td>${e.nombre}</td>
      <td>${e.correo}</td>
      <td>${e.cargo}</td>
      <td>${botonesAdmin}</td>
    `;

    tbody.appendChild(tr);

  });

};

// GUARDAR
const guardarEmpleado = async () => {

  const empleado = {
    nombre: txtNombre.value.trim(),
    correo: txtCorreo.value.trim(),
    cargo: txtPuesto.value.trim()
  };

  if (!empleado.nombre || !empleado.correo || !empleado.cargo) {
    Swal.fire("Complete todos los campos");
    return;
  }

  let error;

  if (txtId.value) {

    const response = await supabase
      .from("empleados")
      .update(empleado)
      .eq("id", txtId.value);

    error = response.error;

  } else {

    const response = await supabase
      .from("empleados")
      .insert([empleado]);

    error = response.error;

  }

  if (error) {
    console.error(error);
    Swal.fire("Error guardando empleado");
    return;
  }

  Swal.fire("Empleado guardado correctamente");

  limpiarFormulario();
  consultarEmpleados();

};

// ELIMINAR
const eliminarEmpleado = async (id) => {
  if (rolUsuario !== "admin") return;
  if (!confirm("¿Eliminar empleado?")) return;

  const { error } = await supabase
    .from("empleados")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    Swal.fire("Error eliminando empleado");
  } else {
    consultarEmpleados();
  }

};

// LIMPIAR
const limpiarFormulario = () => {
  txtId.value = "";
  txtNombre.value = "";
  txtCorreo.value = "";
  txtPuesto.value = "";
   btnAdd.textContent = "Guardar";
  tituloForm.textContent = "Agregar Empleado";
};

// EVENTOS

if (btnLoad) btnLoad.addEventListener("click", consultarEmpleados);
if (btnAdd) btnAdd.addEventListener("click", guardarEmpleado);
if (btnCancel) btnCancel.addEventListener("click", limpiarFormulario);

// DELEGACIÓN
tbody.addEventListener("click", async (event) => {

  const target = event.target;

  if (target.classList.contains("btnEliminar")) {
    const id = target.getAttribute("data-id");
    await eliminarEmpleado(id);
  }

  if (target.classList.contains("btnEditar")) {

    const id = target.getAttribute("data-id");

    const { data, error } = await supabase
      .from("empleados")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      Swal.fire("Error cargando empleado");
      return;
    }

    txtId.value = data.id;
    txtNombre.value = data.nombre;
    txtCorreo.value = data.correo;
    txtPuesto.value = data.cargo;
      btnAdd.textContent = "Actualizar";
    tituloForm.textContent = "Editar Empleado";
  }

});

// INICIALIZACIÓN
window.onload = async () => {
  await obtenerRol();

  console.log("Rol detectado:", rolUsuario);

  // 🔥 OCULTAR MENÚ SI ES COMPRADOR
  if (rolUsuario === "comprador") {
    const menuClientes = document.getElementById("menuClientes");
    const menuEmpleados = document.getElementById("menuEmpleados");

    if (menuClientes) menuClientes.style.display = "none";
    if (menuEmpleados) menuEmpleados.style.display = "none";
  }

  await consultarEmpleados();
};


// OBTENER ROL USUARIO
const obtenerRol = async () => {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    window.location.href = "login.html";
    return;
  }

  const { data, error } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("correo", userData.user.email)
    .maybeSingle();

  if (error) {
    console.error(error);
    return;
  }

  rolUsuario = (data?.rol || "vendedor").trim().toLowerCase();

  console.log("EMAIL:", userData.user.email);
  console.log("ROL BD:", data);
};
