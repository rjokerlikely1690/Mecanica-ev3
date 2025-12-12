import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Alert,
} from 'react-bootstrap';
import { repuestoService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const emptyRepuesto = {
  nombre: '',
  descripcion: '',
  precio: '',
  stockActual: 0,
  stockMinimo: 0,
  proveedor: '',
};

const CatalogoRepuestos = () => {
  const { isAdmin } = useAuth();
  const [repuestos, setRepuestos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyRepuesto);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRepuestos();
  }, []);

  const loadRepuestos = async () => {
    try {
      const data = await repuestoService.getAll();
      setRepuestos(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No logramos cargar el catálogo de repuestos.');
    }
  };

  const openModal = (repuesto = null) => {
    if (repuesto) {
      setEditingId(repuesto.id);
      setFormData({
        nombre: repuesto.nombre,
        descripcion: repuesto.descripcion || '',
        precio: repuesto.precio,
        stockActual: repuesto.stockActual,
        stockMinimo: repuesto.stockMinimo,
        proveedor: repuesto.proveedor,
      });
    } else {
      setEditingId(null);
      setFormData(emptyRepuesto);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        precio: Number(formData.precio),
        stockActual: Number(formData.stockActual),
        stockMinimo: Number(formData.stockMinimo),
      };
      if (editingId) {
        await repuestoService.update(editingId, payload);
      } else {
        await repuestoService.create(payload);
      }
      setShowModal(false);
      loadRepuestos();
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar el repuesto.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este repuesto?')) return;
    try {
      await repuestoService.remove(id);
      loadRepuestos();
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el repuesto.');
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(
      Number(value || 0)
    );

  const stockStatus = (item) => {
    if (item.stockActual <= item.stockMinimo) {
      return <Badge bg="danger">Bajo</Badge>;
    }
    if (item.stockActual <= item.stockMinimo + 5) {
      return <Badge bg="warning">Atención</Badge>;
    }
    return <Badge bg="success">OK</Badge>;
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <Card.Title className="mb-0">Catálogo de repuestos</Card.Title>
            <small className="text-muted">Control rápido de stock y proveedores.</small>
          </div>
          {isAdmin() && (
            <Button variant="primary" onClick={() => openModal()}>
              + Repuesto
            </Button>
          )}
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Table responsive hover>
          <thead>
            <tr>
              <th>Repuesto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Proveedor</th>
              {isAdmin() && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {repuestos.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="fw-semibold">{item.nombre}</div>
                  <small className="text-muted">{item.descripcion || '-'}</small>
                </td>
                <td>{formatCurrency(item.precio)}</td>
                <td>
                  {item.stockActual} uds.
                  <div className="mt-1">{stockStatus(item)}</div>
                  <small className="text-muted">
                    Min: {item.stockMinimo} uds.
                  </small>
                </td>
                <td>{item.proveedor}</td>
                {isAdmin() && (
                  <td>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="me-2"
                      onClick={() => openModal(item)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            {repuestos.length === 0 && (
              <tr>
                <td colSpan={isAdmin() ? 5 : 4} className="text-center text-muted">
                  No hay repuestos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? 'Editar repuesto' : 'Nuevo repuesto'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio (CLP)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="1"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock actual</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={formData.stockActual}
                onChange={(e) => setFormData({ ...formData, stockActual: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock mínimo</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={formData.stockMinimo}
                onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Proveedor</Form.Label>
              <Form.Control
                value={formData.proveedor}
                onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
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

export default CatalogoRepuestos;

