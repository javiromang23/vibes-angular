import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  public token: string;
  public user: User;
  public usernameProfile: string;
  public url: string;
  public status: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.url = this.userService.url;
    this.token = userService.getToken();
    this.activatedRoute.params.subscribe(params => {
      this.usernameProfile = params.username;
    });
    this.status = null;
  }

  ngOnInit() {
    if (!this.token) {
      this.router.navigate(['/sign-in']);
    }
    this.getUserLoggedIn();
  }

  getUserLoggedIn() {
    this.userService.getUserById(this.userService.userId).subscribe(
      response => {
        this.user = response.user;
      },
      error => {
        this.router.navigate(['/error']);
        console.error(error);
      }
    );
  }

  submitEditProfile(form) {
    this.userService.updateUser(this.user).subscribe(
      response => {
        this.status = true;
        console.log(response);
      },
      err => {
        this.status = false;
        console.error(err);
      }
    );
  }

}
