import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
  public modalRef: BsModalRef;
  public statusDelete: boolean;
  public changePassword: any;
  public result: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService
  ) {
    this.url = this.userService.url;
    this.token = userService.getToken();
    this.activatedRoute.params.subscribe(params => {
      this.usernameProfile = params.username;
    });
    this.status = null;
    this.changePassword = {
      newPassword: '',
      oldPassword: '',
      repeatPassword: ''
    };
    if (!this.token) {
      this.router.navigate(['/sign-in']);
    }
  }

  ngOnInit() {
    this.getUserLoggedIn();
  }

  getUserLoggedIn() {
    this.userService.getUserById(this.userService.getUserId()).subscribe(
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

  changeAvatar(event) {
    const file: File = event.target.files[0];
    const data = new FormData();
    data.append('avatar', file);
    this.userService.updateUser(this.user, data).subscribe(
      response => {
        this.user.avatar = response.user.avatar;
        this.status = true;
      },
      err => {
        console.error(err);
        this.status = false;
      }
    );
  }

  openModalDelete(modalTemplate) {
    this.modalRef = this.modalService.show(modalTemplate,
      Object.assign({}, { class: 'modal-custom modal-custom-confirm' }));
  }

  deleteAccount() {
    this.userService.deleteUser(this.usernameProfile).subscribe(
      response => {
        this.statusDelete = true;
        localStorage.clear();
        this.modalRef.hide();
        this.router.navigate(['/sign-in']);
      },
      err => {
        this.statusDelete = false;
        console.error(err);
      }
    );
  }

  onSubmitPassword(form) {
    this.result = null;
    if (this.changePassword.newPassword === this.changePassword.repeatPassword) {
      this.userService.resetPassword(this.usernameProfile, this.changePassword).subscribe(
        response => {
          this.result = true;
          this.changePassword.newPassword = '';
          this.changePassword.oldPassword = '';
          this.changePassword.repeatPassword = '';
        },
        err => {
          console.error(err);
          this.result = false;
        }
      );
    }
  }

}
