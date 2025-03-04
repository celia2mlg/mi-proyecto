import {MatCardModule} from '@angular/material/card';
import { Component, OnInit } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import { Anuncio } from '../../Modelos/anuncio';
import { Usuario } from '../../Modelos/usuario';
import { PageEvent,MatPaginatorModule} from '@angular/material/paginator';
import { AnuncioService } from '../../Services/anuncio.service';
import { LoginService } from '../../Services/login.service';

@Component({
  selector: 'app-mi-perfil',
  imports: [MatCardModule,MatIconModule,MatPaginatorModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit {
    anuncios : Array<Anuncio> = [];
    viewContactSeller : boolean = false;
    selectedAnuncio: Anuncio | null = null;
    usuario: Usuario= {};
    paginatedAnuncios: Array<Anuncio> = [];
    length = 0;
    pageSize = 5;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 25];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    constructor(private anuncioService:AnuncioService, private loginService: LoginService){}

    ngOnInit(): void {
      this.loginService.usuario$.subscribe(usuario=>{
        this.usuario = usuario as Usuario;
      })
      
       if(this.usuario.id){
         this.anuncioService.getMisAnunciosService(this.usuario.id).subscribe(
           response=>
         )
       }
    }

      pageEvent!: PageEvent;
         handlePageEvent(e: PageEvent) {
           this.pageEvent = e;
           this.length = e.length;
           this.pageSize = e.pageSize;
           this.pageIndex = e.pageIndex;
          this.getPaginatedData(); // Actualiza la lista paginada
    
        }
        setPageSizeOptions(setPageSizeOptionsInput: string) {
          if (setPageSizeOptionsInput) {
            this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
          }
        }
    

    //Comprobar si es favorito
    isFavorito(anuncio: Anuncio){
      return this.anuncioService.isFavoritoService(anuncio, this.usuario);
    }


}
