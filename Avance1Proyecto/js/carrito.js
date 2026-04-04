import { supabase } from "./supabase.js";

// REFERENCIAS DOM
const tbody = document.getElementById("tbodyCarrito");
const totalText = document.getElementById("total");
const btnFinalizar = document.getElementById("btnFinalizar");
const selectCliente = document.getElementById("selectCliente");

// VARIABLE GLOBAL
let clienteAutoId = null;
let rolUsuario = "";

// ================================
// OBTENER CLIENTE AUTOMÁTICO
// ================================
const obtenerClienteAutomatico = async (email) => {

  const { data, error } = await supabase
    .from("clientes")
    .select("id,nombre")
    .eq("correo", email)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};

// ================================
// CARGAR CLIENTES (ADMIN/VENDEDOR)
// ================================
const cargarClientes = async () => {

  const { data, error } = await supabase
    .from("clientes")
    .select("id,nombre");

  if (error) {
    console.error(error);
    Swal.fire("Error cargando clientes");
    return;
  }

  selectCliente.innerHTML = `<option value="">Seleccione cliente</option>`;

  data.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.nombre;
    selectCliente.appendChild(option);
  });

};

// ================================
// CARGAR CARRITO
// ================================
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
      <td>
        <button class="btn btn-danger btn-sm btnEliminar"
          data-id="${p.id}">
          Eliminar
        </button>
      </td>
    `;

    tbody.appendChild(tr);

  });

  totalText.innerText = "₡" + total;
};

// ================================
// ELIMINAR PRODUCTO
// ================================
const eliminarProducto = async (id) => {

  const { error } = await supabase
    .from("carrito")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    Swal.fire("Error eliminando");
  } else {
    cargarCarrito();
  }

};

// ================================
// FINALIZAR COMPRA
// ================================
const finalizarCompra = async () => {

  // usuario logueado
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    Swal.fire("Debe iniciar sesión");
    window.location.href = "login.html";
    return;
  }

  const usuarioId = userData.user.id;
  const email = userData.user.email;

  // 🔥 determinar cliente
  let clienteId;

  if (email === "comprador@email.com") {
    clienteId = clienteAutoId;
  } else {
    clienteId = selectCliente.value;
  }

  if (!clienteId) {
    Swal.fire("Seleccione un cliente");
    return;
  }

  // carrito
  const { data: carrito, error } = await supabase
    .from("carrito")
    .select("*");

  if (error || carrito.length === 0) {
    Swal.fire("Carrito vacío");
    return;
  }

  let total = 0;
  carrito.forEach(p => total += p.precio * p.cantidad);

  // CREAR VENTA
  const { data: venta, error: errorVenta } = await supabase
    .from("ventas")
    .insert([{
      usuario_id: usuarioId,
      cliente_id: clienteId,
      total: total
    }])
    .select()
    .single();

  if (errorVenta) {
    console.error(errorVenta);
    Swal.fire("Error creando venta");
    return;
  }

  const ventaId = venta.id;

  // DETALLE + STOCK
  for (const p of carrito) {

    await supabase.from("detalle_venta").insert([{
      venta_id: ventaId,
      producto_id: p.producto_id,
      cantidad: p.cantidad,
      precio: p.precio
    }]);

    const { data: producto } = await supabase
      .from("productos")
      .select("stock")
      .eq("id", p.producto_id)
      .single();

    const nuevoStock = producto.stock - p.cantidad;

    await supabase
      .from("productos")
      .update({ stock: nuevoStock })
      .eq("id", p.producto_id);
  }

  // limpiar carrito
  await supabase.from("carrito").delete().neq("id", 0);

  // ================================
  // FACTURA VISUAL
  // ================================
  let detalle = "";
  let totalFinal = 0;

  carrito.forEach(p => {
    const subtotal = p.precio * p.cantidad;
    totalFinal += subtotal;

    detalle += `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.cantidad}</td>
        <td>₡${p.precio}</td>
        <td>₡${subtotal}</td>
      </tr>
    `;
  });

  Swal.fire({
    title: "Resumen de la Venta",
    html: `
      <table style="width:100%">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cant</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>${detalle}</tbody>
      </table>
      <hr>
      <h3>Total: ₡${totalFinal}</h3>
    `,
    width: 600
  });

  cargarCarrito();
};

// ================================
// EVENTOS
// ================================
tbody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btnEliminar")) {
    const id = e.target.getAttribute("data-id");
    await eliminarProducto(id);
  }
});

if (btnFinalizar) {
  btnFinalizar.addEventListener("click", finalizarCompra);
}

// ================================
// INICIO
// ================================
window.onload = async () => {

  await cargarCarrito();

  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user.email;
  
  // COMPRADOR AUTOMÁTICO
  if (email.includes("comprador")) {

    selectCliente.style.display = "none";

    const cliente = await obtenerClienteAutomatico(email);

    if (cliente) {
      clienteAutoId = cliente.id;
      console.log("Cliente automático:", cliente);
      const menuClientes = document.getElementById("menuClientes");
    const menuEmpleados = document.getElementById("menuEmpleados");

    if (menuClientes) menuClientes.style.display = "none";
    if (menuEmpleados) menuEmpleados.style.display = "none";
    } else {
      Swal.fire("Cliente no encontrado en BD");
    }

  } else {
    // ADMIN / VENDEDOR
    await cargarClientes();
  }
};