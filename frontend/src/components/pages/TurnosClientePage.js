import React from 'react';
import { Container, Card } from 'react-bootstrap';
import AgendaTurnos from '../agenda/AgendaTurnos';
import './PageLayout.css';

const TurnosClientePage = () => {
  return (
    <div className="page-layout">
      <Container className="page-container">
        <div className="page-header">
          <h1>Mis Turnos</h1>
          <p className="page-subtitle">Agenda y gestiona tus citas en el taller</p>
        </div>
        <Card className="page-card">
          <Card.Body>
            <AgendaTurnos />
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default TurnosClientePage;

