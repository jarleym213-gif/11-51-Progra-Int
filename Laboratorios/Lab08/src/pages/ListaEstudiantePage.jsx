import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerEstudiantes, eliminarEstudiante } from "../services/estudianteService";
import BuscarEstudiante from "../components/estudiante/buscarEstudiante";
import EstudianteTabla from "../components/estudiante/EstudianteTabla";

function ListaEstudiantesPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loadStudents = async (searchText = "") => {
    try {
      setLoading(true); // Indicar que se está cargando
      const data = await obtenerEstudiantes(searchText);
      setStudents(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false); // Indicar que ya no se está cargando
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

//handleSearch: Ejecuta la búsqueda utilizando el texto ingresado en el campo de búsqueda
  const handleSearch = async () => {
    await loadStudents(search);
  };

  //handleClearSearch: Limpia el campo de búsqueda y recarga la lista completa de estudiantes
  const handleClearSearch = async () => {
    setSearch("");
    await loadStudents("");
  };

  const handleDelete = async (id) => {
    const ok = confirm("¿Desea eliminar este estudiante?");
    if (!ok) return;

    try {
      await eliminarEstudiante(id);
      await loadStudents(search);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleEdit = (student) => {
    navigate(`/editar/${student.id}`);
  };

  return (
    <section className="card">
      <h2>Consulta de estudiantes</h2>

      <BuscarEstudiante
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        handleClearSearch={handleClearSearch}
      />

      {loading ? (
        <p>Cargando estudiantes...</p>
      ) : (
        <EstudianteTabla
          students={students}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </section>
  );
}

export default ListaEstudiantesPage;