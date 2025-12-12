package cl.duocuc.tallermecanico.repository;

import cl.duocuc.tallermecanico.model.Orden;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface OrdenRepository extends MongoRepository<Orden, String> {
    List<Orden> findByClienteEmailIgnoreCase(String clienteEmail, Sort sort);
    List<Orden> findByEstadoPago(String estadoPago, Sort sort);
}

