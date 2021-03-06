import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../sign-in/sign-in.component.css']
})
export class SignUpComponent implements OnInit {
  public user: User;
  public token: string;
  public result: boolean;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.token = userService.getToken();
    this.user = new User('', '', '', '', '', '', new Date(), '', '', '', '', null);
  }

  ngOnInit() {
    if (this.token) {
      this.router.navigate(['/sign-up']);
    }
  }

  onSubmit(form) {
    this.userService.signUp(this.user).subscribe(
      response => {
        this.token = response.token;
        localStorage.setItem('token_session', JSON.stringify(this.token));
        localStorage.setItem('ssid_session', JSON.stringify(response.userId));
        this.result = true;
      },
      error => {
        this.result = false;
        console.log(error);
      }
    );
  }

}
