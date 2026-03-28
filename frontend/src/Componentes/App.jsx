import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Inicio from "./Inicio";

// Importar estilos globales de PrimeReact
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "../Css/Variables.css";

function App() {
    // Estado para el tema
    const [theme, setTheme] = React.useState(localStorage.getItem("theme") || "light");

    // Función para alternar tema
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    // Aplicar tema al body
    React.useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    // Estado para controlar la autenticación y forzar re-renderizado
    const [token, setToken] = React.useState(localStorage.getItem("token"));

    // Función para verificar auth (puedes pasarla a Login si quieres,
    // pero por ahora el cambio de URL disparará el render de Routes)
    const isAuth = !!token;

    // Escuchar cambios en localStorage (opcional, pero útil si se abre en varias pestañas)
    React.useEffect(() => {
        const handleStorage = () => setToken(localStorage.getItem("token"));
        window.addEventListener("storage", handleStorage);
        // También podemos usar un intervalo corto o simplemente confiar en el flujo de navegación
        const interval = setInterval(handleStorage, 500); 
        return () => {
            window.removeEventListener("storage", handleStorage);
            clearInterval(interval);
        };
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={!isAuth ? <Login theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/inicio" />} />
                <Route path="/inicio" element={isAuth ? <Inicio theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;