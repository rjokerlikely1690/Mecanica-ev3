import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (nombre, email, password) => {
    const response = await api.post('/auth/register', { nombre, email, password });
    return response.data;
  },
};

export const servicioService = {
  getAll: async () => {
    const response = await api.get('/servicios');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/servicios/${id}`);
    return response.data;
  },
  
  create: async (servicio) => {
    const response = await api.post('/servicios', servicio);
    return response.data;
  },
  
  update: async (id, servicio) => {
    const response = await api.put(`/servicios/${id}`, servicio);
    return response.data;
  },
  
  delete: async (id) => {
    await api.delete(`/servicios/${id}`);
  },
};

export const agendaService = {
  getAll: async (clienteEmail) => {
    const response = await api.get('/agenda', {
      params: clienteEmail ? { clienteEmail } : {},
    });
    return response.data;
  },
  create: async (turno) => {
    const response = await api.post('/agenda', turno);
    return response.data;
  },
  update: async (id, turno) => {
    const response = await api.put(`/agenda/${id}`, turno);
    return response.data;
  },
  remove: async (id) => {
    await api.delete(`/agenda/${id}`);
  },
};

export const vehiculoService = {
  getAll: async (duenoEmail) => {
    const response = await api.get('/vehiculos', {
      params: duenoEmail ? { duenoEmail } : {},
    });
    return response.data;
  },
  create: async (vehiculo) => {
    const response = await api.post('/vehiculos', vehiculo);
    return response.data;
  },
  update: async (id, vehiculo) => {
    const response = await api.put(`/vehiculos/${id}`, vehiculo);
    return response.data;
  },
  addHistorial: async (id, entrada) => {
    const response = await api.post(`/vehiculos/${id}/historial`, entrada);
    return response.data;
  },
  remove: async (id) => {
    await api.delete(`/vehiculos/${id}`);
  },
};

export const repuestoService = {
  getAll: async () => {
    const response = await api.get('/repuestos');
    return response.data;
  },
  create: async (repuesto) => {
    const response = await api.post('/repuestos', repuesto);
    return response.data;
  },
  update: async (id, repuesto) => {
    const response = await api.put(`/repuestos/${id}`, repuesto);
    return response.data;
  },
  remove: async (id) => {
    await api.delete(`/repuestos/${id}`);
  },
};

export const mensajeService = {
  getAll: async () => {
    const response = await api.get('/mensajes');
    return response.data;
  },
  create: async (mensaje) => {
    const response = await api.post('/mensajes', mensaje);
    return response.data;
  },
  toggleDestacado: async (id, destacado) => {
    const response = await api.put(`/mensajes/${id}/destacado`, null, {
      params: { destacado },
    });
    return response.data;
  },
  remove: async (id) => {
    await api.delete(`/mensajes/${id}`);
  },
};

export const ordenService = {
  getAll: async (clienteEmail) => {
    const response = await api.get('/ordenes', {
      params: clienteEmail ? { clienteEmail } : {},
    });
    return response.data;
  },
  create: async (orden) => {
    const response = await api.post('/ordenes', orden);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/ordenes/${id}`);
    return response.data;
  },
  remove: async (id) => {
    await api.delete(`/ordenes/${id}`);
  },
};

export const usuarioService = {
  getAll: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },
  create: async (usuario) => {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  },
  update: async (id, usuario) => {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  },
  cambiarPassword: async (id, password) => {
    const response = await api.put(`/usuarios/${id}/password`, { password });
    return response.data;
  },
  remove: async (id) => {
    await api.delete(`/usuarios/${id}`);
  },
};

export default api;


