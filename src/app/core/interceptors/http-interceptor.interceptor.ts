import { SwalService } from '../services/swal.service';
import { AuthService } from '../services/auth.service';
// import { environment } from './../../../environments/environment.development'; -> agrega aqui el path de tus variables de entorno
import { User } from '../../shared/interfaces/user';
import { HttpInterceptorFn, HttpHandlerFn, HttpRequest, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';

let isRefreshing = false;

export const httpInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const http = inject(HttpClient);
  const authService = inject(AuthService);
  const swalService = inject(SwalService);
  const isUser = authService.isAuthenticated();

  if (req.headers.get('X-Skip-Interceptor')) {
    req = req.clone({
      withCredentials: isUser ? true : false,
    });
    return next(req);
  }

  const token = localStorage.getItem('token');
  let authenticatedRequest = req;

  if (token) {
    authenticatedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
      withCredentials: isUser ? true : false,
    });
  }

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('refresh-token') && !isRefreshing) {

        isRefreshing = true;

        return http.post<User>(
          `${environment.apiUrl}/auth/refresh-token`,
          {},
          {
            headers: req.headers.set('X-Skip-Interceptor', 'true'),
            withCredentials: isUser ? true : false,
          }
        ).pipe(
          switchMap(response => {
            isRefreshing = false;

            authService.handleRefreshResponse(response);

            const newReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${response.token}`),
              withCredentials: isUser ? true : false,
            });
            return next(newReq);
          }),
          catchError(() => {
            isRefreshing = false;

            swalService.showWarning(
              'Sesión Expirada',
              'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
            ).then(() => {
              authService.logout();
            });

            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
