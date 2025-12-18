import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { usuarioService } from '../../services/apiService';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'CLIENTE',
    activo: true
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAll();
      setUsuarios(data);
      setError('');
    } catch (err) {
      setError('Error al cargar usuarios: ' + (err.response?.data?.mensaje || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingUsuario(usuario);
      setFormData({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        password: '',
        rol: usuario.rol || 'CLIENTE',
        activo: usuario.activo !== undefined ? usuario.activo : true
      });
    } else {
      setEditingUsuario(null);
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'CLIENTE',
        activo: true
      });
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUsuario(null);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      rol: 'CLIENTE',
      activo: true
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingUsuario) {
        // Actualizar
        await usuarioService.update(editingUsuario.id, {
          nombre: formData.nombre,
          email: formData.email,
          rol: formData.rol,
          activo: formData.activo
        });
        setSuccess('Usuario actualizado correctamente');
      } else {
        // Crear
        if (!formData.password) {
          setError('La contraseña es obligatoria para nuevos usuarios');
          return;
        }
        await usuarioService.create({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          rol: formData.rol
        });
        setSuccess('Usuario creado correctamente');
      }
      
      setTimeout(() => {
        handleCloseModal();
        cargarUsuarios();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar usuario');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) {
      return;
    }

    try {
      await usuarioService.remove(id);
      setSuccess('Usuario eliminado correctamente');
      cargarUsuarios();
    } catch (err) {
      setError('Error al eliminar usuario: ' + (err.response?.data?.mensaje || err.message));
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.password) {
      setError('La contraseña es obligatoria');
      return;
    }

    try {
      await usuarioService.cambiarPassword(editingUsuario.id, formData.password);
      setSuccess('Contraseña actualizada correctamente');
      setTimeout(() => {
        setShowPasswordModal(false);
        setFormData({ ...formData, password: '' });
      }, 1000);
    } catch (err) {
      setError('Error al cambiar contraseña: ' + (err.response?.data?.mensaje || err.message));
    }
  };

  if (loading) {
    return <div className="text-center p-4">Cargando usuarios...</div>;
  }

  return (
    <div>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Gestión de Usuarios</h5>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          + Nuevo Usuario
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No hay usuarios registrados</td>
            </tr>
          ) : (
            usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>
                  <Badge bg={usuario.rol === 'ADMIN' ? 'danger' : 'primary'}>
                    {usuario.rol}
                  </Badge>
                </td>
                <td>
                  <Badge bg={usuario.activo ? 'success' : 'secondary'}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleOpenModal(usuario)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setEditingUsuario(usuario);
                      setFormData({ ...formData, password: '' });
                      setShowPasswordModal(true);
                    }}
                  >
                    Cambiar Pass
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleEliminar(usuario.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal para crear/editar */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>
            {!editingUsuario && (
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUsuario}
                  minLength={6}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
              >
                <option value="CLIENTE">Cliente</option>
                <option value="ADMIN">Administrador</option>
              </Form.Select>
            </Form.Group>
            {editingUsuario && (
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Usuario activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingUsuario ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCambiarPassword}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Cambiar Contraseña
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default GestionUsuarios;

