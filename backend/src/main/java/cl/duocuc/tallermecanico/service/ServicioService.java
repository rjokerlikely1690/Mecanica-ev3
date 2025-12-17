package cl.duocuc.tallermecanico.service;

import cl.duocuc.tallermecanico.dto.ServicioRequest;
import cl.duocuc.tallermecanico.model.Servicio;
import cl.duocuc.tallermecanico.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ServicioService {
    
    @Autowired
    private ServicioRepository servicioRepository;
    
    public List<Servicio> getAllServicios() {
        return servicioRepository.findAll();
    }
    
    public List<Servicio> getServiciosActivos() {
        return servicioRepository.findByActivoTrue();
    }
    
    @SuppressWarnings("null")
    public Optional<Servicio> getServicioById(String id) {
        return servicioRepository.findById(id);
    }
    
    public Servicio createServicio(ServicioRequest request) {
        Servicio servicio = new Servicio();
        servicio.setNombre(request.getNombre());
        servicio.setDescripcion(request.getDescripcion());
        servicio.setPrecio(request.getPrecio());
        servicio.setActivo(true);
        return servicioRepository.save(servicio);
    }
    
    @SuppressWarnings("null")
    public Servicio updateServicio(String id, ServicioRequest request) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con id: " + id));
        
        servicio.setNombre(request.getNombre());
        servicio.setDescripcion(request.getDescripcion());
        servicio.setPrecio(request.getPrecio());
        
        return servicioRepository.save(servicio);
    }
    
    @SuppressWarnings("null")
    public void deleteServicio(String id) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con id: " + id));
        servicio.setActivo(false);
        servicioRepository.save(servicio);
    }
}

