import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { TopBarComponent } from './Components/top-bar/top-bar.component';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { LoginService } from './Services/login.service';
import { Usuario } from './Modelos/usuario';
import { FooterComponent } from './Components/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  imports: [
    MatIconModule,
    RouterOutlet,
    NgxUiLoaderModule,
    MatSidenavModule,
    TopBarComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Proyecto';
  usuario: Usuario = {};
  menuItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.ngxLoader.start();
    window.addEventListener('load', () => {
      this.ngxLoader.stop();
    });

    this.loginService.usuario$.subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario as Usuario;
        this.menuItems = [
          {
            label: 'Ver todos los anuncios',
            action: () => this.navigateTo('/anuncios'),
          },
          {
            label: 'Publicar nuevo anuncio',
            action: () => this.navigateTo('/publicar'),
          },
          {
            label: 'Mi perfil',
            action: () => this.navigateTo('/miPerfil/' + this.usuario.id),
          },
          {
            label: 'Mis anuncios publicados',
            action: () => this.navigateTo('/misAnuncios/' + this.usuario.id),
          },
          {
            label: 'Mis anuncios favoritos',
            action: () => this.navigateTo('/misFavoritos/' + this.usuario.id),
          },
          {
            label: 'Cerrar sesión',
            icon: 'logout',
            action: () => this.cerrarSesion(),
          },
        ];
      } else {
        this.menuItems = [
          {
            label: 'Ver todos los anuncios',
            action: () => this.navigateTo('/anuncios'),
          },
          {
            label: 'Iniciar sesión',
            icon: 'login',
            action: () => this.navigateTo('/inicioSesion'),
          },
        ];
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.ngxLoader.start();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
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

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.drawer.close();
  }

  //Cerrar Sesion
  cerrarSesion() {
    const returnUrl = this.router.url;
    console.log('Estamos en cerrar sesion');
    this.loginService.cerrarSesion(returnUrl);
    this.drawer.close();
  }
}
