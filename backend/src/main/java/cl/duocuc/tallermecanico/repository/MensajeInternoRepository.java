package cl.duocuc.tallermecanico.repository;

import cl.duocuc.tallermecanico.model.MensajeInterno;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeInternoRepository extends MongoRepository<MensajeInterno, String> {
    @Override
    @NonNull
    List<MensajeInterno> findAll(@NonNull Sort sort);
}

