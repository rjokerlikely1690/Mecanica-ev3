import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { agendaService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const todayStr = new Date().toISOString().split('T')[0];

const initialForm = (user) => ({
  fecha: todayStr,
  hora: '',
  servicioSolicitado: '',
  notas: '',
  clienteNombre: user?.nombre || '',
  clienteEmail: user?.email || '',
  confirmado: false,
});

const AgendaTurnos = () => {
  const { user, isAdmin } = useAuth();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm(user));

  useEffect(() => {
    loadTurnos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTurnos = async () => {
    try {
      setLoading(true);
      const data = await agendaService.getAll(isAdmin() ? undefined : user?.email);
      setTurnos(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No pudimos cargar los turnos agendados.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(initialForm(user));
    setFieldErrors({});
  };

  const handleOpenModal = (turno = null) => {
    if (turno) {
      setEditingId(turno.id);
      setFormData({
        fecha: turno.fecha,
        hora: turno.hora,
        servicioSolicitado: turno.servicioSolicitado,
        notas: turno.notas || '',
        clienteNombre: turno.clienteNombre,
        clienteEmail: turno.clienteEmail,
        confirmado: turno.confirmado,
      });
    } else {
      setEditingId(null);
      setFormData(initialForm(user));
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        clienteNombre: isAdmin() ? formData.clienteNombre : user?.nombre,
        clienteEmail: isAdmin() ? formData.clienteEmail : user?.email,
        confirmado: isAdmin() ? formData.confirmado : false,
      };

      if (editingId) {
        await agendaService.update(editingId, payload);
      } else {
        await agendaService.create(payload);
      }

      // success
      setFieldErrors({});
      setError('');
      handleCloseModal();
      loadTurnos();
    } catch (err) {
      console.error(err);
      // Try to surface server validation messages
      const resp = err?.response?.data;
      if (resp && typeof resp === 'object') {
        // If it's a map of field -> message, join them
        const messages = Object.values(resp).join('. ');
        setFieldErrors(resp);
        setError(messages || 'No se pudo guardar el turno.');
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('No se pudo guardar el turno.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este turno?')) {
      return;
    }
    try {
      await agendaService.remove(id);
      loadTurnos();
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el turno.');
    }
  };

  const formatFecha = (fechaIso) => {
    if (!fechaIso) return '-';
    return new Date(fechaIso).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card className="mb-4">
        <Card.Body className="text-center">
          <Spinner animation="border" />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <Card.Title className="mb-0">Agenda de turnos</Card.Title>
            <small className="text-muted">
              Planifica las visitas al taller y confirma horarios.
            </small>
          </div>
          <Button onClick={() => handleOpenModal()} variant="primary">
            + Agendar turno
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Table hover responsive>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Notas</th>
              <th>Estado</th>
              {isAdmin() && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno.id}>
                <td>{formatFecha(turno.fecha)}</td>
                <td>{turno.hora}</td>
                <td>
                  <div className="fw-semibold">{turno.clienteNombre}</div>
                  <small className="text-muted">{turno.clienteEmail}</small>
                </td>
                <td>{turno.servicioSolicitado}</td>
                <td>{turno.notas || '-'}</td>
                <td>
                  <Badge bg={turno.confirmado ? 'success' : 'warning'}>
                    {turno.confirmado ? 'Confirmado' : 'Pendiente'}
                  </Badge>
                </td>
                {isAdmin() && (
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => handleOpenModal(turno)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(turno.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            {turnos.length === 0 && (
              <tr>
                <td colSpan={isAdmin() ? 7 : 6} className="text-center text-muted">
                  Aún no hay turnos agendados.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Editar turno' : 'Nuevo turno'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={formData.fecha}
                min={todayStr}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
                isInvalid={!!fieldErrors.fecha}
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrors.fecha}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora</Form.Label>
              <Form.Control
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                required
                isInvalid={!!fieldErrors.hora}
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrors.hora}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Servicio solicitado</Form.Label>
              <Form.Control
                type="text"
                value={formData.servicioSolicitado}
                onChange={(e) =>
                  setFormData({ ...formData, servicioSolicitado: e.target.value })
                }
                required
                isInvalid={!!fieldErrors.servicioSolicitado}
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrors.servicioSolicitado}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notas</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              />
            </Form.Group>
            {isAdmin() && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Cliente</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.clienteNombre}
                    onChange={(e) =>
                      setFormData({ ...formData, clienteNombre: e.target.value })
                    }
                    required
                    isInvalid={!!fieldErrors.clienteNombre}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.clienteNombre}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Correo cliente</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.clienteEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, clienteEmail: e.target.value })
                    }
                    required
                        isInvalid={!!fieldErrors.clienteEmail}
                  />
                      <Form.Control.Feedback type="invalid">
                        {fieldErrors.clienteEmail}
                      </Form.Control.Feedback>
                </Form.Group>
                <Form.Check
                  className="mb-3"
                  type="switch"
                  label="Marcar como confirmado"
                  checked={formData.confirmado}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmado: e.target.checked })
                  }
                />
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );
};

export default AgendaTurnos;

