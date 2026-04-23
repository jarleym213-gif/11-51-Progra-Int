import { NavLink, Route, Routes } from "react-router-dom";
import EstudiantePage from "../src/pages/EstudiantePage";
import ListaEstudiantesPage from "../src/pages/ListaEstudiantePage";
import ListaCursosPage from "./pages/ListaCursosPage";
import FormCursosPage from "./pages/FormCursospage";

function App() {
  return (
    <div className="container">
      <header className="header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div>II-51 Programación Internet</div>
            <h1 className="header-title">Laboratorio 08 - Arquitectura en React</h1>
            <p className="header-subtitle">
              Router + Context + Componentes + Supabase
            </p>
          </div>

          <div className="badge">Laboratorio Final</div>
        </div>
      </header>

      <nav
        className="card"
        style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
      >
        <NavLink to="/estudiantes" className="btn btn-primary btn-lg active">
          Lista de estudiantes
        </NavLink>

        <NavLink to="/estudiante/nuevo" className="btn btn-primary">
          Nuevo estudiante
        </NavLink>

        <NavLink to="/cursos" className="btn btn-primary">
          Lista de cursos
        </NavLink>
        <NavLink to="/cursos/nuevo" className="btn btn-primary">
          Nuevo curso
        </NavLink>
      </nav>

      <Routes>
        <Route path="/estudiantes" element={<ListaEstudiantesPage />} />
        <Route path="/estudiante/nuevo" element={<EstudiantePage />} />
        <Route path="/estudiante/editar/:id" element={<EstudiantePage />} />
        <Route path="/cursos" element={<ListaCursosPage />} />
        <Route path="/cursos/nuevo" element={<FormCursosPage />} />
        <Route path="/cursos/editar/:id" element={<FormCursosPage />} />
      </Routes>

      

      <footer className="footer">
        Universidad Central • II-51 Programación Internet
      </footer>
    </div>
  );
}

export default App;