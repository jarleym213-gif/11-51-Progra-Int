import { supabase } from "./supabase.js";

// REFERENCIAS DOM
const tbody = document.getElementById("tbodyCarrito");
const totalText = document.getElementById("total");
const btnFinalizar = document.getElementById("btnFinalizar");

// Funciones

// CARGAR CARRITO
const cargarCarrito = async () => {

  const { data, error } = await supabase
    .from("carrito")
    .select("*");

  if (error) {
    console.error(error);
    Swal.fire("Error cargando carrito");
    return;
  }

  tbody.innerHTML = "";
  let total = 0;

  data.forEach((p) => {

    const subtotal = p.precio * p.cantidad;
    total += subtotal;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.producto_id}</td>
      <td>${p.nombre}</td>
      <td>₡${p.precio}</td>
      <td>${p.cantidad}</td>
      <td>₡${subtotal}</td>
    `;

    tbody.appendChild(tr);

  });

  totalText.innerText = "₡" + total;

};

// FINALIZAR COMPRA
const finalizarCompra = async () => {

  const { data, error } = await supabase
    .from("carrito")
    .select("*");

  if (error) {
    console.error(error);
    Swal.fire("Error al procesar compra");
    return;
  }

  for (const p of data) {

    const { data: producto, error: errorProducto } = await supabase
      .from("productos")
      .select("stock")
      .eq("id", p.producto_id)
      .single();

    if (errorProducto) {
      console.error(errorProducto);
      continue;
    }

    const nuevoStock = producto.stock - p.cantidad;

    if (nuevoStock < 0) {
      Swal.fire(`Stock insuficiente: ${p.nombre}`);
      continue;
    }

    const { error: errorUpdate } = await supabase
      .from("productos")
      .update({ stock: nuevoStock })
      .eq("id", p.producto_id);

    if (errorUpdate) {
      console.error(errorUpdate);
    }

  }

  const { error: errorDelete } = await supabase
    .from("carrito")
    .delete()
    .neq("id", 0);

  if (errorDelete) {
    console.error(errorDelete);
    Swal.fire("Error limpiando carrito");
    return;
  }

  Swal.fire("Compra realizada correctamente");

  cargarCarrito();

};

// EVENTOS
if (btnFinalizar) {
  btnFinalizar.addEventListener("click", finalizarCompra);
}

// INICIALIZACIÓN
window.onload = () => {
  cargarCarrito();
};