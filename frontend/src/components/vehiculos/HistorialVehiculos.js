import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Stack,
  Alert,
} from 'react-bootstrap';
import { vehiculoService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const emptyVehicle = (user) => ({
  patente: '',
  marca: '',
  modelo: '',
  anio: new Date().getFullYear(),
  duenoNombre: user?.nombre || '',
  duenoEmail: user?.email || '',
  notaInicial: '',
});

const emptyHistorial = {
  descripcion: '',
  tecnico: '',
  fecha: '',
};

const HistorialVehiculos = () => {
  const { user, isAdmin } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [error, setError] = useState('');
  const [showVehiculoModal, setShowVehiculoModal] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [formVehiculo, setFormVehiculo] = useState(emptyVehicle(user));
  const [formHistorial, setFormHistorial] = useState(emptyHistorial);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadVehiculos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadVehiculos = async () => {
    try {
      const data = await vehiculoService.getAll(isAdmin() ? undefined : user?.email);
      setVehiculos(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No pudimos cargar los vehículos.');
    }
  };

  const openVehiculoModal = (vehiculo = null) => {
    if (vehiculo) {
      setEditingId(vehiculo.id);
      setFormVehiculo({
        patente: vehiculo.patente,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        anio: vehiculo.anio,
        duenoNombre: vehiculo.duenoNombre,
        duenoEmail: vehiculo.duenoEmail,
        notaInicial: '',
      });
    } else {
      setEditingId(null);
      setFormVehiculo(emptyVehicle(user));
    }
    setShowVehiculoModal(true);
  };

  const openHistorialModal = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setFormHistorial(emptyHistorial);
    setShowHistorialModal(true);
  };

  const handleVehiculoSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formVehiculo,
        duenoNombre: isAdmin() ? formVehiculo.duenoNombre : user?.nombre,
        duenoEmail: isAdmin() ? formVehiculo.duenoEmail : user?.email,
      };
      if (editingId) {
        await vehiculoService.update(editingId, payload);
      } else {
        await vehiculoService.create(payload);
      }
      setShowVehiculoModal(false);
      loadVehiculos();
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar el vehículo.');
    }
  };

  const handleHistorialSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formHistorial,
        fecha: formHistorial.fecha || undefined,
      };
      await vehiculoService.addHistorial(selectedVehiculo.id, payload);
      setShowHistorialModal(false);
      loadVehiculos();
    } catch (err) {
      console.error(err);
      setError('No se pudo agregar el registro al historial.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este vehículo?')) return;
    try {
      await vehiculoService.remove(id);
      loadVehiculos();
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el vehículo.');
    }
  };

  const renderHistorial = (historial = []) => {
    if (!historial.length) {
      return <span className="text-muted">Sin registros</span>;
    }
    return (
      <Stack gap={2}>
        {historial.map((item) => (
          <div key={item.id} className="border rounded p-2">
            <div className="fw-semibold">{item.descripcion}</div>
            <small className="text-muted d-block">
              {item.fecha ? new Date(item.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
            </small>
            {item.tecnico && (
              <small className="text-muted">Responsable: {item.tecnico}</small>
            )}
          </div>
        ))}
      </Stack>
    );
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <Card.Title className="mb-0">Historial de vehículos</Card.Title>
            <small className="text-muted">
              Registra datos por cliente y agrega notas rápidas.
            </small>
          </div>
          <Button onClick={() => openVehiculoModal()} variant="primary">
            + Vehículo
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Table responsive hover>
          <thead>
            <tr>
              <th>Patente</th>
              <th>Modelo</th>
              <th>Dueño</th>
              <th>Historial</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((vehiculo) => (
              <tr key={vehiculo.id}>
                <td>
                  <Badge bg="dark">{vehiculo.patente}</Badge>
                  <div className="small text-muted">{vehiculo.anio}</div>
                </td>
                <td>
                  <div className="fw-semibold">{vehiculo.marca}</div>
                  <div className="text-muted">{vehiculo.modelo}</div>
                </td>
                <td>
                  <div className="fw-semibold">{vehiculo.duenoNombre}</div>
                  <div className="text-muted">{vehiculo.duenoEmail}</div>
                </td>
                <td>{renderHistorial(vehiculo.historial)}</td>
                <td style={{ minWidth: 160 }}>
                  <Button
                    size="sm"
                    variant="outline-success"
                    className="me-2 mb-2"
                    onClick={() => openHistorialModal(vehiculo)}
                  >
                    + Nota
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    className="me-2 mb-2"
                    onClick={() => openVehiculoModal(vehiculo)}
                  >
                    Editar
                  </Button>
                  {isAdmin() && (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(vehiculo.id)}
                    >
                      Eliminar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {vehiculos.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No hay vehículos registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>

      <Modal show={showVehiculoModal} onHide={() => setShowVehiculoModal(false)}>
        <Form onSubmit={handleVehiculoSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? 'Editar vehículo' : 'Nuevo vehículo'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Patente</Form.Label>
              <Form.Control
                value={formVehiculo.patente}
                onChange={(e) => setFormVehiculo({ ...formVehiculo, patente: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                value={formVehiculo.marca}
                onChange={(e) => setFormVehiculo({ ...formVehiculo, marca: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Modelo</Form.Label>
              <Form.Control
                value={formVehiculo.modelo}
                onChange={(e) => setFormVehiculo({ ...formVehiculo, modelo: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Año</Form.Label>
              <Form.Control
                type="number"
                min="1960"
                max={new Date().getFullYear() + 1}
                value={formVehiculo.anio}
                onChange={(e) =>
                  setFormVehiculo({ ...formVehiculo, anio: Number(e.target.value) })
                }
                required
              />
            </Form.Group>
            {isAdmin() && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Dueño</Form.Label>
                  <Form.Control
                    value={formVehiculo.duenoNombre}
                    onChange={(e) =>
                      setFormVehiculo({ ...formVehiculo, duenoNombre: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Correo dueño</Form.Label>
                  <Form.Control
                    type="email"
                    value={formVehiculo.duenoEmail}
                    onChange={(e) =>
                      setFormVehiculo({ ...formVehiculo, duenoEmail: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </>
            )}
            {!editingId && (
              <Form.Group>
                <Form.Label>Nota inicial (opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={formVehiculo.notaInicial}
                  onChange={(e) =>
                    setFormVehiculo({ ...formVehiculo, notaInicial: e.target.value })
                  }
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowVehiculoModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showHistorialModal} onHide={() => setShowHistorialModal(false)}>
        <Form onSubmit={handleHistorialSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Agregar nota al historial</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-muted mb-2">
              Vehículo: <strong>{selectedVehiculo?.patente}</strong>
            </p>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formHistorial.descripcion}
                onChange={(e) =>
                  setFormHistorial({ ...formHistorial, descripcion: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Técnico / responsable</Form.Label>
              <Form.Control
                value={formHistorial.tecnico}
                onChange={(e) =>
                  setFormHistorial({ ...formHistorial, tecnico: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={formHistorial.fecha}
                onChange={(e) =>
                  setFormHistorial({ ...formHistorial, fecha: e.target.value })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowHistorialModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );
};

export default HistorialVehiculos;

