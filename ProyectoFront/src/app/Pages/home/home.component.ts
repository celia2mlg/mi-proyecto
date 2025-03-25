import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Services/login.service';
import { Usuario } from '../../Modelos/usuario';
import { AnuncioService } from '../../Services/anuncio.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, Params } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TransactionType } from '../../Enum/transaction-type';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  usuarioRegistrado: Usuario | null = null;
  filtros: Params = {
    address: '',
    transactionType: null,
  };

  constructor(
    private router: Router,
    private loginService: LoginService,
    private anuncioService: AnuncioService,
  ) {}

  ngOnInit(): void {
    this.loginService.usuario$.subscribe((usuario: Usuario | null) => {
      this.usuarioRegistrado = usuario;
    });
  }

  //Filtrar anuncios
  filtrarAnuncios() {
    this.router.navigate(['/anuncios'], { queryParams: this.filtros });
  }

  //Ir a anuncios con filtro
  navigateWithFilters() {
    this.router.navigate(['/anuncios'], { queryParams: this.filtros });
  }

  //Ir a anuncios
  navigateFilterPage() {
    this.router.navigate(['/anuncios']);
  }

  //Ir a publicar anuncio
  navigateToPublicar() {
    this.router.navigate(['/publicar']);
  }

  //Ir a login
  navigateToLogin() {
    this.router.navigate(['/inicioSesion']);
  }

  //Ir a registro
  navigateToRegister() {
    this.router.navigate(['/registro']);
  }
}
