import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { Publication } from 'src/app/models/publication';
import { User } from 'src/app/models/user';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public token: string;
  public publications: Array<Publication>;
  public user: User;
  public username: string;
  public counters: any;

  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.token = userService.getToken();
    this.username = userService.getUsernameStored();
    this.counters = {
      publications: 4,
      followers: 4,
      follows: 20
    };
  }

  ngOnInit() {
    if (!this.token) {
      this.router.navigate(['/sign-in']);
    }
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getUser(this.userService.getUsernameStored()).subscribe(
      data => {
        this.getAvatarUser(data.user);
        this.user = data.user;
      },
      error => {
        console.log(error);
      }
    );
  }

  getAvatarUser(user: User) {
    this.userService.getImage(user.username, user.avatar).subscribe(
      response => {
        user.avatar = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response));
      },
      error => {
        console.log(error);
      }
    );
  }

}
