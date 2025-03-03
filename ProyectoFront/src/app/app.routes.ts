import { Routes } from '@angular/router';
import { InicioSesionComponent } from './Pages/inicio-sesion/inicio-sesion.component';
import { RegistroComponent } from './Pages/registro/registro.component';
import { PublicarAnuncioComponent } from './Pages/publicar-anuncio/publicar-anuncio.component';
import { AnunciosComponent } from './Pages/anuncios/anuncios.component';
import { authGuard } from './Helpers/auth.guard';
import { HomeComponent } from './Pages/home/home.component';
import { AnuncioComponent } from './Pages/anuncio/anuncio.component';



export const routes: Routes = [
    {
        path:'',
        loadComponent: ()=> import("./Pages/home/home.component").then(componente => HomeComponent)
    },
    {
        path:'inicioSesion',
        loadComponent: ()=> import("./Pages/inicio-sesion/inicio-sesion.component").then(componente => InicioSesionComponent)
    },
    {
        path:'registro',
        loadComponent: ()=> import("./Pages/registro/registro.component").then(componente => RegistroComponent)
    },
    {
        path:'publicar',
        loadComponent: () => import("./Pages/publicar-anuncio/publicar-anuncio.component").then(componente => PublicarAnuncioComponent ),
        canActivate: [authGuard]
    },
    {
        path: 'anuncios',
        loadComponent: () => import("./Pages/anuncios/anuncios.component").then(componente => AnunciosComponent)
    },
    {
        path: 'anuncio/:id',
        loadComponent: () => import("./Pages/anuncio/anuncio.component").then(componente => AnuncioComponent)
    },
    {
        path: 'misFavoritos/:id',
        loadComponent: () => import("./Pages/anuncios/anuncios.component").then(componente => AnunciosComponent),data: { misFavoritosPage: true },
        canActivate: [authGuard]
    },
    {
        path: 'misAnuncios/:id',
        loadComponent: () => import("./Pages/anuncios/anuncios.component").then(componente => AnunciosComponent),data: { misAnunciosPage: true },
        canActivate: [authGuard]
    }
];
