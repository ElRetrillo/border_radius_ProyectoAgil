import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import "../Css/Inicio.css";

function Inicio({ theme, toggleTheme }) {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem("usuario");
        if (!userStr) {
            navigate("/");
        } else {
            setUsuario(JSON.parse(userStr));
        }
    }, [navigate]);

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/");
    };

    const anuncios = [
        {
            id: 1,
            titulo: "Mantenimiento Programado",
            contenido: "Estaremos realizando mejoras en nuestros servidores este domingo a las 02:00 AM.",
            fecha: "Hace 2 horas",
            categoria: "SISTEMA",
            color: "blue"
        },
        {
            id: 2,
            titulo: "Nueva Funcionalidad: Dashboard",
            contenido: "¡Ya puedes visualizar tus estadísticas de registro directamente en el nuevo dashboard!",
            fecha: "Ayer",
            categoria: "ACTUALIZACIÓN",
            color: "green"
        }
    ];

    const ofertas = [
        {
            id: 1,
            titulo: "Ofertas de practicas profesionales",
            descripcion: "Mira aqui todas las ofertas de practicas profesionales disponibles para ti, estas ofertas cumplen con los requisitos solicitados por la universidad.",
            imagen: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2670&auto=format&fit=crop"
        },
        {
            id: 2,
            titulo: "Busqueda de proyectos",
            descripcion: "Quieres poner en practica tus conocimientos? Postula a proyectos para ganar experiencia y conocimientos.",
            imagen: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2670&auto=format&fit=crop"
        }
    ];

    if (!usuario) return null;

    return (
        <div className="inicio-container">
            <nav className="navbar">
                <div className="nav-brand">
                    <span className="logo-icono">◈</span>
                    <span>Inicio</span>
                </div>
                <div className="nav-user">
                    <span className="user-email">{usuario.email}</span>
                    <Button
                        icon={theme === "light" ? "pi pi-moon" : "pi pi-sun"}
                        className="p-button-rounded p-button-text p-button-secondary theme-toggle"
                        onClick={toggleTheme}
                        tooltip={theme === "light" ? "Modo Oscuro" : "Modo Claro"}
                        tooltipOptions={{ position: 'bottom' }}
                        style={{ color: 'var(--navbar-secondary)' }}
                    />
                    <Button
                        icon="pi pi-sign-out"
                        className="p-button-rounded p-button-text p-button-danger p-button-logout"
                        onClick={cerrarSesion}
                        tooltip="Cerrar Sesión"
                        tooltipOptions={{ position: 'bottom' }}
                    />
                </div>
            </nav>

            <main className="content">
                <header className="hero">
                    <h1>¡Bienvenido de vuelta, {usuario.email}! 👋</h1>
                    <p>Bienvenido a tu plataforma. Aquí tienes las últimas novedades.</p>
                </header>

                <section className="section-container">
                    <div className="section-header">
                        <i className="pi pi-megaphone section-icon" />
                        <h2>Anuncios Recientes</h2>
                    </div>
                    <div className="grid-anuncios">
                        {anuncios.map(anuncio => (
                            <Card key={anuncio.id} className="anuncio-card">
                                <div className="anuncio-badge">
                                    <Tag value={anuncio.categoria} severity={anuncio.color === "blue" ? "info" : "success"} />
                                    <span className="anuncio-fecha">{anuncio.fecha}</span>
                                </div>
                                <h3>{anuncio.titulo}</h3>
                                <p>{anuncio.contenido}</p>
                                <Button label="Leer más" className="p-button-text p-button-sm" />
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="section-container">
                    <div className="section-header">
                        <i className="pi pi-briefcase section-icon" />
                        <h2>Encuentra tu proximo desafio</h2>
                    </div>
                    <div className="grid-ofertas">
                        {ofertas.map(oferta => (
                            <div key={oferta.id} className="oferta-card">
                                <div className="oferta-image" style={{ backgroundImage: `url(${oferta.imagen})` }}>
                                    <div className="oferta-overlay">
                                        <span className="badge-promo">OFERTA</span>
                                    </div>
                                </div>
                                <div className="oferta-content">
                                    <h3>{oferta.titulo}</h3>
                                    <p>{oferta.descripcion}</p>
                                    <div className="oferta-precios">
                                        <span className="precio-antiguo">{oferta.precioAnterior}</span>
                                        <span className="precio-nuevo">{oferta.precioNuevo}</span>
                                    </div>
                                    <Button label="Ingresar" className="p-button-primary p-button-sm w-full mt-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="inicio-footer">
                <p>© 2026 Border Radius Proyecto Ágil. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}

export default Inicio;
