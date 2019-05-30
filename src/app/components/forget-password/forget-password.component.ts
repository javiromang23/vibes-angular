import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['../sign-in/sign-in.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  public token: string;
  public result: boolean;
  public user: any;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.token = userService.getToken();
  }

  ngOnInit() {
    if (this.token) {
      this.router.navigate(['/timeline']);
    }
    this.user = { email: '' };
  }

  onSubmit(form) {
    this.userService.sendEmailResetPassword(this.user.email).subscribe(
      response => {
        console.log(response);
        this.result = true;
      },
      error => {
        this.result = false;
        console.log(error);
      }
    );
  }

}
