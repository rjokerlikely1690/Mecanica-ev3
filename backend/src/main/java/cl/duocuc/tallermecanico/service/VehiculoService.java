package cl.duocuc.tallermecanico.service;

import cl.duocuc.tallermecanico.dto.HistorialEntradaRequest;
import cl.duocuc.tallermecanico.dto.VehiculoRequest;
import cl.duocuc.tallermecanico.model.Vehiculo;
import cl.duocuc.tallermecanico.repository.VehiculoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class VehiculoService {

    private final VehiculoRepository vehiculoRepository;

    public VehiculoService(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    public List<Vehiculo> listar(String email) {
        if (email != null && !email.isBlank()) {
            return vehiculoRepository.findByDuenoEmailIgnoreCase(email);
        }
        return vehiculoRepository.findAll();
    }

    public Vehiculo crear(VehiculoRequest request) {
        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setPatente(request.getPatente());
        vehiculo.setMarca(request.getMarca());
        vehiculo.setModelo(request.getModelo());
        vehiculo.setAnio(request.getAnio());
        vehiculo.setDuenoNombre(request.getDuenoNombre());
        vehiculo.setDuenoEmail(request.getDuenoEmail());

        if (request.getNotaInicial() != null && !request.getNotaInicial().isBlank()) {
            Vehiculo.HistorialEntrada entrada = new Vehiculo.HistorialEntrada();
            entrada.setDescripcion(request.getNotaInicial());
            entrada.setFecha(LocalDate.now());
            vehiculo.agregarHistorial(entrada);
        }

        return vehiculoRepository.save(vehiculo);
    }

    public Optional<Vehiculo> obtenerPorId(String id) {
        return vehiculoRepository.findById(id);
    }

    public Vehiculo actualizar(String id, VehiculoRequest request) {
        Vehiculo vehiculo = vehiculoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehículo no encontrado"));

        vehiculo.setPatente(request.getPatente());
        vehiculo.setMarca(request.getMarca());
        vehiculo.setModelo(request.getModelo());
        vehiculo.setAnio(request.getAnio());
        vehiculo.setDuenoNombre(request.getDuenoNombre());
        vehiculo.setDuenoEmail(request.getDuenoEmail());

        return vehiculoRepository.save(vehiculo);
    }

    public Vehiculo agregarHistorial(String id, HistorialEntradaRequest request) {
        Vehiculo vehiculo = vehiculoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehículo no encontrado"));

        Vehiculo.HistorialEntrada entrada = new Vehiculo.HistorialEntrada();
        entrada.setDescripcion(request.getDescripcion());
        if (request.getFecha() != null) {
            entrada.setFecha(request.getFecha());
        }
        entrada.setTecnico(request.getTecnico());

        vehiculo.agregarHistorial(entrada);

        return vehiculoRepository.save(vehiculo);
    }

    public void eliminar(String id) {
        vehiculoRepository.deleteById(id);
    }
}

