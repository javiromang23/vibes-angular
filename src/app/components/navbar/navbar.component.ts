import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  public userLoggedIn: User;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
    this.userLoggedIn = new User('', '', '', '', '', '', new Date(), '', '', '', '');
  }

  ngOnInit() {
    this.getUserLoggedIn();
  }

  getUserLoggedIn() {
    this.userService.getUserById(this.userService.getUserId()).subscribe(
      response => {
        this.userLoggedIn = response.user;
      },
      error => {
        this.userLoggedIn = null;
        this.router.navigate(['/error']);
        console.log(error);
      }
    );
  }

  logOut() {
    console.clear();
    localStorage.clear();
    this.router.navigate(['/sign-in']);
  }

}
