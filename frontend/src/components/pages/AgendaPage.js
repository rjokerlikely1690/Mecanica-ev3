import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import AgendaTurnos from '../agenda/AgendaTurnos';
import CalendarioAdmin from '../agenda/CalendarioAdmin';
import './PageLayout.css';

const AgendaPage = () => {
  return (
    <div className="page-layout">
      <Container className="page-container">
        <div className="page-header">
          <h1>Agenda del Taller</h1>
          <p className="page-subtitle">Gestiona todos los turnos y confirmaciones</p>
        </div>
        <Row>
          <Col lg={8}>
            <Card className="page-card">
              <Card.Body>
                <CalendarioAdmin />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="page-card">
              <Card.Body>
                <h5 className="mb-3">Lista de Turnos</h5>
                <AgendaTurnos />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AgendaPage;

