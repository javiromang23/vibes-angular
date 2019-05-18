import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {


  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
