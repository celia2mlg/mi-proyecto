import { Component, OnInit,ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Anuncio, Photo } from '../../Modelos/anuncio';
import {MatCardModule} from '@angular/material/card';
import { AnuncioService } from '../../Services/anuncio.service';
import {MatIconModule} from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { CustomCurrencyPipe } from '../../Pipes/custom-currency.pipe';


@Component({
  selector: 'app-anuncio',
  imports: [MatCardModule,MatIconModule,CommonModule, CustomCurrencyPipe],
  templateUrl: './anuncio.component.html',
  styleUrl: './anuncio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class AnuncioComponent implements OnInit {
  
  anuncioId: string | null = null;
  anuncio: Anuncio | null = null;
  anuncioIdNumber : number |null = null;
  anuncioPhoto : Photo[]= [];
  characteristics: {name: String, value: boolean}[] =[];


  constructor(private route:ActivatedRoute, private anuncioService: AnuncioService, private cdRef:ChangeDetectorRef ){}

  ngOnInit(): void {
    this.anuncioId = this.route.snapshot.paramMap.get('id');
    if(this.anuncioId != null){

    this.anuncioIdNumber = parseInt(this.anuncioId);
    }
    
    if(this.anuncioIdNumber){
      this.anuncioService.getAnuncioService(this.anuncioIdNumber).subscribe(
        response =>{
          this.anuncio = response.body
          this.anuncioPhoto = this.anuncio?.photo || [];
          if (this.anuncio) {
            this.anuncio.currentImageIndex = 0;
          }
          console.log(this.anuncio);
          //Caracteristicas

        this.characteristics = [
          {name: "Balcón", value: this.anuncio?.balcony ?? false},
          {name: "Ascensor", value: this.anuncio?.elevator ?? false},
          {name: "Garaje", value: this.anuncio?.garage ?? false},
          {name: "Pista de padel", value: this.anuncio?.paddleCourt ?? false},
          {name: "Piscina", value: this.anuncio?.pool ?? false},
          {name: "Vistas al mar", value: this.anuncio?.seaViews ?? false},
          {name: "Trastero", value: this.anuncio?.storageRoom ?? false},
          {name: "Terraza", value: this.anuncio?.terrace ?? false},

        ]
          this.cdRef.detectChanges();
        }
      );
    
    }

        

  }

    //Pasar de fotos
    prevImage(anuncio: Anuncio){
      if(anuncio.currentImageIndex != undefined){
        if (anuncio.currentImageIndex > 0) {
          anuncio.currentImageIndex--;
          this.cdRef.markForCheck(); 
        }
      }
    }

    nextImage(anuncio: Anuncio){
      if(anuncio.currentImageIndex != undefined){
        if (anuncio.photo && anuncio.currentImageIndex < anuncio.photo.length - 1) {
          anuncio.currentImageIndex++;
          console.log(anuncio.currentImageIndex)
          this.cdRef.markForCheck();
        }
      }
    }

    //Seleccionar una foto
    

    selectImage(anuncio:Anuncio, index:number){
      anuncio.currentImageIndex = index;
    }



}
