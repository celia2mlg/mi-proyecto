import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from '../Services/login.service';
import { filter, map, take } from 'rxjs/operators';
import { Usuario } from '../Modelos/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidarUsuarioGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.loginService.usuario$.pipe(
      filter((usuario) => usuario !== null),
      take(1),
      map((usuario: Usuario | null) => {
        const idRuta = +route.paramMap.get('id')!;
        if (usuario && usuario.id === idRuta) {
          return true;
        } else {
          this.router.navigate(['/restricted-page']);
          return false;
        }
      }),
    );
  }
}
