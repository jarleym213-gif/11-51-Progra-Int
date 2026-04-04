import { supabase } from "./supabase.js";

// REFERENCIAS DOM
const tbody = document.getElementById("tbodyClientes");
const btnLoad = document.getElementById("btnLoad");
const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");

const txtId = document.getElementById("txtId");
const txtNombre = document.getElementById("txtNombre");
const txtCorreo = document.getElementById("txtCorreo");
const txtTelefono = document.getElementById("txtTelefono");
const tituloForm = document.getElementById("tituloForm");

// FUNCIONES
// VARIABLES GLOBALES
let rolUsuario = "";

// CONSULTAR
const consultarClientes = async () => {

  const { data, error } = await supabase
    .from("clientes")
    .select("id,nombre,correo,telefono")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    Swal.fire("Error cargando clientes");
    return;
  }

  tbody.innerHTML = "";

  data.forEach((c) => {

    const botonesAdmin = rolUsuario === "admin"
      ? `
        <button class="btnEditar btn btn-warning btn-sm" data-id="${c.id}">
          Editar
        </button>
        <button class="btnEliminar btn btn-danger btn-sm" data-id="${c.id}">
          Eliminar
        </button>
      `
      : "";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.nombre}</td>
      <td>${c.correo}</td>
      <td>${c.telefono}</td>
      <td>${botonesAdmin}</td>
    `;

    tbody.appendChild(tr);

  });
};

// GUARDAR
const guardarCliente = async () => {

  const cliente = {
    nombre: txtNombre.value.trim(),
    correo: txtCorreo.value.trim(),
    telefono: txtTelefono.value.trim()
  };

  if (!cliente.nombre || !cliente.correo || !cliente.telefono) {
    Swal.fire("Complete todos los campos");
    return;
  }

  let error;

  if (txtId.value) {

    const response = await supabase
      .from("clientes")
      .update(cliente)
      .eq("id", txtId.value);

    error = response.error;

  } else {

    const response = await supabase
      .from("clientes")
      .insert([cliente]);

    error = response.error;

  }

  if (error) {
    console.error(error);
    Swal.fire("Error guardando cliente");
    return;
  }

  Swal.fire("Cliente guardado correctamente");

  limpiarFormulario();
  consultarClientes();

};

// ELIMINAR
const eliminarCliente = async (id) => {
  if (rolUsuario !== "admin") return;
 
  if (!confirm("¿Eliminar cliente?")) return;

  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    Swal.fire("Error eliminando cliente");
  } else {
    consultarClientes();
  }

};

// LIMPIAR
const limpiarFormulario = () => {
  txtId.value = "";
  txtNombre.value = "";
  txtCorreo.value = "";
  txtTelefono.value = "";
  btnAdd.textContent = "Guardar";
  tituloForm.textContent = "Agregar Cliente";
};

// EVENTOS
if (btnLoad) btnLoad.addEventListener("click", consultarClientes);
if (btnAdd) btnAdd.addEventListener("click", guardarCliente);
btnCancel.addEventListener("click", async () => limpiarFormulario());
// DELEGACIÓN
tbody.addEventListener("click", async (event) => {
   
  const target = event.target;
  if (rolUsuario !== "admin") return;
  if (target.classList.contains("btnEliminar")) {
    const id = target.getAttribute("data-id");
    await eliminarCliente(id);
  }

  if (target.classList.contains("btnEditar")) {

    const id = target.getAttribute("data-id");

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      Swal.fire("Error cargando cliente");
      return;
    }

    txtId.value = data.id;
    txtNombre.value = data.nombre;
    txtCorreo.value = data.correo;
    txtTelefono.value = data.telefono;
    btnAdd.textContent = "Actualizar";
    tituloForm.textContent = "Editar Cliente";
  }

});

// INICIALIZACIÓN
window.onload = async() => {
   await obtenerRol();
  console.log("Rol detectado:", rolUsuario);
  await consultarClientes();
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
