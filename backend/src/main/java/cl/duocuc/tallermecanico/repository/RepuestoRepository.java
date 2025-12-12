package cl.duocuc.tallermecanico.repository;

import cl.duocuc.tallermecanico.model.Repuesto;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepuestoRepository extends MongoRepository<Repuesto, String> {
    List<Repuesto> findAll(Sort sort);
}

