import "../Css/Login.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import "primeicons/primeicons.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Si estás usando Nginx (puerto 80), las peticiones deben ir a la misma dirección sin puerto extra
// Si estás usando Vite directamente (puerto 3000), deben ir al 5000.
const API = window.location.port === "3000"
  ? "http://localhost:5000/api/auth"
  : "/api/auth";

function Login({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const [modo, setModo] = useState("login"); // "login" | "registro"
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirmar: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (modo === "registro") {
      if (form.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      if (form.password !== form.confirmar) {
        setError("Las contraseñas no coinciden.");
        return;
      }
    }

    setCargando(true);
    try {
      const endpoint = modo === "login" ? "/login" : "/register";
      const { data } = await axios.post(`${API}${endpoint}`, {
        email: form.email,
        password: form.password,
      });

      if (data.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        navigate("/inicio");
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error de conexión. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  const cambiarModo = () => {
    setModo(modo === "login" ? "registro" : "login");
    setError("");
    setForm({ email: "", password: "", confirmar: "" });
  };

  return (
    <div className="pagina-login">
      <Button
        icon={theme === "light" ? "pi pi-moon" : "pi pi-sun"}
        className="p-button-rounded p-button-text theme-toggle-floating"
        onClick={toggleTheme}
        style={{ position: 'fixed', top: '20px', right: '20px', color: 'white' }}
      />
      <div className="login">
        <header className="login-header">
          <div className="login-logo">
            <span className="logo-icono">◈</span>
          </div>
          <h1>{modo === "login" ? "Iniciar Sesión" : "Crear Cuenta"}</h1>
          <p>{modo === "login" ? "Bienvenido de vuelta" : "Únete a la plataforma"}</p>
        </header>

        <div className="formulario">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Usuario / Correo electrónico</label>
              <div className="input-wrapper">
                <i className="pi pi-user input-icon" />
                <InputText
                  name="email"
                  type="text"
                  className="input"
                  placeholder="admin o correo@ejemplo.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <div className="password-container input-wrapper">
                <i className="pi pi-lock input-icon" />
                <InputText
                  name="password"
                  type={mostrarContraseña ? "text" : "password"}
                  className="input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={modo === "login" ? "current-password" : "new-password"}
                />
                <i
                  className={`pi ${mostrarContraseña ? "pi-eye-slash" : "pi-eye"} password-icon`}
                  onClick={() => setMostrarContraseña(!mostrarContraseña)}
                />
              </div>
            </div>

            {modo === "registro" && (
              <div className="input-group">
                <label>Confirmar contraseña</label>
                <div className="password-container input-wrapper">
                  <i className="pi pi-lock input-icon" />
                  <InputText
                    name="confirmar"
                    type={mostrarContraseña ? "text" : "password"}
                    className="input"
                    placeholder="••••••••"
                    value={form.confirmar}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            {error && <div className="mensaje-error"><i className="pi pi-exclamation-triangle" /> {error}</div>}

            <Button
              type="submit"
              label={cargando ? "Procesando..." : modo === "login" ? "Iniciar Sesión" : "Registrarse"}
              icon={cargando ? "pi pi-spin pi-spinner" : modo === "login" ? "pi pi-sign-in" : "pi pi-user-plus"}
              iconPos="left"
              className="p-button-outlined boton-iniciarSesion"
              disabled={cargando}
            />
          </form>
        </div>

        <div className="login-footer">
          <p>
            {modo === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            <button className="link-modo" onClick={cambiarModo}>
              {modo === "login" ? " Regístrate" : " Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;