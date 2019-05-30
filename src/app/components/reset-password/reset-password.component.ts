import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../sign-in/sign-in.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public token: string;
  public result: boolean;
  public user: any;
  public hash: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.token = userService.getToken();
  }

  ngOnInit() {
    if (this.token) {
      this.router.navigate(['/timeline']);
    }
    this.user = { newPassword: null, repeatPassword: null};
    this.activatedRoute.params.subscribe(params => {
      this.hash = params.hash;
    });
    this.checkHash();
  }

  onSubmit(form) {
    if (this.user.newPassword === this.user.repeatPassword) {
      this.userService.resetPasswordByEmail(this.user.newPassword, this.hash).subscribe(
        response => {
          this.result = true;
        },
        error => {
          this.result = false;
          console.log(error);
        }
      );
    } else {
      this.result = false;
    }
  }

  checkHash() {
    this.userService.checkResetPassword(this.hash).subscribe(
      res => {
      },
      error => {
        this.router.navigate(['/error']);
      }
    );
  }

}
