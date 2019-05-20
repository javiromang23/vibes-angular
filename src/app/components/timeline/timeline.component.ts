import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { Publication } from 'src/app/models/publication';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  public token: string;
  public publications: Array<Publication>;
  public url: string;
  public total: string;
  public user: User;

  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.token = userService.getToken();
    this.url = this.publicationService.url;
    this.publications = [];
  }

  ngOnInit() {
    if (!this.token) {
      this.router.navigate(['/sign-in']);
    }
    this.loadPublications();
    this.loadProfile();
  }

  loadPublications() {
    let publications;
    this.publicationService.getPublicationsFollows().subscribe(
      response => {
        publications = response.publications;
        this.total = response.total;
      },
      error => {
        console.log(error);
      },
      () => {
        publications.map((publication, index) => {
          this.getImageFile(publication, index);
        });
      }
    );
  }

  loadProfile() {
    this.userService.getUser(this.userService.getUsernameStored()).subscribe(
      data => {
        console.log(data);
        this.user = data.user;
      },
      error => {
        console.log(error);
      }
    );
  }

  getImageFile(publication: Publication, index) {
    this.publicationService.getImage(publication.user.username, publication.image).subscribe(
      response => {
        publication.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response));
        this.userService.getImage(publication.user.username, publication.user.avatar).subscribe(
          data => {
            publication.user.avatar = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
            this.publications.push(publication);
          },
          error => {
            console.log(error);
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  }

}
