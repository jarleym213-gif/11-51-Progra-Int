
function BuscarEstudiante({ search, setSearch, handleSearch, handleClearSearch }) {
  return (
    <>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input type="text" placeholder="Buscar por nombre o apellido" value={search} onChange={(e) => setSearch(e.target.value)} />

        <button  id= "btn-buscar" onClick={handleSearch}>Buscar</button>
        <button id= "btn-limpiar" onClick={handleClearSearch}>Limpiar</button>
      </div>
    </>
  );
}

export default BuscarEstudiante;