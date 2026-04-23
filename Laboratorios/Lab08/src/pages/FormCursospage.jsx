import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormCurso from "../components/cursos/FormCurso";
import { obtener, obtenerTodos } from "../services/cursosService";

import CursosTabla from "../components/cursos/CursosTabla";
const initialForm = {
  id: "",
  nombre: "",
  creditos: "",
  codigo: "",
};

function FormCursosPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const loadCursos = async (searchText = "") => {
      try {
        setLoading(true);
        const data = await obtenerTodos(searchText);
        setCursos(data);
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadCursos();
    }, []);

  useEffect(() => {
    const loadCursosById = async () => {
      if (!id) return;

      try {
        setLoadingForm(true);
        const curso = await obtener(id);

        setForm({
          id: curso.id || "",
          nombre: curso.nombre || "",
          creditos: curso.creditos || "",
          codigo: curso.codigo || ""
        });
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        setLoadingForm(false);
      }
    };

    loadCursosById();
  }, [id]);

  return (
    <section className="card">
      <h2>{id ? "Editar curso" : "Agregar curso"}</h2>

      {loadingForm ? (
        <p>Cargando curso...</p>
      ) : (
        <FormCurso
         form={form}
        setForm={setForm}
         initialForm={initialForm}
         loadCursos={() => navigate("/cursos")}
         onCancel={() => navigate("/cursos")}
        />
      )}

      {loading ? (
        <p>Cargando Cursos...</p>
      ) : (
        <CursosTabla cursos={cursos} />
      )}
    </section>
  );
}

export default FormCursosPage;