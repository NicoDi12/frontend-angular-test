import { User } from './../../shared/interfaces/user';
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
// import { environment } from '../../../environments/environment.development'; -> coloca el path de tus variables de entorno

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);

  currentUser = signal<User | null>(null);

  constructor() {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      try {
        const user = JSON.parse(userStorage) as User;
        this.currentUser.set(user);
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
        this.logout(false);
      }
    }
  }

  requestLogin(credentials: any): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth`, credentials, {
      headers: { 'X-Skip-Interceptor': 'true' }
    }).pipe(
      tap(res => {
        this.login(res, res.token);
      })
    );
  }

  public handleRefreshResponse(response: User): void {
    localStorage.setItem('token', response.token);
    this.updateData(response);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  login(user: User, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  updateData(data: Partial<User>) {
    this.currentUser.update(current => {
      if (!current) return null;
      const updatedUser = {
        ...current,
        ...data
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }


  logout(shouldRedirect: boolean = true) {
    localStorage.clear();
    sessionStorage.clear();
    this.currentUser.set(null);

    if (shouldRedirect) {
      this.router.navigate(['/login']);
    }
  }
}
