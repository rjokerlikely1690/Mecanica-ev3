package cl.duocuc.tallermecanico.service;

import cl.duocuc.tallermecanico.dto.MensajeRequest;
import cl.duocuc.tallermecanico.model.MensajeInterno;
import cl.duocuc.tallermecanico.repository.MensajeInternoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MensajeService {

    private final MensajeInternoRepository mensajeInternoRepository;

    public MensajeService(MensajeInternoRepository mensajeInternoRepository) {
        this.mensajeInternoRepository = mensajeInternoRepository;
    }

    public List<MensajeInterno> listar() {
        Sort sort = Sort.by(Sort.Direction.DESC, "destacado")
                .and(Sort.by(Sort.Direction.DESC, "creadoEn"));
        return mensajeInternoRepository.findAll(sort);
    }

    public MensajeInterno crear(MensajeRequest request) {
        MensajeInterno mensaje = new MensajeInterno(
                request.getAutor(),
                request.getRolAutor(),
                request.getContenido(),
                request.getCategoria()
        );
        mensaje.setDestacado(Boolean.TRUE.equals(request.getDestacado()));
        return mensajeInternoRepository.save(mensaje);
    }

    @SuppressWarnings("null")
    public MensajeInterno actualizarDestacado(String id, boolean destacado) {
        MensajeInterno mensaje = mensajeInternoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mensaje no encontrado"));
        mensaje.setDestacado(destacado);
        return mensajeInternoRepository.save(mensaje);
    }

    @SuppressWarnings("null")
    public void eliminar(String id) {
        mensajeInternoRepository.deleteById(id);
    }
}

