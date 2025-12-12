import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Form,
  Badge,
  ListGroup,
  Alert,
  ButtonGroup,
} from 'react-bootstrap';
import { mensajeService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const emptyMessage = (user) => ({
  autor: user?.nombre || '',
  rolAutor: user?.rol || '',
  contenido: '',
  categoria: 'General',
});

const categorias = ['General', 'Operaciones', 'Compras', 'Entrega'];

const TablonMensajes = () => {
  const { user, isAdmin } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [formData, setFormData] = useState(emptyMessage(user));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMensajes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMensajes = async () => {
    try {
      const data = await mensajeService.getAll();
      setMensajes(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No pudimos cargar el tablón de mensajes.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await mensajeService.create({
        ...formData,
        autor: user?.nombre || formData.autor,
        rolAutor: user?.rol || formData.rolAutor,
      });
      setFormData({ ...emptyMessage(user), contenido: '' });
      loadMensajes();
    } catch (err) {
      console.error(err);
      setError('No fue posible publicar el mensaje.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este mensaje?')) return;
    try {
      await mensajeService.remove(id);
      loadMensajes();
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el mensaje.');
    }
  };

  const toggleDestacado = async (mensaje) => {
    try {
      await mensajeService.toggleDestacado(mensaje.id, !mensaje.destacado);
      loadMensajes();
    } catch (err) {
      console.error(err);
      setError('No se pudo actualizar el estado del mensaje.');
    }
  };

  const formatFecha = (fechaIso) =>
    new Date(fechaIso).toLocaleString('es-CL', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Tablón interno</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">
          Comparte recordatorios rápidos con el equipo.
        </Card.Subtitle>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Escribe un mensaje o actualización"
              value={formData.contenido}
              onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
              required
            />
          </Form.Group>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <Form.Select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              style={{ maxWidth: 200 }}
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
            <Button type="submit" disabled={loading}>
              Publicar
            </Button>
          </div>
        </Form>

        <ListGroup variant="flush">
          {mensajes.map((mensaje) => (
            <ListGroup.Item key={mensaje.id} className="px-0">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <strong>{mensaje.autor}</strong>
                    <Badge bg="secondary" pill>
                      {mensaje.categoria || 'General'}
                    </Badge>
                    {mensaje.destacado && <Badge bg="warning">Destacado</Badge>}
                  </div>
                  <p className="mb-1 mt-2">{mensaje.contenido}</p>
                  <small className="text-muted">
                    {formatFecha(mensaje.creadoEn)} · {mensaje.rolAutor}
                  </small>
                </div>
                {isAdmin() && (
                  <ButtonGroup size="sm">
                    <Button
                      variant={mensaje.destacado ? 'warning' : 'outline-warning'}
                      onClick={() => toggleDestacado(mensaje)}
                    >
                      {mensaje.destacado ? 'Quitar pin' : 'Destacar'}
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDelete(mensaje.id)}
                    >
                      Eliminar
                    </Button>
                  </ButtonGroup>
                )}
              </div>
            </ListGroup.Item>
          ))}
          {mensajes.length === 0 && (
            <ListGroup.Item className="text-muted">Aún no hay mensajes.</ListGroup.Item>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default TablonMensajes;

