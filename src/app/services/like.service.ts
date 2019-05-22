import { Injectable } from '@angular/core';
import { Parameters } from './parameters';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  public url: string;
  public headers: HttpHeaders;
  public token: string;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.url = Parameters.URL_API_VIBES;
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = this.userService.getToken();
  }

  saveLikePublication(publicationId: string): Observable<any> {
    const headers = this.headers.set('authorization', this.token);
    return this.http.post(this.url + 'like/' + publicationId, null, {headers});
  }

  getLikesByPublication(publicationId: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.token);
    return this.http.get(this.url + 'likes/' + publicationId, {headers});
  }
}
