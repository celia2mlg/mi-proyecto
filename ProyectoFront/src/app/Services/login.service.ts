  import { HttpClient, HttpResponse } from '@angular/common/http';
  import { Injectable, OnInit } from '@angular/core';
  import { Credentials, Usuario } from '../Modelos/usuario';
import { BehaviorSubject, map, of } from 'rxjs';
import { Router } from '@angular/router';

  @Injectable({
    providedIn: 'root'
  })
  export class LoginService{
    usuarioSubject = new BehaviorSubject<Usuario | null>(null);

    constructor(private http: HttpClient, private router: Router) { 
      this.getUser().subscribe(user => {
        this.usuarioSubject.next(user);
      });
    }
    usuarios?: Array<Usuario>
    rutaGlobal = "http://localhost:8081/login"

 
    
    //Loguearse
    login(creds: Credentials) {
      return this.http.post(this.rutaGlobal+"/url", creds,{
          observe: "response"
      }).pipe(map((response: HttpResponse<any>)=>{
        const body = response.body;
        console.log("body")
        console.log(response)
        if(response){
          
           const headers = response.headers;
          
           const bearerToken = headers.get("Authorization")!;
           console.log(response) 

          const token = bearerToken.replace("Bearer ","");
          console.log(token) 

           localStorage.setItem("token", token);
           console.log("Bienvenido");


           this.getUser().subscribe(user => {
            this.usuarioSubject.next(user); 
          });
           this.router.navigate(['/']);
  
         }
      
        return body;

      }))
    }

    getToken(){
      return localStorage.getItem("token");
    }

    //Get usuario
    get usuario$() {
      return this.usuarioSubject.asObservable(); 
    }
    

    //Obtener usuario
    getUser(){
      const token = localStorage.getItem('token');
      const payload = token?.split('.')[1];
      console.log("estamos en getuser")
      if (payload) {
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);
      const email = parsedPayload.sub;
    
     

     return  this.http.get(this.rutaGlobal+"/find", { 
      params:{email:email},
      observe:"response"          
        }).pipe(
          map(response => response.body),
        );
        
    }else{
      return of(null);
    }
    
    }

    //Cerrar sesion
    cerrarSesion(){
      localStorage.removeItem('token'); 
      this.usuarioSubject.next(null);
      this.router.navigate(["/"])
    }
  }
