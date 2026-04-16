import { supabase } from "./supabase.js";

// REFERENCIAS DOM
const tbody = document.getElementById("tbodyCarrito");
const totalText = document.getElementById("total");
const btnFinalizar = document.getElementById("btnFinalizar");
const selectCliente = document.getElementById("selectCliente");
const labelCliente = document.getElementById("clienteSeleccionado");

// VARIABLES GLOBALES
let clienteAutoId = null;
let rolUsuario = "";

// OBTENER USUARIO LOGUEADO
const obtenerUsuario = async () => {
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    window.location.href = "login.html";
    return null;
  }

  return data.user;
};

// OBTENER CLIENTE AUTOMÁTICO
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

// CARGAR CLIENTES (ADMIN/VENDEDOR)
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

// CARGAR CARRITO
const cargarCarrito = async () => {
  const user = await obtenerUsuario();
  if (!user) return;

  const { data, error } = await supabase
    .from("carrito")
    .select("*")
    .eq("usuario_id", user.id);

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
        <button class="btn btn-danger btn-sm btnEliminar" data-id="${p.id}">
          Eliminar
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  totalText.innerText = "₡" + total;
};

// ELIMINAR
const eliminarProducto = async (id) => {
  const { error } = await supabase
    .from("carrito")
    .delete()
    .eq("id", id);

  if (error) {
    Swal.fire("Error eliminando");
  } else {
    cargarCarrito();
  }
};

// FINALIZAR COMPRA
const finalizarCompra = async () => {
  const user = await obtenerUsuario();
  if (!user) return;

  const usuarioId = user.id;

  let clienteId;

  if (rolUsuario  === "comprador") {
    clienteId = clienteAutoId;
  } else {
    clienteId = selectCliente.value;
  }

  if (!clienteId) {
    Swal.fire("Seleccione un cliente");
    return;
  }

  const { data: carrito } = await supabase
    .from("carrito")
    .select("*")
    .eq("usuario_id", usuarioId);

  if (!carrito || carrito.length === 0) {
    Swal.fire("Carrito vacío");
    return;
  }

  let total = 0;
  carrito.forEach(p => total += p.precio * p.cantidad);

  const { data: venta } = await supabase
    .from("ventas")
    .insert([{
      usuario_id: usuarioId,
      cliente_id: clienteId,
      total: total
    }])
    .select()
    .single();

  const ventaId = venta.id;

  for (const p of carrito) {
    await supabase.from("detalle_venta").insert([{
      venta_id: ventaId,
      producto_id: p.producto_id,
      cantidad: p.cantidad,
      precio: p.precio
    }]);

    const { data: prod } = await supabase
      .from("productos")
      .select("stock")
      .eq("id", p.producto_id)
      .single();

    await supabase
      .from("productos")
      .update({ stock: prod.stock - p.cantidad })
      .eq("id", p.producto_id);
  }

  await supabase
    .from("carrito")
    .delete()
    .eq("usuario_id", usuarioId);

  //  OBTENER NOMBRE CLIENTE
  const { data: clienteData } = await supabase
    .from("clientes")
    .select("nombre")
    .eq("id", clienteId)
    .single();

  const nombreCliente = clienteData?.nombre || "Cliente";

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
      <h4>Cliente: ${nombreCliente}</h4>
      <hr>
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

// EVENTOS
tbody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btnEliminar")) {
    await eliminarProducto(e.target.dataset.id);
  }
});

btnFinalizar?.addEventListener("click", finalizarCompra);

// INICIO
window.onload = async () => {
  const user = await obtenerUsuario();
  if (!user) return;

  // OBTENER ROL REAL DESDE BD (NO localStorage)
  const { data } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("correo", user.email)
    .single();

  rolUsuario = data?.rol?.trim().toLowerCase();

  await cargarCarrito();

  if (rolUsuario === "comprador") {
    // ocultar select
    selectCliente.style.display = "none";

    // obtener cliente automáticamente
    const cliente = await obtenerClienteAutomatico(user.email);

    if (cliente) {
      clienteAutoId = cliente.id;

      // mostrar nombre
      if (labelCliente) {
        labelCliente.innerHTML = `Cliente: <strong>${cliente.nombre}</strong>`;
      }
    }

  } else {
    // admin o vendedor
    selectCliente.style.display = "block";
    await cargarClientes();
  }
};