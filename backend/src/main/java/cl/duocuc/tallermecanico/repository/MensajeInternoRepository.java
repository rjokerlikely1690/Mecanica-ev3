package cl.duocuc.tallermecanico.repository;

import cl.duocuc.tallermecanico.model.MensajeInterno;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeInternoRepository extends MongoRepository<MensajeInterno, String> {
    List<MensajeInterno> findAll(Sort sort);
}

