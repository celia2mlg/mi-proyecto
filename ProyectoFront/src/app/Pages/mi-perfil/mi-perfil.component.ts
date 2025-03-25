import { MatCardModule } from '@angular/material/card';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Anuncio } from '../../Modelos/anuncio';
import { Usuario } from '../../Modelos/usuario';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { AnuncioService } from '../../Services/anuncio.service';
import { LoginService } from '../../Services/login.service';
import { PaginationHelper } from '../../Helpers/pagination-helper';
import { Router } from '@angular/router';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { PropertyType } from '../../Enum/property-type';

@Component({
  selector: 'app-mi-perfil',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
})
export class MiPerfilComponent implements OnInit {
  anuncios: Array<Anuncio> = [];
  anunciosFiltrados: Array<Anuncio> = this.anuncios;
  viewContactSeller: boolean = false;
  selectedAnuncio: Anuncio | null = null;
  usuario: Usuario = {};
  paginatedAnuncios: Array<Anuncio> = [];
  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  misFavoritos: boolean = true;
  propertyType = PropertyType;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private anuncioService: AnuncioService,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.loginService.usuario$.subscribe((usuario) => {
      this.usuario = usuario as Usuario;
    });
    this.getFavoritos(this.usuario);
  }

  //Indice de Mat tab
  onTabChanged(event: any) {
    const matTabEvent = event as MatTabChangeEvent;

    if (event.index === 0) {
      this.misFavoritos = true;
      this.getFavoritos(this.usuario);
    } else {
      this.misFavoritos = false;
      this.getMisAnuncios(this.usuario);
    }
  }

  //Opciones paginator
  pageEvent!: PageEvent;
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.paginatedAnuncios = PaginationHelper.getPaginatedData(
      this.anuncios,
      this.pageIndex,
      this.pageSize,
    );
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  //Mostrar favoritos
  getFavoritos(usuario: Usuario) {
    let id = this.usuario.id;
    if (id) {
      this.anuncioService.getFavouritesService(id).subscribe((response) => {
        if (response && response.body) {
          this.anuncios = response.body.map((anuncio) => ({
            ...anuncio,
            currentImageIndex: 0,
          }));
          this.anunciosFiltrados = this.anuncios;
          this.length = this.anunciosFiltrados.length;

          this.paginatedAnuncios = PaginationHelper.getPaginatedData(
            this.anunciosFiltrados,
            this.pageIndex,
            this.pageSize,
          );

          this.cdr.markForCheck();
        }
      });
    }
  }

  //Mostrar mis anuncios
  getMisAnuncios(usuario: Usuario) {
    let id = this.usuario.id;
    if (id) {
      this.anuncioService.getMisAnunciosService(id).subscribe((response) => {
        if (response && response.body) {
          this.anuncios = response.body.map((anuncio) => ({
            ...anuncio,
            currentImageIndex: 0,
          }));
          this.anunciosFiltrados = this.anuncios;
          this.length = this.anunciosFiltrados.length;

          this.paginatedAnuncios = PaginationHelper.getPaginatedData(
            this.anunciosFiltrados,
            this.pageIndex,
            this.pageSize,
          );

          this.cdr.markForCheck();
        }
      });
    }
  }

  //Comprobar si es favorito
  isFavorito(anuncio: Anuncio) {
    return this.anuncioService.isFavoritoService(anuncio, this.usuario);
  }

  //Boton favorito
  fav(anuncio: Anuncio) {
    this.anuncioService.favService(
      anuncio,
      this.usuario,
      this.misFavoritos,
      this.anuncios,
      this.anunciosFiltrados,
      this.paginatedAnuncios,
      this.pageIndex,
      this.pageSize,
    );
    this.cdr.markForCheck();
  }

  //Navegar a un anuncio específico
  navigateTo(anuncio: Anuncio) {
    this.router.navigate(['/anuncio', anuncio.id]);
  }

  //Abrir y cerrar información de contacto
  openContactSeller(anuncio: Anuncio) {
    this.selectedAnuncio = anuncio;
    this.viewContactSeller = true;
  }
  closeContactSeller() {
    this.viewContactSeller = false;
    this.selectedAnuncio = null;
  }

  //Eliminar anuncio
  delete(id: number) {
    this.anuncioService.deleteService(id).subscribe((response) => {
      if (response) {
        this.anuncios = this.anuncios.filter((anuncio) => anuncio.id !== id);
        this.anunciosFiltrados = this.anuncios;
        this.length = this.anuncios.length;
        this.paginatedAnuncios = PaginationHelper.getPaginatedData(
          this.anunciosFiltrados,
          this.pageIndex,
          this.pageSize,
        );

        this.cdr.markForCheck();
      }
    });
  }

  //Pasar de fotos
  prevImage(anuncio: Anuncio) {
    if (anuncio.currentImageIndex != undefined) {
      if (anuncio.currentImageIndex > 0) {
        anuncio.currentImageIndex--;
        this.cdr.markForCheck();
      }
    }
  }

  nextImage(anuncio: Anuncio) {
    if (anuncio.currentImageIndex != undefined) {
      if (
        anuncio.photo &&
        anuncio.currentImageIndex < anuncio.photo.length - 1
      ) {
        anuncio.currentImageIndex++;
        this.cdr.markForCheck();
      }
    }
  }
}
