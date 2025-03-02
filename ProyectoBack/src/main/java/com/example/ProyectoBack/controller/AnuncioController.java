package com.example.ProyectoBack.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.example.ProyectoBack.model.Anuncio;
import com.example.ProyectoBack.model.AnuncioFotos;
import com.example.ProyectoBack.model.Usuario;
import com.example.ProyectoBack.services.AnuncioService;
import com.example.ProyectoBack.services.UsuarioService;

@RequestMapping("/anuncio")
@RestController
public class AnuncioController {
	
	@Autowired
	private AnuncioService anuncioService;
	
	@Autowired
	private UsuarioService usuarioService;
	
	@Autowired
	private ObjectMapper objectMapper;
		
	
	@PostMapping(value= "/publicarAnuncio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Anuncio addAnuncio(@RequestParam (value="photo",required=false) MultipartFile[] multipartFile, 
			@RequestPart("anuncio") String anuncioStr) throws IOException{

	    Anuncio anuncio = objectMapper.readValue(
	    	    new String(anuncioStr.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8), Anuncio.class);
	    	    
	    if (multipartFile != null && multipartFile.length>0) {
            List<AnuncioFotos> photos = new ArrayList<>();
            int index = 0;
            for (MultipartFile file : multipartFile) {
                if (!file.isEmpty()) {
                	AnuncioFotos anuncioFoto = new AnuncioFotos();
                	anuncioFoto.setPhoto(file.getBytes());
                	anuncioFoto.setAnuncio(anuncio);
                	anuncioFoto.setPhotoIndex(index++);
                	
                    photos.add(anuncioFoto);
                }
            }

	    	anuncio.setPhoto(photos);
	    }
	  
		return this.anuncioService.addAnuncio(anuncio);
	}
	
	
	@GetMapping("/getAnuncios")
	public List<Anuncio> getAnuncios() {
		return this.anuncioService.getAnuncios();
	}
	
	
	@GetMapping("/getAnuncio/{id}")
	public Optional<Anuncio> getAnuncio(@PathVariable int id) {
		System.out.println("estamos en el back");

		return this.anuncioService.getAnuncioService(id);
		
	}
	
	@PostMapping("{anuncioId}/favorito/{usuarioEmail}")
	public Anuncio favourite(@PathVariable int anuncioId,@PathVariable String usuarioEmail){
	       return anuncioService.updateFavourites(anuncioId, usuarioEmail); 
	}
	

	
}
