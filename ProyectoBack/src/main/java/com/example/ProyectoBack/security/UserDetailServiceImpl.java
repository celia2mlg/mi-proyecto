package com.example.ProyectoBack.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.ProyectoBack.model.Usuario;
import com.example.ProyectoBack.repository.UsuarioRepository;

@Service
public class UserDetailServiceImpl implements UserDetailsService{
	
	@Autowired
	private UsuarioRepository usuarioRepository;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		Usuario usuario = usuarioRepository
			.findOneByEmail(email)
			.orElseThrow(()-> new UsernameNotFoundException("El usuario "+email+" no existe"));
		return new UserDetailsImpl(usuario);
	}
	

}
