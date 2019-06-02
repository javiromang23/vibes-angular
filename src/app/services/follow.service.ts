import { Injectable } from '@angular/core';
import { Parameters } from './parameters';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
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

  getFollowers(username: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.token);
    return this.http.get(this.url + 'followers/' + username, {headers});
  }

  getFolloweds(username: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.token);
    return this.http.get(this.url + 'followeds/' + username, {headers});
  }

  saveFollow(username: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.token);
    return this.http.post(this.url + 'follow', { username } , { headers });
  }

  deleteFollow(username: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.token);
    return this.http.delete(this.url + 'unfollow/' + username, { headers });
  }

  getFollow(username: string): Observable<any> {
    const headers = this.headers.set('Authorization', this.token);
    return this.http.get(this.url + 'followed/' + username, { headers });
  }
}
