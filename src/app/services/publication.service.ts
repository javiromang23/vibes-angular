import { Injectable } from '@angular/core';
import { Parameters } from './parameters';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  public url: string;
  public headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.url = Parameters.URL_API_VIBES;
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  public getPublicationsUser(username: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.userService.token);
    return this.http.get(this.url + 'publications/' + username, {headers});
  }

  public getPublicationsFollows(): Observable<any> {
    const headers = this.headers.set('Authorization', this.userService.token);
    return this.http.get(this.url + 'publications/follows', {headers});
  }

  public getImage(username: string, image: string): Observable<Blob> {
    const headers = this.headers.set('Authorization', this.userService.token);
    return this.http.get(this.url + 'publication/' + username + '/' + image,
    { headers , responseType: 'blob' });
  }
}
