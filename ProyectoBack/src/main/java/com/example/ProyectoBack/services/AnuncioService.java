package com.example.ProyectoBack.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ProyectoBack.model.Anuncio;
import com.example.ProyectoBack.model.Usuario;
import com.example.ProyectoBack.repository.AnuncioRepository;

import jakarta.transaction.Transactional;

@Service
public class AnuncioService {
	
	@Autowired
	private AnuncioRepository anuncioRepository;
 
	@Autowired
	private UsuarioService usuarioService;
	
	public Anuncio addAnuncio(Anuncio anuncio) {
		return this.anuncioRepository.save(anuncio);
	}
	
	public void deleteAnuncioService(int id) {
		this.anuncioRepository.deleteById(id);
	}
	
	public List<Anuncio> getAnuncios() {
		return this.anuncioRepository.findAll();
	}
	
	public Optional<Anuncio> getAnuncioService(int id) {
		return this.anuncioRepository.findById(id);
	}
	
	
	public Anuncio updateFavourites(int anuncioId, String usuarioEmail) {
		
		Optional<Anuncio> anuncioOp= getAnuncioService(anuncioId);
		Usuario usuario = usuarioService.findByEmail(usuarioEmail);
		
		if(anuncioOp.isPresent()) {
			Anuncio anuncio = anuncioOp.get();		
			
			if(usuario.getAnunciosFavoritos().contains(anuncio)) {
				usuario.getAnunciosFavoritos().remove(anuncio);
				anuncio.getFavoritos().remove(usuario);
			}else {
				usuario.getAnunciosFavoritos().add(anuncio);
				anuncio.getFavoritos().add(usuario);
			}
			
			return anuncioRepository.save(anuncio);

			
		}
	    throw new RuntimeException("Anuncio o usuario no encontrado");

	}
	
	}
