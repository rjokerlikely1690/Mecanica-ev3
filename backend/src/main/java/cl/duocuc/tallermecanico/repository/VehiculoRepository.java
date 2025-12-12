package cl.duocuc.tallermecanico.repository;

import cl.duocuc.tallermecanico.model.Vehiculo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehiculoRepository extends MongoRepository<Vehiculo, String> {
    List<Vehiculo> findByDuenoEmailIgnoreCase(String email);
}

