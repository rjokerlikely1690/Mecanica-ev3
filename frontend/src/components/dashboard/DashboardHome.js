import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './DashboardHome.css';

const DashboardHome = () => {
  const { user, isAdmin } = useAuth();

  const adminCards = [
    {
      title: 'Agenda del Taller',
      description: 'Gestiona todos los turnos y confirmaciones',
      link: '/agenda',
      icon: '📅'
    },
    {
      title: 'Historial de Vehículos',
      description: 'Base de datos de todos los vehículos',
      link: '/vehiculos',
      icon: '🚗'
    },
    {
      title: 'Catálogo de Repuestos',
      description: 'Control de stock e inventario',
      link: '/repuestos',
      icon: '🔩'
    },
    {
      title: 'Tablón Interno',
      description: 'Comunicación con el equipo',
      link: '/mensajes',
      icon: '💬'
    },
    {
      title: 'Gestión de Servicios',
      description: 'Administra servicios y precios',
      link: '/servicios',
      icon: '⚙️'
    }
  ];

  const clienteCards = [
    {
      title: 'Mis Turnos',
      description: 'Agenda y gestiona tus citas en el taller',
      link: '/turnos',
      icon: '📅'
    },
    {
      title: 'Mis Vehículos',
      description: 'Historial y mantenimiento',
      link: '/vehiculos-cliente',
      icon: '🚗'
    },
    {
      title: 'Servicios Disponibles',
      description: 'Consulta los servicios que ofrecemos',
      link: '/servicios-cliente',
      icon: '🔧'
    }
  ];

  const cards = isAdmin() ? adminCards : clienteCards;

  return (
    <div className="dashboard-home">
      <Container>
        <div className="dashboard-home-header">
          <h1>Bienvenido, {user?.nombre}</h1>
          <p className="dashboard-home-subtitle">
            {isAdmin() 
              ? 'Gestiona todo el taller desde aquí' 
              : 'Gestiona tus vehículos y turnos desde aquí'}
          </p>
        </div>

        <Row className="g-4">
          {cards.map((card, index) => (
            <Col key={index} md={6} lg={4}>
              <Card as={Link} to={card.link} className="dashboard-card">
                <Card.Body>
                  <div className="dashboard-card-icon">{card.icon}</div>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Text>{card.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default DashboardHome;

