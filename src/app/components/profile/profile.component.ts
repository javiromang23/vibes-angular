import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { Publication } from 'src/app/models/publication';
import { User } from 'src/app/models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { LikeService } from '../../services/like.service';
import { CommentService } from '../../services/comment.service';

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
    private likeService: LikeService,
    private commentService: CommentService,
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
    this.publications = [];
  }

  ngOnInit() {
    if (!this.token) {
      this.router.navigate(['/sign-in']);
    }
    this.loadProfile();
    this.loadPublications();
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

  loadPublications() {
    let publications;
    this.publicationService.getPublicationsUser(this.username).subscribe(
      response => {
        publications = response.publications;
      },
      error => {
        console.log(error);
      },
      () => {
        publications.map((publication, index) => {
          this.getImageFile(publication);
        });
        /* Ordenar por fecha de subida */
        this.publications.sort( (a, b) => {
          return a.createdAt.getTime() - b.createdAt.getTime();
        });
      }
    );
  }

  getImageFile(publication: Publication) {
    this.publicationService.getImage(publication.user.username, publication.image).subscribe(
      data => {
        publication.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
        this.likeService.getLikesByPublication(publication._id).subscribe(
          res => {
            publication.likes = res.total;
          },
          error => {
            console.log(error);
          }
        );
        this.getCommentsPublication(publication);
      },
      error => {
        console.log(error);
      },
    );
  }

  getCommentsPublication(publication: Publication) {
    this.commentService.getCommentsPublication(publication._id).subscribe(
      response => {
        publication.comments = response.total;
        this.publications.push(publication);
      },
      error => {
        console.log(error);
      }
    );
  }


}
