import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopBarComponent } from './Components/top-bar/top-bar.component';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { LoginService } from './Services/login.service';
import { Usuario } from './Modelos/usuario';
import { FooterComponent } from "./Components/footer/footer.component";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [MatIconModule,RouterOutlet, MatSidenavModule, TopBarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Proyecto';
  usuario:Usuario = {};


  menuItems = [
    {label:"Publicar nuevo anuncio", route:"/publicar"},
    {label:"Mi perfil", route:""},
    {label:"Mis anuncios publicados", route:"/misAnuncios/"+ this.usuario.id},
    {label:"Mis anuncios favoritos", route:"/misFavoritos/"+this.usuario.id},

  ];
  constructor(private router: Router, private loginService:LoginService) { }

  ngOnInit(): void {
    this.loginService.usuario$.subscribe(usuario=>{
      this.usuario = usuario as Usuario;
    })
    // this.loginService.getUser().subscribe(
    //   (response)=>{
    //     this.usuario= response as Usuario;
    //   }
    // );
  }
  @ViewChild('drawer') drawer!: MatDrawer;

  toggleDrawer() {
    this.drawer.toggle();
  }

  navigateTo(route: string){
    this.router.navigate([route]);
    this.drawer.close();
  }

  //Cerrar Sesion
  cerrarSesion(){
    console.log("Estamos en cerrar sesion")
    this.loginService.cerrarSesion();
    this.drawer.close();

    
  }





}
