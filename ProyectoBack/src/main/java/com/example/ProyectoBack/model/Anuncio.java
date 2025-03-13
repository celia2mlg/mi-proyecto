package com.example.ProyectoBack.model;

import java.util.List;

import com.example.ProyectoBack.enumeraciones.PropertyState;
import com.example.ProyectoBack.enumeraciones.PropertyType;
import com.example.ProyectoBack.enumeraciones.TransactionType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Anuncio {
	
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	int id;
	
    @OneToMany(mappedBy = "anuncio", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("anuncio")
	List<AnuncioFotos> photo;
	
	@Column
	int squareMeters;
	
	@ManyToOne
	@JoinColumn(name = "seller_id")
	Usuario seller;
	
	@Column
	int numRooms;
	
	//TODO
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
		        name = "anuncio_favorito_usuario",  
		        joinColumns = @JoinColumn(name = "anuncio_id_favorito", referencedColumnName = "id"), 
		        inverseJoinColumns = @JoinColumn(name = "usuario_id_favorito", referencedColumnName = "id")
		        )
	List <Usuario> favoritos;
	
	@Column(length = 1000)
	String description;
	
	@Column
	double price;
	
	@Column
	int numBathrooms; 	
	@Column
	boolean elevator;
	
	@Column
	boolean pool;
	
	@Column
	boolean garage;
	
	@Column
	boolean storageRoom;
	
	@Column
	boolean paddleCourt;
	
	@Column
	boolean terrace;
	
	@Column
	boolean balcony;
	
	@Column
	boolean seaViews;
	
	
	
	@Column
	String address;
	
	
	@Column
	@Enumerated(EnumType.STRING)
	PropertyState propertyState;
	
	@Column
	@Enumerated(EnumType.STRING)
	PropertyType propertyType;
	
	@Column
	@Enumerated(EnumType.STRING)
	TransactionType transactionType;
	
	
	//Getters y Setters

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}
	
	public List<AnuncioFotos> getPhoto() {
		return photo;
	}

	public void setPhoto(List<AnuncioFotos> bs) {
		this.photo = bs;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getSquareMeters() {
		return squareMeters;
	}

	public void setSquareMeters(int squareMeters) {
		this.squareMeters = squareMeters;
	}

	public Usuario getSeller() {
		return seller;
	}

	public void setSeller(Usuario seller) {
		this.seller = seller;
	}

	public int getNumRooms() {
		return numRooms;
	}

	public void setNumRooms(int numRooms) {
		this.numRooms = numRooms;
	}

	public List<Usuario> getFavoritos() {
		return favoritos;
	}

	public void setFavoritos(List<Usuario> favoritos) {
		this.favoritos = favoritos;
	}

	public int getNumBathrooms() {
		return numBathrooms;
	}

	public void setNumBathrooms(int numBathrooms) {
		this.numBathrooms = numBathrooms;
	}

	public boolean isElevator() {
		return elevator;
	}

	public void setElevator(boolean elevator) {
		this.elevator = elevator;
	}

	public boolean isPool() {
		return pool;
	}

	public void setPool(boolean pool) {
		this.pool = pool;
	}

	public boolean isGarage() {
		return garage;
	}

	public void setGarage(boolean garage) {
		this.garage = garage;
	}

	public boolean isStorageRoom() {
		return storageRoom;
	}

	public void setStorageRoom(boolean storageRoom) {
		this.storageRoom = storageRoom;
	}

	public boolean isPaddleCourt() {
		return paddleCourt;
	}

	public void setPaddleCourt(boolean paddleCourt) {
		this.paddleCourt = paddleCourt;
	}

	public boolean isTerrace() {
		return terrace;
	}

	public void setTerrace(boolean terrace) {
		this.terrace = terrace;
	}

	public boolean isBalcony() {
		return balcony;
	}

	public void setBalcony(boolean balcony) {
		this.balcony = balcony;
	}

	public boolean isSeaViews() {
		return seaViews;
	}

	public void setSeaViews(boolean seaViews) {
		this.seaViews = seaViews;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public PropertyState getPropertyState() {
		return propertyState;
	}

	public void setPropertyState(PropertyState propertyState) {
		this.propertyState = propertyState;
	}

	public PropertyType getPropertyType() {
		return propertyType;
	}

	public void setPropertyType(PropertyType propertyType) {
		this.propertyType = propertyType;
	}

	public TransactionType getTransactionType() {
		return transactionType;
	}

	public void setTransactionType(TransactionType transactionType) {
		this.transactionType = transactionType;
	}
	public int getId() {
	return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	

	//toString

		@Override
		public String toString() {
			return "Anuncio [id=" + id + ", photo=" + photo + ", squareMeters=" + squareMeters + ", seller=" + seller
					+ ", numRooms=" + numRooms + ", favoritos=" + favoritos + ", description=" + description
					+ ", price=" + price + ", numBathrooms=" + numBathrooms + ", elevator=" + elevator + ", pool="
					+ pool + ", garage=" + garage + ", storageRoom=" + storageRoom + ", paddleCourt=" + paddleCourt
					+ ", terrace=" + terrace + ", balcony=" + balcony + ", seaViews=" + seaViews + ", address="
					+ address + ", propertyState=" + propertyState + ", propertyType=" + propertyType
					+ ", transactionType=" + transactionType + "]";
		}
		
		
		
	//Constructors

		public Anuncio(int id, List<AnuncioFotos> photo, int squareMeters, Usuario seller, int numRooms,
				List<Usuario> favoritos, String description, double price, int numBathrooms, boolean elevator, boolean pool,
				boolean garage, boolean storageRoom, boolean paddleCourt, boolean terrace, boolean balcony,
				boolean seaViews, String address, PropertyState propertyState, PropertyType propertyType,
				TransactionType transactionType) {
			super();
			this.id = id;
			this.photo = photo;
			this.squareMeters = squareMeters;
			this.seller = seller;
			this.numRooms = numRooms;
			this.favoritos = favoritos;
			this.description = description;
			this.price = price;
			this.numBathrooms = numBathrooms;
			this.elevator = elevator;
			this.pool = pool;
			this.garage = garage;
			this.storageRoom = storageRoom;
			this.paddleCourt = paddleCourt;
			this.terrace = terrace;
			this.balcony = balcony;
			this.seaViews = seaViews;
			this.address = address;
			this.propertyState = propertyState;
			this.propertyType = propertyType;
			this.transactionType = transactionType;
		}
		
		
		public Anuncio() {
			super();
		}
	
	


	

}
