// importamos el cliente de Supabase para interactuar con la base de datos
// este cliente ya está configurado con la URL y la clave de acceso a nuestra instancia de Supabase
import { supabase } from "./supabase.js";

// obtenemos referencias a los elementos del DOM que vamos a usar

const txtSearch = document.getElementById("txtSearch");
const btnLoad = document.getElementById("btnLoad");
const tbody = document.getElementById("tbodyStudents");

btnLoad.addEventListener("click", async () => consultarEstudiantes());

// funcion de flecha
// const consultarEstudiantes = async () => {};
// funcion tradicional
// function consultarEstudiantes() {}

// let y const
// let x = 10;
// x = 20;
// const y = 30;
// y = 40; // error, no se puede reasignar una constante
// var z = 50;
// var z = 60; // no error, var permite redeclarar la misma variable

const consultarEstudiantes = async () => {
  // usamos el cliente de Supabase para hacer una consulta a la tabla "estudiantes"
  // json: { "data": [], "error": null }
  const search = txtSearch.value.trim() || ""; // si el valor es vacío, asignamos una cadena vacía

  const query = supabase.from("estudiantes").select("id,nombre,apellido,correo,carrera");


  if (search.length > 0) {
    query.or(`nombre.ilike.%${search}%,apellido.ilike.%${search}%`); // filtro de búsqueda, el % es un comodín que representa cualquier cadena de caracteres
  //const { data, error } = await supabase.from("estudiantes").select("id,nombre,apellido,correo,carrera").ilike("nombre", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    alert("Error cargando estudiantes");
    return;
  }

  tbody.innerHTML = "";

  // data es un arreglo de objetos, cada objeto representa un estudiante
  data.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${r.id ?? ""}</td>
        <td>${r.nombre ?? ""}</td>
        <td>${r.apellido ?? ""}</td>
        <td>${r.correo ?? ""}</td>
        <td>${r.carrera ?? ""}</td>
      `;

    tbody.appendChild(tr);
  });
}; 