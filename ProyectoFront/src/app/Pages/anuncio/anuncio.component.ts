import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Anuncio, Photo } from '../../Modelos/anuncio';
import { MatCardModule } from '@angular/material/card';
import { AnuncioService } from '../../Services/anuncio.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CustomCurrencyPipe } from '../../Pipes/custom-currency.pipe';
import { PropertyType } from '../../Enum/property-type';
import { Usuario } from '../../Modelos/usuario';
import { LoginService } from '../../Services/login.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-anuncio',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CommonModule,
    CustomCurrencyPipe,
  ],
  templateUrl: './anuncio.component.html',
  styleUrl: './anuncio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnuncioComponent implements OnInit {
  anuncioId: string | null = null;
  anuncio: Anuncio | null = null;
  anuncioIdNumber: number | null = null;
  anuncioPhoto: Photo[] = [];
  characteristics: { name: String; value: boolean }[] = [];
  propertyType = PropertyType;
  usuario: Usuario = {};
  isFavorite?: boolean;
  viewContactSeller: boolean = false;

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private anuncioService: AnuncioService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.anuncioId = this.route.snapshot.paramMap.get('id');
    if (this.anuncioId != null) {
      this.anuncioIdNumber = parseInt(this.anuncioId);
    }

    if (this.anuncioIdNumber) {
      this.anuncioService
        .getAnuncioService(this.anuncioIdNumber)
        .subscribe((response) => {
          this.anuncio = response.body;
          this.anuncioPhoto = this.anuncio?.photo || [];
          if (this.anuncio) {
            this.anuncio.currentImageIndex = 0;
          }
          console.log(this.anuncio);
          this.loginService.usuario$.subscribe((response) => {
            this.usuario = response as Usuario;
            if (
              this.anuncio?.favoritos?.some((fav) => fav.id === this.usuario.id)
            ) {
              this.isFavorite = true;
            } else {
              this.isFavorite = false;
            }
            console.log('en oninit', this.isFavorite);
          });

          //Caracteristicas

          this.characteristics = [
            { name: 'Balcón', value: this.anuncio?.balcony ?? false },
            { name: 'Ascensor', value: this.anuncio?.elevator ?? false },
            { name: 'Garaje', value: this.anuncio?.garage ?? false },
            {
              name: 'Pista de padel',
              value: this.anuncio?.paddleCourt ?? false,
            },
            { name: 'Piscina', value: this.anuncio?.pool ?? false },
            { name: 'Vistas al mar', value: this.anuncio?.seaViews ?? false },
            { name: 'Trastero', value: this.anuncio?.storageRoom ?? false },
            { name: 'Terraza', value: this.anuncio?.terrace ?? false },
          ];
          this.cdRef.detectChanges();
        });
    }
  }

  //Pasar de fotos
  prevImage(anuncio: Anuncio) {
    if (anuncio.currentImageIndex != undefined) {
      if (anuncio.currentImageIndex > 0) {
        anuncio.currentImageIndex--;
        this.cdRef.markForCheck();
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
        console.log(anuncio.currentImageIndex);
        this.cdRef.markForCheck();
      }
    }
  }

  //Seleccionar una foto

  selectImage(anuncio: Anuncio, index: number) {
    anuncio.currentImageIndex = index;
  }

  //Dar favorito
  fav(anuncio: Anuncio) {
    this.isFavorite = !this.isFavorite;

    if (this.isFavorite) {
      if (!this.anuncio!.favoritos) {
        this.anuncio!.favoritos = [];
      }
      this.anuncio!.favoritos.push(this.usuario);
    } else {
      this.anuncio!.favoritos = anuncio.favoritos?.filter(
        (fav) => fav.id !== this.usuario.id,
      );
    }

    this.anuncioService
      .favBackService(this.anuncio!, this.usuario)
      .subscribe((response) => {
        console.log('fav actualizado');
      });

    this.cdRef.detectChanges();
    console.log('depues de dar fav', this.isFavorite);
  }

  //Abrir y cerrar información de contacto
  openContactSeller(anuncio: Anuncio) {
    this.viewContactSeller = true;
  }
  closeContactSeller() {
    this.viewContactSeller = false;
    // this.selectedAnuncio = null;
  }

  //Salir al pulsar fuera del cuadro
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (this.viewContactSeller && !this.anuncio?.seller) {
      this.viewContactSeller = false;
    }
  }
}
