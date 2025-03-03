import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { TopBarComponent } from './Components/top-bar/top-bar.component';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { LoginService } from './Services/login.service';
import { Usuario } from './Modelos/usuario';
import { FooterComponent } from "./Components/footer/footer.component";
import { MatIconModule } from '@angular/material/icon';
import { NgxUiLoaderService } from 'ngx-ui-loader'; 
import { NgxUiLoaderModule } from 'ngx-ui-loader';

 
@Component({
  selector: 'app-root',
  imports: [MatIconModule,RouterOutlet,NgxUiLoaderModule, MatSidenavModule, TopBarComponent, FooterComponent],
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
  constructor(private ngxLoader: NgxUiLoaderService, private router: Router, private loginService:LoginService) { }

  ngOnInit(): void {
    this.ngxLoader.start();
    window.addEventListener('load',()=>{
      this.ngxLoader.stop();
    })

    this.loginService.usuario$.subscribe(usuario=>{
      this.usuario = usuario as Usuario;
    })

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.ngxLoader.start();
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.ngxLoader.stop();
      }
    });
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
