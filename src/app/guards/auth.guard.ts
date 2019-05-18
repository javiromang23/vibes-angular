import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router
    ) {}

  canActivate() {
    const token = this.userService.getToken();
    if (!token) {
      this.router.navigate(['/signin']);
      return false;
    }
    return true;
  }
}
