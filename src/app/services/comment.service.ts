import { Injectable } from '@angular/core';
import { Parameters } from './parameters';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
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

  public saveCommentPublication(publicationId: string, text: string): Observable<any> {
    const headers = this.headers.set('authorization', this.token);
    return this.http.post(this.url + 'comment/' + publicationId, {text}, {headers});
  }

  public getCommentsPublication(publicationId: string): Observable<any> {
    const headers = this.headers.set('authorization', this.token);
    return this.http.get(this.url + 'comment/' + publicationId, {headers});
  }
}
