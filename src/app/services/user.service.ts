import { Injectable } from '@angular/core';
import { Parameters } from './parameters';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url: string;
  public headers: HttpHeaders;
  public token: string;
  public userId: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = Parameters.URL_API_VIBES;
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.userId = this.getUserId();
  }

  /** Método para registrarse */
  signUp(user: User): Observable<any> {
    const params = JSON.stringify(user);
    const headers = this.headers;
    return this.http.post(this.url + 'signUp', params, {headers});
  }

  /** Método para hacer login */
  signIn(user: User): Observable<any> {
    const params = JSON.stringify(user);
    const headers = this.headers;
    return this.http.post(this.url + 'signIn', params, {headers});
  }

  /** Método para obtener un usuario por nombre de usuario */
  getUser(username: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.getToken());
    return this.http.get(this.url + 'user/' + username, {headers});
  }

  /** Método para obtener un usuario */
  getUserById(id: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.getToken());
    return this.http.get(this.url + 'userById/' + id, {headers});
  }

  /** Método para obtener usuarios */
  searchUsers(username: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.getToken());
    return this.http.get(this.url + 'search-user/' + username, { headers });
  }

  /** Método para modificar un usuario */
  updateUser(user: User, data: FormData = null): Observable<any> {
    let headers: HttpHeaders;
    if (!data) {
      headers = this.headers.set('Authorization', this.getToken());
    } else {
      headers = new HttpHeaders().set('Authorization', this.getToken());
    }

    if (!data) {
      return this.http.put(this.url + 'user/' + user.username, user, {headers});
    }
    return this.http.put(this.url + 'user/' + user.username, data, {headers});
  }

  /** Método para eliminar un usuario */
  deleteUser(username: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.getToken());
    return this.http.delete(this.url + 'user/' + username, {headers});
  }

  getImage(username: string, image: string): Observable<Blob> {
    const headers = this.headers.set('Authorization', this.getToken());
    return this.http.get(this.url + 'user/' + username + '/' + image,
    { headers , responseType: 'blob' });
  }

  /** Método para obtener el token del localStorage */
  getToken() {
    const token = JSON.parse(localStorage.getItem('token_session'));
    if (!token) {
      this.token = null;
    } else {
      this.token = token;
    }
    return token;
  }

  /** Método para conseguir el username del localstorage */
  getUserId() {
    const userId = JSON.parse(localStorage.getItem('ssid_session'));
    if (!userId) {
      this.userId = null;
    } else {
      this.userId = userId;
    }
    return userId;
  }

  /**
   * Método para enviar correo para reestablecer contraseña
   */
  sendEmailResetPassword(email: string): Observable<any> {
    const headers = this.headers;
    return this.http.post(this.url + 'resetPassword', { email}, {headers});
  }

  /**
   * Método para restablecer contraseña con un hash enviado por email
   * @param password contraseña
   */
  resetPasswordByEmail(password: string, hash: string): Observable<any> {
    const headers = this.headers;
    return this.http.post(this.url + 'resetPasswordByEmail/' + hash , { password }, { headers });
  }

  /** Método para restablecer contraseña sin hash */
  resetPassword(username: string, data: any): Observable<any> {
    const headers = this.headers.set('Authorization', this.getToken());
    return this.http.post(this.url + 'resetPassword/' + username,
    { oldPassword: data.oldPassword, newPassword: data.newPassword }, { headers });
  }


  checkResetPassword(hash: string): Observable<any> {
    const headers = this.headers;
    return this.http.get(this.url + 'check-reset/' + hash, { headers });
  }
}
