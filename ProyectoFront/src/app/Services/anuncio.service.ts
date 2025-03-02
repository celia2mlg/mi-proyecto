    import { HttpClient, HttpHeaders } from '@angular/common/http';
    import { Injectable } from '@angular/core';
    import { Anuncio } from '../Modelos/anuncio';
    import { Observable } from 'rxjs';
    import { map } from 'rxjs/operators'; 
import { Usuario } from '../Modelos/usuario';
    
    @Injectable({
      providedIn: 'root',

    })
    export class AnuncioService {


      constructor(private http: HttpClient) {}
      rutaGlobal = "http://localhost:8081/"
      public filtros: any = {
        address: "",
        elevator: false,
        pool: false,
        garage: false,
        paddleCourt: false,
        balcony : false,
        terrace : false,
        seaViews: false,
        storageRoom : false,
        minPrice : null,
        maxPrice: null,
        numRooms: null,
        numBathrooms: null,
        squareMeters: null,
        transactionType: null,
        propertyState: null,
        propertyType: null
  
      }  
      public readonly numRoomsOp: number[] = [1, 2, 3, 4];
      public readonly numBathRoomsOp: number[] = [1, 2, 3, 4];

      addAnuncioService(anuncio: FormData): Observable<Anuncio>{
        const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}` 
        });
        console.log("token del localstorage"+token)
    
        return this.http.post<Anuncio>(this.rutaGlobal+"anuncio/publicarAnuncio", anuncio,{ headers: headers }).pipe(
          map(response=> response))

      }

      getAnunciosService(){
        return this.http.get<Anuncio[]>(this.rutaGlobal+"anuncio/getAnuncios",{
          observe: "response"
        });
      }

      getAnuncioService(id:number){
        return this.http.get<Anuncio>(this.rutaGlobal+"anuncio/getAnuncio/"+id,{
          observe:"response"
          
        })
      }


      filtrosService(anuncios:Anuncio[], filtros:{[key:string]: boolean | number | string | null}): Anuncio[]{
        return anuncios.filter(anuncio=>{
          return Object.keys(filtros).every(key=>{
            const filtro = filtros[key];
            if(filtro === null || filtro === "" || filtro ===false || filtro===undefined) return true;

            if(typeof filtro === "boolean"){
              return anuncio[key] === filtros[key];
            }else if(typeof filtro === "number"){
              if (key === 'minPrice' && Number(anuncio["price"]) < filtro) {
                return false;
              }
              if (key === 'maxPrice' && Number(anuncio["price"])> filtro) {
                return false;
              }
              if (key === 'numRooms' && Number(anuncio["numRooms"])< filtro){
                return false;
              }
              if (key === 'numBathrooms' && Number(anuncio["numBathrooms"])< filtro){
                return false;
              }
              if (key === 'squareMeters' && Number(anuncio["squareMeters"])< filtro){
                return false;
              }
            }else if (typeof filtro === 'string') {
              return anuncio[key]?.toLowerCase().includes(filtro.toLowerCase());
            }else{
              return anuncio[key] === filtro;
            }
            return true;
          })
        }
       
        )
      }


      favService(anuncio:Anuncio, usuario:Usuario){
        const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}` 
        });

        return this.http.post<Anuncio>(this.rutaGlobal+"anuncio/"+anuncio.id+"/favorito/"+usuario.email,{headers: headers }).pipe(
          map(response=> response));

      }

      //Obtener anuncios favoritos del usuario
      getFavouritesService(id:number){
       return this.http.get<Anuncio[]>(this.rutaGlobal+"login/getFavoritos/"+id,{
          observe:"response"
        })
      }

      //Obtener anuncios de usuario
      getMisAnunciosService(id:number){
        return this.http.get<Anuncio[]>(this.rutaGlobal+"login/getMisAnuncios/"+id,{
          observe: "response"
        })
      }


    }
