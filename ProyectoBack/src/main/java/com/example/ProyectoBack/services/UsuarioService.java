package com.example.ProyectoBack.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ProyectoBack.model.Anuncio;
import com.example.ProyectoBack.model.Usuario;
import com.example.ProyectoBack.repository.AnuncioRepository;
import com.example.ProyectoBack.repository.UsuarioRepository;

@Service
public class UsuarioService {
	@Autowired
	private UsuarioRepository usuarioRepository;
	
	@Autowired
	private AnuncioRepository anuncioRepository;
	
	
	//obtener todos los usuarios
	public Iterable<Usuario> getAll(){
		return this.usuarioRepository.findAll();
	}

	//Añadir usuario
	public Usuario addUsuario(Usuario usuario) {
		return this.usuarioRepository.save(usuario);
	}
	
    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    //Obtener favoritos
	public List<Anuncio> getFavoritosService(Optional<Usuario> usuarioOptional){
		List<Anuncio> anunciosFav = new ArrayList<>();

		if(usuarioOptional.isPresent()) {
			Usuario usuario = usuarioOptional.get();
			
			List<Anuncio> anuncios = this.anuncioRepository.findAll();
			
			
			anuncios.forEach(anuncio->{
				if(anuncio.getFavoritos().contains(usuario)) {
					anunciosFav.add(anuncio);
				}
						
			});
			
		}
	
		return anunciosFav;
	}
	
	
	//Obtener mis anuncios
	public List<Anuncio> getMisAnunciosService(Optional<Usuario> usuarioOptional){
		List<Anuncio> misAnuncios = new ArrayList<>();
		List<Anuncio> anuncios = this.anuncioRepository.findAll();
		
		
		if(usuarioOptional.isPresent()) {
			Usuario usuario = usuarioOptional.get();

		anuncios.forEach(anuncio->{
			if(usuario == anuncio.getSeller()) {
				misAnuncios.add(anuncio);
				}
			});
		}
		
		return misAnuncios;
	}
	
	public Optional<Usuario> findById(int id){
		return usuarioRepository.findById(id);
		
	}
	
	

	
}
