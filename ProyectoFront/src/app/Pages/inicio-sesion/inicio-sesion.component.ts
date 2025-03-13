import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import { Usuario } from '../../Modelos/usuario';
import { Credentials } from '../../Modelos/usuario';

@Component({
  selector: 'app-inicio-sesion',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css',
})
export class InicioSesionComponent implements OnInit {
  formulario: FormGroup;
  usuarios: Array<Usuario>;
  errorMsg?: string;
  returnUlr?: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private route: ActivatedRoute,
  ) {
    this.usuarios = new Array<Usuario>();

    this.formulario = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.returnUlr = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  creds: Credentials = {
    email: '',
    password: '',
  };

  //Iniciar sesion
  login() {
    this.creds.email = this.formulario.get('email')?.value;
    this.creds.password = this.formulario.get('password')?.value;

    console.log('en el compoennte');
    console.log(this.creds);

    this.loginService
      .login(this.creds, this.returnUlr || '/')
      .subscribe((response) => {
        if (!response.success) {
          this.errorMsg = response.error;
        } else {
          this.errorMsg = undefined;
        }
      });
  }

  //Boton de navegar a registro
  navigateToRegister() {
    this.router.navigate(['/registro']);
  }
}
