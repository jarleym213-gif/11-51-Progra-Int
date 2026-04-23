import { guardar } from "../../services/CursosService";
import Input from "../shared/Input";

function FormCurso({ form, setForm, loadCursos, initialForm, onCancel }) {
  /*
      ------------------------------------------------------------
      Manejar cambios del formulario
      ------------------------------------------------------------
      Esta función sirve para todos los inputs.
      Toma el name del control y actualiza esa propiedad.
    */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
      ------------------------------------------------------------
      Guardar curso
      ------------------------------------------------------------
      Si el formulario tiene id, actualiza.
      Si no tiene id, crea un nuevo registro.

      La decisión la toma saveCurso() en el service.
    */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!form.nombre.trim() || !form.creditos || !form.codigo.trim()) {
        alert("Debe completar nombre, créditos y código");
        return;
      }

      await guardar(form);
      setForm(initialForm);
      await loadCursos();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  /*
      ------------------------------------------------------------
      Limpiar formulario
      ------------------------------------------------------------
      Restablece el formulario a su estado inicial.
    */
  const handleCancel = () => {
    setForm(initialForm);
     onCancel();
  };
  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
        <Input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />

        <Input type="text" name="creditos" placeholder="Créditos" value={form.creditos} onChange={handleChange} />

        <Input type="text" name="codigo" placeholder="Código" value={form.codigo} onChange={handleChange} />

      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button  className="btn-actualizar btn-agregar" type="submit">
          {form.id ? "Actualizar" : "Agregar"}
        </button>
        <button className="btn-cancelar" type="button" onClick={handleCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
export default FormCurso;