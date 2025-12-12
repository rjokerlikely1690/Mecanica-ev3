import React from 'react';
import { Container, Card } from 'react-bootstrap';
import ListaServicios from '../servicios/ListaServicios';
import './PageLayout.css';

const ServiciosClientePage = () => {
  return (
    <div className="page-layout">
      <Container className="page-container">
        <div className="page-header">
          <h1>Servicios Disponibles</h1>
          <p className="page-subtitle">Consulta los servicios que ofrecemos</p>
        </div>
        <Card className="page-card">
          <Card.Body>
            <ListaServicios />
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ServiciosClientePage;

