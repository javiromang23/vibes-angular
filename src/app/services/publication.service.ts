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

  public getPublication(publicationId: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.userService.token);
    return this.http.get(this.url + 'publication/' + publicationId, {headers});
  }

  public getPublicationsUser(username: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.userService.token);
    return this.http.get(this.url + 'publications/' + username, {headers});
  }

  public getPublicationsFollows(): Observable<any> {
    const headers = this.headers.set('Authorization', this.userService.token);
    return this.http.get(this.url + 'publications/follows', {headers});
  }

  public getPublicationsPublic(): Observable<any> {
    const headers = this.headers.set('Authorization', this.userService.token);
    return this.http.get(this.url + 'publications/public', { headers });
  }

  public getImage(username: string, image: string): Observable<Blob> {
    const headers = this.headers.set('Authorization', this.userService.token);
    return this.http.get(this.url + 'publication/' + username + '/' + image,
    { headers , responseType: 'blob' });
  }

  public uploadPublication(formData): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.userService.token);
    return this.http.post(this.url + 'publication', formData, { headers });
  }

  public deletePublication(publicationId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.userService.token);
    return this.http.delete(this.url + 'publication/' + publicationId, { headers });
  }
}
