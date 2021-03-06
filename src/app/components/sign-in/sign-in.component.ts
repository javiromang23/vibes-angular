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
    this.user = new User('', '', '', '', '', '', new Date(), '', '', '', '', null);
  }

  ngOnInit() {
    if (this.token) {
      this.router.navigate(['/timeline']);
    }
  }

  onSubmit(form) {
    this.userService.signIn(this.user).subscribe(
      response => {
        this.token = response.token;
        localStorage.setItem('token_session', JSON.stringify(this.token));
        localStorage.setItem('ssid_session', JSON.stringify(response.userId));
        this.result = true;
        this.router.navigate(['/timeline']);
      },
      error => {
        this.result = false;
        console.log(error);
      }
    );
  }

}
