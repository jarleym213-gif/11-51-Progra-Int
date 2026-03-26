import { supabase } from "./supabase.js";

//Referencias DOM
const tbody = document.getElementById("tbodyProductos");
const btnLoad = document.getElementById("btnLoad");
const btnAdd = document.getElementById("btnAdd");

const txtId = document.getElementById("txtId");
const txtNombre = document.getElementById("txtNombre");
const txtMarca = document.getElementById("txtMarca");
const txtPrecio = document.getElementById("txtPrecio");
const txtStock = document.getElementById("txtStock");

// Funciones

// CONSULTAR
const consultarProductos = async () => {

  const { data, error } = await supabase
    .from("productos")
    .select("id,nombre,marca,precio,stock")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    Swal.fire("Error cargando productos");
    return;
  }

  tbody.innerHTML = "";

  data.forEach((p) => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.marca}</td>
      <td>₡${p.precio}</td>
      <td>${p.stock}</td>
      <td>
        <button class="btnEditar btn btn-warning btn-sm" data-id="${p.id}">
          Editar
        </button>
        <button class="btnEliminar btn btn-danger btn-sm" data-id="${p.id}">
          Eliminar
        </button>
        <button class="btnCarrito btn btn-primary btn-sm"
          data-id="${p.id}"
          data-nombre="${p.nombre}"
          data-precio="${p.precio}">
          Carrito
        </button>
      </td>
    `;

    tbody.appendChild(tr);

  });

};

// GUARDAR
const guardarProducto = async () => {

  const producto = {
    nombre: txtNombre.value.trim(),
    marca: txtMarca.value.trim(),
    precio: txtPrecio.value.trim(),
    stock: txtStock.value.trim()
  };

  if (!producto.nombre || !producto.marca || !producto.precio || !producto.stock) {
    Swal.fire("Complete todos los campos");
    return;
  }

  let error;

  if (txtId.value) {

    const response = await supabase
      .from("productos")
      .update(producto)
      .eq("id", txtId.value);

    error = response.error;

  } else {

    const response = await supabase
      .from("productos")
      .insert([producto]);

    error = response.error;

  }

  if (error) {
    console.error(error);
    Swal.fire("Error guardando producto");
    return;
  }

  Swal.fire("Producto guardado correctamente");

  limpiarFormulario();
  consultarProductos();

};

// ELIMINAR
const eliminarProducto = async (id) => {

  if (!confirm("¿Eliminar producto?")) return;

  const { error } = await supabase
    .from("productos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    Swal.fire("Error eliminando producto");
  } else {
    consultarProductos();
  }

};

// AGREGAR AL CARRITO
const agregarCarrito = async (id, nombre, precio) => {

  const { error } = await supabase
    .from("carrito")
    .insert([{
      producto_id: id,
      nombre: nombre,
      precio: precio,
      cantidad: 1
    }]);

  if (error) {
    console.error(error);
    Swal.fire("Error agregando al carrito");
  } else {
    Swal.fire("Producto agregado al carrito");
  }

};

// LIMPIAR
const limpiarFormulario = () => {
  txtId.value = "";
  txtNombre.value = "";
  txtMarca.value = "";
  txtPrecio.value = "";
  txtStock.value = "";
};

// EVENTOS

if (btnLoad) btnLoad.addEventListener("click", consultarProductos);
if (btnAdd) btnAdd.addEventListener("click", guardarProducto);

// DELEGACIÓN
tbody.addEventListener("click", async (event) => {

  const target = event.target;

  if (target.classList.contains("btnEliminar")) {
    const id = target.getAttribute("data-id");
    await eliminarProducto(id);
  }

  if (target.classList.contains("btnEditar")) {

    const id = target.getAttribute("data-id");

    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      Swal.fire("Error cargando producto");
      return;
    }

    txtId.value = data.id;
    txtNombre.value = data.nombre;
    txtMarca.value = data.marca;
    txtPrecio.value = data.precio;
    txtStock.value = data.stock;
  }

  if (target.classList.contains("btnCarrito")) {

    const id = target.getAttribute("data-id");
    const nombre = target.getAttribute("data-nombre");
    const precio = target.getAttribute("data-precio");

    await agregarCarrito(id, nombre, precio);
  }

});

// INICIALIZACIÓN
window.onload = () => {
  consultarProductos();
};