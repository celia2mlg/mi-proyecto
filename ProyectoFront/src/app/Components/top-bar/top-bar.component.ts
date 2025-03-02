import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button'; // Para botones en la barra
import { MatIconModule } from '@angular/material/icon'; // Para íconos
import { Router } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import { LoginService } from '../../Services/login.service';
import { Usuario } from '../../Modelos/usuario';

@Component({
  selector: 'app-top-bar',
  imports: [MatToolbarModule,MatSelectModule,MatFormFieldModule, MatSidenavModule,MatButtonModule, MatIconModule ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent implements OnInit {
  constructor(private router:Router, private loginService: LoginService){}
  usuario: Usuario = {};


  ngOnInit(): void {
    // this.loginService.getUser().subscribe(
    //   (response)=>{
    //   this.usuario = response as Usuario;
    // });
    this.loginService.usuario$.subscribe(user => {
      this.usuario = user as Usuario; 
    });
  }

  //Boton inicio sesion
  navigateToLogin(){
    this.router.navigate(['/inicioSesion'])
  }

  //Logo para ir a home
  navigateToHome(){
    this.router.navigate(['/'])
  }

  @Output() menuClicked = new EventEmitter<void>();

  toggleDrawer() {
    this.menuClicked.emit();
  }


}
