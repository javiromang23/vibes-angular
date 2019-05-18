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

  constructor(
    private http: HttpClient
  ) {
    this.url = Parameters.URL_API_VIBES;
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
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

  /** Método para obtener un usuario */
  getUser(username: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.getToken());
    return this.http.get(this.url + 'user/' + username, {headers});
  }

  /** Método para modificar un usuario */
  updateUser(user: User): Observable<any> {
    const headers = this.headers.set('Authorization', this.getToken());
    return this.http.put(this.url + 'user/' + user.username, user, {headers});
  }

  /** Método para eliminar un usuario */
  deleteUser(username: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.getToken());
    return this.http.delete(this.url + 'user/' + username, {headers});
  }

  /** Método para obtener el token del localStorage */
  getToken() {
    const token = JSON.parse(localStorage.getItem('ssid_session'));
    if (!token) {
      this.token = null;
    } else {
      this.token = token;
    }
    return token;
  }
}
