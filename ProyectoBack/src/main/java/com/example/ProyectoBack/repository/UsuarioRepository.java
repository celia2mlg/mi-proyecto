package com.example.ProyectoBack.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ProyectoBack.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{
	
	//Deberia quitar alguno de los dos
    Usuario findByEmail(String email);
    
    Optional<Usuario> findOneByEmail(String email);

    
}
