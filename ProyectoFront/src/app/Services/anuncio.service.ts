import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Anuncio } from '../Modelos/anuncio';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../Modelos/usuario';
import { PaginationHelper } from '../Helpers/pagination-helper';

@Injectable({
  providedIn: 'root',
})
export class AnuncioService {
  constructor(private http: HttpClient) {}
  rutaGlobal = 'http://localhost:8081/';
  public readonly defaultFiltros: any = {
    address: '',
    elevator: false,
    pool: false,
    garage: false,
    paddleCourt: false,
    balcony: false,
    terrace: false,
    seaViews: false,
    storageRoom: false,
    minPrice: null,
    maxPrice: null,
    numRooms: null,
    numBathrooms: null,
    squareMeters: null,
    transactionType: null,
    propertyState: null,
    propertyType: null,
  };

  public filtros = { ...this.defaultFiltros };

  public readonly numRoomsOp: number[] = [1, 2, 3, 4];
  public readonly numBathRoomsOp: number[] = [1, 2, 3, 4];

  addAnuncioService(anuncio: FormData): Observable<Anuncio> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .post<Anuncio>(this.rutaGlobal + 'anuncio/publicarAnuncio', anuncio, {
        headers: headers,
      })
      .pipe(map((response) => response));
  }

  //Reset filtros
  resetService() {
    this.filtros = { ...this.defaultFiltros };
  }

  //Get un anuncio especifico
  getAnunciosService() {
    return this.http.get<Anuncio[]>(this.rutaGlobal + 'anuncio/getAnuncios', {
      observe: 'response',
    });
  }

  //Get todos los anuncios
  getAnuncioService(id: number) {
    return this.http.get<Anuncio>(
      this.rutaGlobal + 'anuncio/getAnuncio/' + id,
      {
        observe: 'response',
      },
    );
  }

  //Filtros
  filtrosService(
    anuncios: Anuncio[],
    filtros: { [key: string]: boolean | number | string | null },
  ): Anuncio[] {
    return anuncios.filter((anuncio) => {
      return Object.keys(filtros).every((key) => {
        const filtro = filtros[key];
        if (
          filtro === null ||
          filtro === '' ||
          filtro === false ||
          filtro === undefined
        )
          return true;

        if (typeof filtro === 'boolean') {
          return anuncio[key] === filtros[key];
        } else if (typeof filtro === 'number') {
          if (key === 'minPrice' && Number(anuncio['price']) < filtro) {
            return false;
          }
          if (key === 'maxPrice' && Number(anuncio['price']) > filtro) {
            return false;
          }
          if (key === 'numRooms' && Number(anuncio['numRooms']) < filtro) {
            return false;
          }
          if (
            key === 'numBathrooms' &&
            Number(anuncio['numBathrooms']) < filtro
          ) {
            return false;
          }
          if (
            key === 'squareMeters' &&
            Number(anuncio['squareMeters']) < filtro
          ) {
            return false;
          }
        } else if (typeof filtro === 'string') {
          return anuncio[key]?.toLowerCase().includes(filtro.toLowerCase());
        } else {
          return anuncio[key] === filtro;
        }
        return true;
      });
    });
  }

  //Dar favorito en el back
  favBackService(anuncio: Anuncio, usuario: Usuario) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post<Anuncio>(
        this.rutaGlobal +
          'anuncio/' +
          anuncio.id +
          '/favorito/' +
          usuario.email,
        { headers: headers },
      )
      .pipe(map((response) => response));
  }

  //Obtener anuncios favoritos del usuario
  getFavouritesService(id: number) {
    return this.http.get<Anuncio[]>(
      this.rutaGlobal + 'login/getFavoritos/' + id,
      {
        observe: 'response',
      },
    );
  }

  //Obtener anuncios de usuario
  getMisAnunciosService(id: number) {
    return this.http.get<Anuncio[]>(
      this.rutaGlobal + 'login/getMisAnuncios/' + id,
      {
        observe: 'response',
      },
    );
  }

  //Comprobar si el anuncio es favorito
  isFavoritoService(anuncio: Anuncio, usuario: Usuario): boolean {
    return (
      anuncio.favoritos?.some((fav) => Number(fav.id) === Number(usuario.id)) ??
      false
    );
  }

  //Dar o quitar favorito
  favService(
    anuncio: Anuncio,
    usuario: Usuario,
    misFavoritosPage: boolean,
    anuncios: Anuncio[],
    anunciosFiltrados: Anuncio[],
    paginatedAnuncios: Anuncio[],
    pageIndex: number,
    pageSize: number,
  ) {
    const isFavorito = this.isFavoritoService(anuncio, usuario);
    if (isFavorito) {
      anuncio.favoritos = anuncio.favoritos?.filter(
        (fav) => fav.id !== usuario.id,
      );

      if (misFavoritosPage) {
        //Quitar de anuncios
        const indexAnuncio = anuncios.findIndex((a) => a.id === anuncio.id);
        if (indexAnuncio !== -1) {
          anuncios.splice(indexAnuncio, 1);
        }
        //Quitar de anuncios Filtrados
        const indexFiltrado = anunciosFiltrados.findIndex(
          (a) => a.id === anuncio.id,
        );
        if (indexFiltrado !== -1) {
          anunciosFiltrados.splice(indexFiltrado, 1);
        }

        const nuevosPaginated = PaginationHelper.getPaginatedData(
          anunciosFiltrados,
          pageIndex,
          pageSize,
        );
        paginatedAnuncios.splice(
          0,
          paginatedAnuncios.length,
          ...nuevosPaginated,
        );
      }
    } else {
      if (!anuncio.favoritos) anuncio.favoritos = [];
      anuncio.favoritos.push(usuario);
    }

    this.favBackService(anuncio, usuario).subscribe((response) => {});
  }

  //Eliminar anuncio
  deleteService(id: number) {
    return this.http.delete<any>(this.rutaGlobal + 'anuncio/delete/' + id, {
      observe: 'response',
    });
  }
}
