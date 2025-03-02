package com.example.ProyectoBack.controller;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ProyectoBack.model.Anuncio;
import com.example.ProyectoBack.model.Usuario;
import com.example.ProyectoBack.repository.UsuarioRepository;
import com.example.ProyectoBack.security.TokenUtils;
import com.example.ProyectoBack.services.UsuarioService;

//rest controller solo responde con datos, no con una vista
@RestController
@RequestMapping("/login")
public class LoginController {
	
	@Autowired
	private UsuarioService usuarioService;
	
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	
	@Autowired
	private UsuarioRepository usuarioRepository;
	
	@Autowired
	private TokenUtils tokenUtil; 
	
	//Aqui obtenemos el listado de usuarios registrados
	@GetMapping("/getAll")
	public Iterable<Usuario> getAll(){
		return this.usuarioService.getAll();
		
	}
	
	@GetMapping("/find")
	public Usuario findByEmail(@RequestParam String email) {
		Usuario usuario = usuarioRepository.findByEmail(email);
		
		return usuario; 
	}
	
	
/*	
	@PostMapping("/signIn")
	public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest) {
	    String email = loginRequest.getEmail();
	    String password = loginRequest.getPassword();

	    Usuario usuario = usuarioService.findByEmail(email);
	    
        System.out.println("estamos aqui 1");

	    Map<String, String> response = new HashMap<>();

	    if (usuario != null && passwordEncoder.matches(password, usuario.getPassword())) {
	        String token = tokenUtil.createToken(usuario.getNombre(), usuario.getEmail());
	        System.out.println("estamos aqui 2");
	        response.put("message", "Login exitoso");
	        response.put("token", token);
	        return ResponseEntity.ok(response);
	    } else {
	        System.out.println("estamos aqui 3");

	        response.put("message", "Contraseña incorrecta");
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	    }
	}
*/


	@PostMapping("register")
	public Usuario addUsuario(@RequestBody Usuario usuario) {
	    String encodedPassword = passwordEncoder.encode(usuario.getPassword());
	    usuario.setPassword(encodedPassword);  

		return this.usuarioService.addUsuario(usuario);
	}

	@GetMapping("/getFavoritos/{id}")
	public List<Anuncio> getFavourites(@PathVariable int id){
		Optional<Usuario> usuario = this.usuarioService.findById(id);
		return usuarioService.getFavoritosService(usuario);
	}
	
	@GetMapping("/getMisAnuncios/{id}")
	public List<Anuncio> getMisAnuncios(@PathVariable int id){
		Optional<Usuario> usuario = this.usuarioService.findById(id);
		return usuarioService.getMisAnunciosService(usuario);
	}

}
