import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  public user: User;
  public token: string;
  public result: boolean;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.token = userService.getToken();
    this.user = new User('', '', '', '', '', '', new Date(), '', '', '', '');
  }

  ngOnInit() {
    if (this.token) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(form) {
    this.userService.signIn(this.user).subscribe(
      response => {
        this.token = response.token;
        localStorage.setItem('ssid_session', JSON.stringify(this.token));
        localStorage.setItem('user_session', JSON.stringify(response.username));
        this.result = true;
      },
      error => {
        this.result = false;
        console.log(error);
      }
    );
  }

}
