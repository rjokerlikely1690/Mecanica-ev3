package cl.duocuc.tallermecanico.repository;

import cl.duocuc.tallermecanico.model.Turno;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurnoRepository extends MongoRepository<Turno, String> {
    List<Turno> findByClienteEmailIgnoreCase(String email, Sort sort);
}

