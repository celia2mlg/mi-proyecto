import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AnuncioService } from '../../Services/anuncio.service';
import { Anuncio } from '../../Modelos/anuncio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbar } from '@angular/material/toolbar';
import { LoginService } from '../../Services/login.service';
import { Usuario } from '../../Modelos/usuario';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { PaginationHelper } from '../../Helpers/pagination-helper';
import { PropertyType } from '../../Enum/property-type';
import { CustomCurrencyPipe } from '../../Pipes/custom-currency.pipe';

@Component({
  selector: 'app-anuncios',
  imports: [
    CustomCurrencyPipe,
    MatCardModule,
    MatPaginatorModule,
    MatToolbar,
    MatSelectModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './anuncios.component.html',
  styleUrl: './anuncios.component.css',
})
export class AnunciosComponent implements OnInit {
  anuncios: Array<Anuncio> = [];
  viewContactSeller: boolean = false;
  selectedAnuncio: Anuncio | null = null;
  anunciosFiltrados: Array<Anuncio> = [];
  readonly numRoomsOp: number[];
  readonly numBathRoomsOp: number[];
  filtros: any;
  usuario: Usuario = {};
  misFavoritosPage: boolean = false;
  misAnunciosPage: boolean = false;
  paginatedAnuncios: Array<Anuncio> = [];
  propertyType = PropertyType;

  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  dataLoaded = false;

  pageEvent!: PageEvent;
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.paginatedAnuncios = PaginationHelper.getPaginatedData(
      this.anunciosFiltrados,
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private anuncioService: AnuncioService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.filtros = this.anuncioService.filtros;
    this.numRoomsOp = this.anuncioService.numRoomsOp;
    this.numBathRoomsOp = this.anuncioService.numBathRoomsOp;
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.misFavoritosPage = data['misFavoritosPage'] || false;
      this.misAnunciosPage = data['misAnunciosPage'] || false;
    });

    this.loginService.usuario$.subscribe((response) => {
      this.usuario = response as Usuario;
      console.log(this.misAnunciosPage);

      if (this.misFavoritosPage === true) {
        this.getFavoritos(this.usuario);
      } else if (this.misAnunciosPage === true) {
        this.getMisAnuncios(this.usuario);
      } else {
        this.activatedRoute.queryParams.subscribe((params) => {
          if (Object.keys(params).length > 0) {
            this.filtros = { ...this.filtros, ...params };
            this.router.navigate([], {
              relativeTo: this.activatedRoute,
              queryParams: {},
            });
          }
          this.getAnuncios();
        });
      }
    });
  }

  getAnuncios() {
    this.anuncioService.getAnunciosService().subscribe((response) => {
      if (response && response.body) {
        this.anuncios = response.body.map((anuncio) => ({
          ...anuncio,
          currentImageIndex: 0,
        }));

        if (Object.keys(this.filtros).some((key) => this.filtros[key])) {
          this.filtrar();
        } else {
          this.anunciosFiltrados = this.anuncios;
        }
        this.length = this.anunciosFiltrados.length;

        this.paginatedAnuncios = PaginationHelper.getPaginatedData(
          this.anunciosFiltrados,
          this.pageIndex,
          this.pageSize,
        );
        this.cdr.markForCheck();
      } else {
        console.log('No hay anuncios');
      }
      this.dataLoaded = true;
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

  //Abrir y cerrar información de contacto
  openContactSeller(anuncio: Anuncio) {
    this.selectedAnuncio = anuncio;
    this.viewContactSeller = true;
  }
  closeContactSeller() {
    this.viewContactSeller = false;
    this.selectedAnuncio = null;
  }

  //Salir al pulsar fuera del cuadro
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (this.viewContactSeller && !this.selectedAnuncio?.seller) {
      this.viewContactSeller = false;
    }
  }

  //Navegar a un anuncio específico
  navigateTo(anuncio: Anuncio) {
    this.router.navigate(['/anuncio', anuncio.id]);
  }

  //Filtros
  filtrar() {
    this.anunciosFiltrados = this.anuncioService.filtrosService(
      this.anuncios,
      this.filtros,
    );
    console.log(this.anunciosFiltrados);
    console.log('estamos en filtrar()');
    this.length = this.anunciosFiltrados.length;
    this.pageIndex = 0;
    this.paginatedAnuncios = PaginationHelper.getPaginatedData(
      this.anunciosFiltrados,
      this.pageIndex,
      this.pageSize,
    );
  }

  //Dar o quitar favorito
  fav(anuncio: Anuncio) {
    this.anuncioService.favService(
      anuncio,
      this.usuario,
      this.misFavoritosPage,
      this.anuncios,
      this.anunciosFiltrados,
      this.paginatedAnuncios,
      this.pageIndex,
      this.pageSize,
    );

    this.cdr.markForCheck();
  }

  //Comprobar favoritos
  isFavorito(anuncio: Anuncio): boolean {
    return this.anuncioService.isFavoritoService(anuncio, this.usuario);
  }

  //Cargar anuncios favoritos del usuario
  getFavoritos(usuario: Usuario) {
    let id = this.usuario.id;
    console.log(usuario);
    if (id) {
      this.anuncioService.getFavouritesService(id).subscribe((response) => {
        if (response && response.body) {
          this.anuncios = response.body.map((anuncio) => ({
            ...anuncio,
            currentImageIndex: 0,
          }));

          console.log(this.anuncios);

          this.anunciosFiltrados = this.anuncios;
          this.length = this.anunciosFiltrados.length;

          this.paginatedAnuncios = PaginationHelper.getPaginatedData(
            this.anunciosFiltrados,
            this.pageIndex,
            this.pageSize,
          );

          this.cdr.markForCheck();
        } else {
          console.log('No hay anuncios');
        }
      });
    }
  }

  //Get mis anuncios
  getMisAnuncios(usuario: Usuario) {
    let id = this.usuario.id;
    console.log(usuario);
    if (id) {
      this.anuncioService.getMisAnunciosService(id).subscribe((response) => {
        if (response && response.body) {
          this.anuncios = response.body.map((anuncio) => ({
            ...anuncio,
            currentImageIndex: 0,
          }));

          console.log(this.anuncios);

          this.anunciosFiltrados = this.anuncios;
          this.length = this.anunciosFiltrados.length;

          this.paginatedAnuncios = PaginationHelper.getPaginatedData(
            this.anunciosFiltrados,
            this.pageIndex,
            this.pageSize,
          );

          this.cdr.markForCheck();
        } else {
          console.log('No hay anuncios');
        }
      });
    }
  }

  //Paginator
  // getPaginatedData(){
  //   const startIndex = this.pageIndex * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   this.paginatedAnuncios = this.anunciosFiltrados.slice(startIndex, endIndex);

  // }
}
