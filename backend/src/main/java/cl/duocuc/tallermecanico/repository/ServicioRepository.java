package cl.duocuc.tallermecanico.repository;

import cl.duocuc.tallermecanico.model.Servicio;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicioRepository extends MongoRepository<Servicio, String> {
    List<Servicio> findByActivoTrue();
}
