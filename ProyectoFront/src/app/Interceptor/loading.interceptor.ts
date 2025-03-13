import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private ngxLoader: NgxUiLoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    this.ngxLoader.start();
    return next.handle(req).pipe(
      finalize(() => {
        this.ngxLoader.stop();
      }),
    );
  }
}
