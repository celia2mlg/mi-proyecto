	package com.example.ProyectoBack.model;
	import com.fasterxml.jackson.annotation.JsonIgnore;
	import com.fasterxml.jackson.annotation.JsonProperty;

	
	import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
	import jakarta.persistence.Entity;
	import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
	
	
	@Entity
	public class Usuario {
		
		@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
		int id;
		
		@Column
		String nombre;
		
		@Column
		String apellidos;
		
		@Column
		String email;
		
		@Column
		@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
		String password;
		
		@Column
		int telefono;
		
		@ManyToMany(mappedBy = "favoritos")
		@JsonIgnore
		private List<Anuncio> anunciosFavoritos;
		
		@JsonIgnore
		@OneToMany(mappedBy = "seller")
		private List<Anuncio> anunciosPublicados;

		
		//Getters and setters
		
		public int getId() {
			return id;
		}

		public void setId(int id) {
			this.id = id;
		}

		public String getNombre() {
			return nombre;
		}

		public void setNombre(String nombre) {
			this.nombre = nombre;
		}

		public String getApellidos() {
			return apellidos;
		}

		public void setApellidos(String apellidos) {
			this.apellidos = apellidos;
		}

		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}

		public String getPassword() {
			return password;
		}

		public void setPassword(String password) {
			this.password = password;
		}

		public int getTelefono() {
			return telefono;
		}

		public void setTelefono(int telefono) {
			this.telefono = telefono;
		}

		public List<Anuncio> getAnunciosFavoritos() {
			return anunciosFavoritos;
		}

		public void setAnunciosFavoritos(List<Anuncio> anunciosFavoritos) {
			this.anunciosFavoritos = anunciosFavoritos;
		}

		public List<Anuncio> getAnunciosPublicados() {
			return anunciosPublicados;
		}

		public void setAnunciosPublicados(List<Anuncio> anunciosPublicados) {
			this.anunciosPublicados = anunciosPublicados;
		}

		//Constructors
		
		public Usuario(int id, String nombre, String apellidos, String email, String password, int telefono,
				List<Anuncio> anunciosFavoritos, List<Anuncio> anunciosPublicados) {
			super();
			this.id = id;
			this.nombre = nombre;
			this.apellidos = apellidos;
			this.email = email;
			this.password = password;
			this.telefono = telefono;
			this.anunciosFavoritos = anunciosFavoritos;
			this.anunciosPublicados = anunciosPublicados;
		}
		
		public Usuario(int id, String nombre, String apellidos, String email, int telefono) {
			this.id = id;
	        this.nombre = nombre;
	        this.apellidos = apellidos;
	        this.email = email;
	        this.telefono = telefono;
	    }


		public Usuario() {
			super();
		}
		
		
		//toString
		
		@Override
		public String toString() {
			return "Usuario [id=" + id + ", nombre=" + nombre + ", apellidos=" + apellidos + ", email=" + email
					+ ", telefono=" + telefono + ", anunciosFavoritos=" + anunciosFavoritos
					+ ", anunciosPublicados=" + anunciosPublicados + "]";
		}
	
		
		
		
		
		
	}
