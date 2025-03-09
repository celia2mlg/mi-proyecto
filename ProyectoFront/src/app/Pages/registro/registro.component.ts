import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators ,ReactiveFormsModule, FormControlName, AbstractControl, ValidationErrors} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario,Credentials } from '../../Modelos/usuario';
import { RegistroService } from '../../Services/registro.service';
import { LoginService } from '../../Services/login.service';


@Component({
  selector: 'app-registro',
  imports: [MatCardModule, MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  formulario:  FormGroup;
  errorMsg?: string;
  returnUrl?: string;

  constructor(private fb:FormBuilder, private router: Router, private registroService: RegistroService
    , private loginService: LoginService, private route: ActivatedRoute 
  ){
    

    this.formulario = this.fb.group({
      name: new FormControl('',[Validators.required]),
      surname: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email]),
      phoneNumber  : new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required, this.strongPasswordValidator]),
      confirmPass: new FormControl('',[Validators.required]),
      
    },
    { validators: this.matchPasswords('password', 'confirmPass') })

  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl']||'/';
  }

isValidPass : Boolean = false;

//Boton de navegar a inicio Sesion
  navigateToLogin(){
    this.router.navigate(["/inicioSesion"], {queryParams:{returnUrl: this.router.url}});
  }


//Nuevo usuario
addUsuario(){
 
    if(this.formulario.valid){
      let usuario  = new Usuario();
    
      usuario = {
        nombre: this.formulario.get("name")?.value,
        apellidos: this.formulario.get("surname")?.value,
        email: this.formulario.get("email")?.value,
        telefono: this.formulario.get("phoneNumber")?.value,
        password: this.formulario.get("password")?.value
      }

      this.registroService.verifyEmail(usuario.email!).subscribe(
        response => {
          if(response.body){
            this.errorMsg = "Email ya existe."
          }else{
            this.registroService.addUsuarioService(usuario).subscribe(
              response => {
                console.log(response)
                console.log(response.body?.email)
          
                });
            
            const credentials : Credentials ={
              email : usuario?.email,
              password : usuario?.password
            }
      
            console.log(credentials)
      
            this.loginService.login(credentials,  this.returnUrl || '/').subscribe(
              loginResponse => {
                console.log("login completado")
              }
            );
      
          }
        }
      )
     
      

    }

  }

//Comprobar contraseña

matchPasswords(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['matchPasswords']) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ matchPasswords: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

// Contraseña fuerte

strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[@$!%*?&./,]/.test(value);
  const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  return valid ? null : { strongPassword: true };
}


}


