  import { Component, inject, AfterViewInit } from '@angular/core';
  import {MatStepperModule} from '@angular/material/stepper';
  import {MatButtonToggleModule} from '@angular/material/button-toggle';
  import {MatIconModule} from '@angular/material/icon';
  import { MatButtonModule } from '@angular/material/button';
  import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
  import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
  import {MatFormFieldModule} from '@angular/material/form-field';
  import {MatInputModule} from '@angular/material/input';
  import {MatSelectModule} from '@angular/material/select';
  import { PropertyType } from '../../Enum/property-type';
  import {MatCheckboxModule} from '@angular/material/checkbox';
  import { signal} from '@angular/core';
  import { MatAutocompleteModule } from '@angular/material/autocomplete';
  import { Anuncio} from '../../Modelos/anuncio';
import { DomSanitizer } from '@angular/platform-browser';
import { AnuncioService } from '../../Services/anuncio.service';
import { LoginService } from '../../Services/login.service';
import {  Usuario } from '../../Modelos/usuario';
import { Router } from '@angular/router';


  export interface Option {
    name: string;
    completed: boolean;
  }

  declare var google: any; 

  @Component({
    selector: 'app-publicar-anuncio',
    providers: [
      {
        provide: STEPPER_GLOBAL_OPTIONS,
        useValue: {displayDefaultIndicatorType: false},
      },
      
    ],
    imports: [
      MatButtonToggleModule,
      MatStepperModule,
      MatIconModule,
      MatButtonModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatCheckboxModule,
      MatAutocompleteModule
    ],
    templateUrl: './publicar-anuncio.component.html',
    styleUrl: './publicar-anuncio.component.css'
  })
  export class PublicarAnuncioComponent implements AfterViewInit {
    private formBuilder = inject(FormBuilder);
    sellerData: any; 
    suggestions: any[] = [];
    autocomplete!: any;

    constructor(private sanitizer: DomSanitizer, private anuncioService: AnuncioService, private loginService:LoginService, private router:Router){}

    
    /*Paso 1*/

    firstFormGroup = this.formBuilder.group({
      transactionType: [null, Validators.required],
      propertyType : [null, Validators.required],
      propertyState : [null,Validators.required]
    });

    types=[
      {value: PropertyType.piso, viewValue: "Piso"},
      {value: PropertyType.casa, viewValue: "Casa"},
      {value: PropertyType.terreno, viewValue: "Terreno"},
      {value: PropertyType.trastero, viewValue: "Trastero"},
      {value: PropertyType.garaje, viewValue: "Garaje"},
    ]

    
    /*Paso 2*/

    secondFormGroup = this.formBuilder.group({
      numRooms: ['', Validators.required],
      numBathrooms: ['', Validators.required],
      squareMeters: ['', Validators.required]
    });

  /*TODO Paso 3  */

  options = signal<Option[]>([
    {name: 'Ascensor', completed: false},
    {name: 'Piscina', completed: false},
    {name: 'Garaje', completed: false},
    {name: 'Pista de padel', completed: false},
    {name: 'Balcon', completed: false},
    {name: 'Terraza', completed: false},
    {name: 'Vistas al mar', completed: false},
    {name: 'Trastero', completed: false},
  ]);

  update(completed: boolean, index: number) {
    this.options.update(option => {
      option[index].completed = completed;
      return [...option];
    });
  }
  /*Paso 4*/
  thirdFormGroup= this.formBuilder.group({
    description:["",Validators.required],
    price:["", Validators.required]
  })



  /*Paso 5*/


  imgPreview : { key: number, img: string }[] = [];
  imgArray : any = [];


  /**Subir fotos */
  capturarFile(event:Event){
    const input = event.target as HTMLInputElement;
    let archivoEncontrado : File[] = [];


    if(input.files){
      archivoEncontrado = Array.from(input.files)
    }
    this.imgArray.push(archivoEncontrado);
    
    
    archivoEncontrado.forEach(element => {
          this.extraerBase64(element).then((imagen: any)=>{
            const key = Date.now();
            this.imgPreview.push({
              key: key,
              img: imagen.base
            })
          }        
      )});
      input.value = '';
  }


  extraerBase64 = async($event: any) => new Promise((resolve, reject)=>{
    try{
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve ({
          base: reader.result
        });
      };
      reader.onerror= error => {
        reject(error); 
      };
    }catch(e){
      reject(e);
    }
  })

  //Direccion

  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.AutocompleteService();
  }
  
  fourthFormGroup = this.formBuilder.group({
    address: ['', Validators.required],
  })

  onInputChange(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (input.length > 2) {
      this.autocomplete.getPlacePredictions({ input }, (predictions: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.suggestions = predictions;
        } else {
          this.suggestions = [];
        }
      });
    } else {
      this.suggestions = [];
    }
  }

  selectAddress(suggestion: any) {
    
    console.log('Dirección seleccionada:', suggestion.description);
    this.suggestions = [];
    console.log(this.fourthFormGroup.get("address")?.value||undefined);
  }



  //Crear anuncio
  addPost(){
    console.log("estamos en addpost")
    // const userObservable = this.loginService.getUser();
    // if(userObservable){
    //   userObservable.subscribe(
    //     (response) =>{
    //       this.sellerData = response as Usuario;  
    //       console.log(this.sellerData)
      
    this.loginService.usuario$.subscribe(usuario=>{
      this.sellerData = usuario as Usuario;
   
    
    let anuncio = new Anuncio();
    anuncio.seller = this.sellerData;
    anuncio.transactionType = this.firstFormGroup.get("transactionType")?.value || undefined;
    anuncio.propertyType = this.firstFormGroup.get("propertyType")?.value || undefined;
    anuncio.propertyState = this.firstFormGroup.get("propertyState")?.value || undefined;
    anuncio.numRooms = Number(this.secondFormGroup.get("numRooms")?.value || 0);
    anuncio.numBathrooms = Number(this.secondFormGroup.get("numBathrooms")?.value || 0);
    anuncio.squareMeters = Number(this.secondFormGroup.get("squareMeters")?.value || 0);
    anuncio.elevator = this.options()[0].completed;
    anuncio.pool = this.options()[1].completed;
    anuncio.garage = this.options()[2].completed;
    anuncio.paddleCourt = this.options()[3].completed;
    anuncio.balcony = this.options()[4].completed;
    anuncio.terrace = this.options()[5].completed;
    anuncio.seaViews = this.options()[6].completed;
    anuncio.storageRoom = this.options()[7].completed;
    anuncio.address = this.fourthFormGroup.get("address")?.value || undefined;
    anuncio.description = this.thirdFormGroup.get("description")?.value || undefined;
    anuncio.price = Number(this.thirdFormGroup.get("price")?.value || 0);

    let formData = new FormData();


    formData.append('anuncio', JSON.stringify(anuncio));
    console.log(JSON.stringify(anuncio)); 

    for (let imgArray of this.imgArray) {
      if(imgArray){
        for (let file of imgArray) {
          formData.append('photo', file); 
      }
      }
   } 
 
  this.anuncioService.addAnuncioService(formData).subscribe(
        response =>  {
          this.router.navigate(["/anuncios"]); 
        }

        )
      })
      
}

}