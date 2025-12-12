import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { servicioService } from '../../services/apiService';
import './Landing.css';

const Landing = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServicios();
  }, []);

  const loadServicios = async () => {
    try {
      const data = await servicioService.getAll();
      setServicios(data.slice(0, 6)); // Mostrar solo los primeros 6
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <section className="landing-hero">
        <Container>
          <div className="hero-content">
            <div className="hero-badge">Gestión integral para talleres automotrices</div>
            <h1 className="hero-title">AutoMax</h1>
            <p className="hero-description">
              Controla turnos, vehículos, repuestos y comunicación interna desde un solo lugar.
              La solución completa para modernizar tu taller.
            </p>
            <div className="hero-cta">
              <Button as={Link} to="/login" className="btn-primary-custom" size="lg">
                Iniciar sesión
              </Button>
              <Button as={Link} to="/register" className="btn-outline-custom" size="lg">
                Crear cuenta
              </Button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-icon">🔧</div>
          </div>
        </Container>
      </section>

      {/* Servicios Destacados */}
      <section className="landing-section servicios-section">
        <Container>
          <div className="section-header">
            <h2>Nuestros Servicios</h2>
            <p className="section-subtitle">
              Conoce los servicios que ofrecemos en nuestro taller
            </p>
          </div>
          {loading ? (
            <div className="loading-services">Cargando servicios...</div>
          ) : servicios.length > 0 ? (
            <Row className="g-4">
              {servicios.map((servicio) => (
                <Col md={6} lg={4} key={servicio.id}>
                  <Card className="servicio-card">
                    <Card.Body>
                      <div className="servicio-icon">⚙️</div>
                      <Card.Title>{servicio.nombre}</Card.Title>
                      <Card.Text className="servicio-descripcion">
                        {servicio.descripcion || 'Servicio profesional de calidad'}
                      </Card.Text>
                      <div className="servicio-precio">
                        {formatPrice(servicio.precio)}
                      </div>
                      {servicio.duracionEstimada && (
                        <Badge bg="secondary" className="servicio-badge">
                          {servicio.duracionEstimada}
                        </Badge>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="no-services">
              <p>Próximamente agregaremos nuestros servicios</p>
            </div>
          )}
          <div className="text-center mt-4">
            <Button as={Link} to="/register" variant="outline-dark" size="lg">
              Ver todos los servicios
            </Button>
          </div>
        </Container>
      </section>

      {/* Funcionalidades */}
      <section className="landing-section features-section">
        <Container>
          <div className="section-header">
            <h2>Módulos Incluidos</h2>
            <p className="section-subtitle">
              Cada módulo está conectado a MongoDB Atlas, por lo que todos los datos se
              sincronizan automáticamente.
            </p>
          </div>
          <Row className="g-4">
            {[
              {
                icon: '📅',
                title: 'Agenda Inteligente',
                desc: 'Bloquea horarios, confirma turnos y evita solapes. Gestión completa de citas.',
                color: '#8B4513'
              },
              {
                icon: '🚗',
                title: 'Vehículos y Notas',
                desc: 'Historial por patente y seguimiento de tareas realizadas. Base de datos completa.',
                color: '#1a1a1a'
              },
              {
                icon: '🔩',
                title: 'Repuestos y Stock',
                desc: 'Control de stock mínimo, proveedores y precios actualizados en tiempo real.',
                color: '#8B4513'
              },
              {
                icon: '💬',
                title: 'Mensajería Interna',
                desc: 'Comparte avisos y recordatorios con el equipo en segundos. Comunicación eficiente.',
                color: '#1a1a1a'
              }
            ].map((feature, index) => (
              <Col md={6} key={index}>
                <Card className="feature-card">
                  <Card.Body>
                    <div className="feature-icon" style={{ color: feature.color }}>
                      {feature.icon}
                    </div>
                    <Card.Title>{feature.title}</Card.Title>
                    <Card.Text>{feature.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Para Administradores y Clientes */}
      <section className="landing-section users-section">
        <Container>
          <Row className="g-4">
            <Col md={6}>
              <Card className="user-card admin-card">
                <Card.Body>
                  <h3 className="user-title">Administradores</h3>
                  <p className="user-text">
                    Acceden a la agenda completa, controlan repuestos, publican avisos y pueden
                    gestionar todos los servicios del taller en tiempo real.
                  </p>
                  <ul className="user-list">
                    <li>Agenda diaria con confirmación de turnos</li>
                    <li>Catálogo de repuestos con alertas de stock</li>
                    <li>Mensajería interna para coordinar al equipo</li>
                    <li>Panel de servicios y precios</li>
                    <li>Gestión completa de vehículos</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="user-card cliente-card">
                <Card.Body>
                  <h3 className="user-title">Clientes</h3>
                  <p className="user-text">
                    Pueden registrar sus vehículos, solicitar turnos y seguir el estado de sus
                    servicios desde el mismo panel.
                  </p>
                  <ul className="user-list">
                    <li>Historial de vehículos y trabajos realizados</li>
                    <li>Solicitud de turnos en línea</li>
                    <li>Comunicación clara con el taller</li>
                    <li>Resumen de servicios contratados</li>
                    <li>Acceso rápido a información</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Final */}
      <section className="landing-cta-section">
        <Container>
          <div className="cta-content">
            <h2>¿Listo para modernizar tu taller?</h2>
            <p>Únete a AutoMax y comienza a gestionar todo de forma profesional</p>
            <div className="cta-buttons">
              <Button as={Link} to="/register" className="btn-primary-custom" size="lg">
                Crear cuenta gratis
              </Button>
              <Button as={Link} to="/login" className="btn-outline-light-custom" size="lg">
                Ya tengo cuenta
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Landing;
