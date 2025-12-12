import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { servicioService } from '../../services/apiService';

const ListaServicios = () => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadServicios();
  }, []);

  const loadServicios = async () => {
    try {
      setLoading(true);
      const data = await servicioService.getAll();
      setServicios(data);
      setError('');
    } catch (err) {
      setError('Error al cargar los servicios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Servicios Disponibles</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {servicios.length === 0 ? (
        <Alert variant="info">No hay servicios disponibles</Alert>
      ) : (
        <Row>
          {servicios.map((servicio) => (
            <Col key={servicio.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 servicio-card">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{servicio.nombre}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1">
                    {servicio.descripcion || 'Sin descripción'}
                  </Card.Text>
                  <Card.Text className="h5 text-primary mb-3">
                    {formatPrice(servicio.precio)}
                  </Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate(`/reservar/${servicio.id}`)}
                    className="w-100"
                  >
                    Reservar ahora
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ListaServicios;


