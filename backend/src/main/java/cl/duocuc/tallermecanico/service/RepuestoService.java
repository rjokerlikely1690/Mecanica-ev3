package cl.duocuc.tallermecanico.service;

import cl.duocuc.tallermecanico.dto.RepuestoRequest;
import cl.duocuc.tallermecanico.model.Repuesto;
import cl.duocuc.tallermecanico.repository.RepuestoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepuestoService {

    private final RepuestoRepository repuestoRepository;

    public RepuestoService(RepuestoRepository repuestoRepository) {
        this.repuestoRepository = repuestoRepository;
    }

    public List<Repuesto> listar() {
        return repuestoRepository.findAll(Sort.by(Sort.Direction.ASC, "nombre"));
    }

    public Repuesto crear(RepuestoRequest request) {
        Repuesto repuesto = new Repuesto();
        aplicarDatos(repuesto, request);
        return repuestoRepository.save(repuesto);
    }

    @SuppressWarnings("null")
    public Repuesto actualizar(String id, RepuestoRequest request) {
        Repuesto repuesto = repuestoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Repuesto no encontrado"));
        aplicarDatos(repuesto, request);
        return repuestoRepository.save(repuesto);
    }

    @SuppressWarnings("null")
    public void eliminar(String id) {
        repuestoRepository.deleteById(id);
    }

    private void aplicarDatos(Repuesto repuesto, RepuestoRequest request) {
        repuesto.setNombre(request.getNombre());
        repuesto.setDescripcion(request.getDescripcion());
        repuesto.setPrecio(request.getPrecio());
        repuesto.setStockActual(request.getStockActual());
        repuesto.setStockMinimo(request.getStockMinimo());
        repuesto.setProveedor(request.getProveedor());
    }
}

