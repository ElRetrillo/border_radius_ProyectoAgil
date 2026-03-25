import "../Css/Login.css";
import LogoGoogle from "../assets/LogoGoogle.png";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { useState } from "react";
import "primeicons/primeicons.css";


function Login() {
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  return(
    <div className="pagina-login">
      <div className="login">
        <header className="login-header">
          <h1>Iniciar Sesión</h1>
          <p>Ingresa tus datos para continuar</p>
        </header>

        <div className="formulario">
          <form>
            <InputText className="input" placeholder="RUT" />
            <div className="password-container">
              <InputText
                type={mostrarContraseña ? "text" : "password"}
                className="input"
                placeholder="Contraseña"
              />
              <i 
                className={`pi ${mostrarContraseña ? "pi-eye-slash" : "pi-eye"} password-icon`}
                onClick={() => setMostrarContraseña(!mostrarContraseña)}
              ></i>
              
            </div>
            <Button label="Iniciar Sesión" className="p-button-outlined boton-iniciarSesion" aria-label="Iniciar Sesión" />
          </form>
        </div>

        <Divider className="divider"></Divider>

        <Button className="p-button-outlined boton-google" aria-label="Google">
          <img alt="logo" src={LogoGoogle} className="google-icon" />
          <span className="google-text">Continuar con Google</span>
        </Button>
        
      </div>
    </div>

  )
} 

export default Login;