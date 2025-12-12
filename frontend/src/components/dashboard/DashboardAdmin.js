import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import AgendaTurnos from '../agenda/AgendaTurnos';
import HistorialVehiculos from '../vehiculos/HistorialVehiculos';
import CatalogoRepuestos from '../repuestos/CatalogoRepuestos';
import TablonMensajes from '../mensajes/TablonMensajes';
import GestionServicios from '../servicios/GestionServicios';
import './DashboardAdmin.css';

const DashboardAdmin = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-admin">
      <div className="dashboard-admin-header">
        <Container>
          <Row>
            <Col>
              <div className="welcome-section">
                <h1>Panel de Administración</h1>
                <p className="welcome-subtitle">Bienvenido, {user?.nombre} - Gestiona todo el taller desde aquí</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="dashboard-admin-content">
        <Row className="mb-4">
          <Col lg={8}>
            <Card id="section-agenda" className="section-card">
              <Card.Header className="section-header admin-header">
                <h3>Agenda del Taller</h3>
                <p className="section-subtitle">Gestiona todos los turnos y confirmaciones</p>
              </Card.Header>
              <Card.Body>
                <AgendaTurnos />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card id="section-mensajes" className="section-card">
              <Card.Header className="section-header admin-header">
                <h3>Tablón Interno</h3>
                <p className="section-subtitle">Comunicación con el equipo</p>
              </Card.Header>
              <Card.Body>
                <TablonMensajes />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Card id="section-servicios" className="section-card">
              <Card.Header className="section-header admin-header">
                <h3>Gestión de Servicios</h3>
                <p className="section-subtitle">Administra servicios y precios</p>
              </Card.Header>
              <Card.Body>
                <GestionServicios />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={6}>
            <Card id="section-vehiculos" className="section-card">
              <Card.Header className="section-header admin-header">
                <h3>Historial de Vehículos</h3>
                <p className="section-subtitle">Base de datos de todos los vehículos</p>
              </Card.Header>
              <Card.Body>
                <HistorialVehiculos />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card id="section-repuestos" className="section-card">
              <Card.Header className="section-header admin-header">
                <h3>Catálogo de Repuestos</h3>
                <p className="section-subtitle">Control de stock e inventario</p>
              </Card.Header>
              <Card.Body>
                <CatalogoRepuestos />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardAdmin;

