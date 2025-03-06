import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../Modelos/usuario';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private http: HttpClient) { }

  rutaGlobal = "http://localhost:8081/login"

   //Nuevo usuario
   addUsuarioService(usuario: Usuario){
  
    return this.http.post<Usuario>(this.rutaGlobal+"/register", usuario ,{
      observe: "response"
    })
  }

  //Verificar que el email no está en la bd
  verifyEmail(email:string){
    return this.http.get<Usuario>(this.rutaGlobal+"/find",{
      params:{email:email},
      observe:"response"
      
    });
  }

  

}
