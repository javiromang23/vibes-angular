import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { CommentService } from '../../services/comment.service';
import { LikeService } from '../../services/like.service';
import { Publication } from 'src/app/models/publication';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../models/user';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  public token: string;
  public publications: Array<Publication>;
  public total: string;
  public user: User;
  public comments: Array<any>;
  public userLoggedIn: User;

  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private likeService: LikeService,
    private commentService: CommentService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.token = userService.getToken();
    this.publications = [];
    this.comments = [];
    this.user = new User('', '', '', '', '', '', new Date(), '', '', '', '');
  }

  ngOnInit() {
    if (!this.token) {
      this.router.navigate(['/sign-in']);
    }
    this.getUserLoggedIn();
  }

  async getUserLoggedIn() {
    await this.userService.getUserById(this.userService.userId).subscribe(
      response => {
        this.userLoggedIn = response.user;
      },
      error => {
        console.error(error);
      },
      () => {
        this.loadProfile();
        this.loadPublications();
      }
    );
  }

  loadPublications() {
    let publications;
    this.publicationService.getPublicationsFollows().subscribe(
      response => {
        publications = response.publications;
        this.total = response.total;
      },
      error => {
        console.error(error);
      },
      () => {
        publications.map((publication, index) => {
          this.getImageFile(publication);
          this.getCommentsPublication(publication);
        });
        /* Ordenar por fecha de subida */
        this.publications.sort( (a, b) => {
          return a.createdAt.getTime() - b.createdAt.getTime();
        });
      }
    );
  }

  loadProfile() {
    this.userService.getUser(this.userLoggedIn.username).subscribe(
      data => {
        this.getAvatarUser(data.user);
        this.user = data.user;
      },
      error => {
        console.error(error);
      }
    );
  }

  getImageFile(publication: Publication) {
    this.publicationService.getImage(publication.user.username, publication.image).subscribe(
      response => {
        publication.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response));
        this.userService.getImage(publication.user.username, publication.user.avatar).subscribe(
          data => {
            publication.user.avatar = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
            this.likeService.getLikesByPublication(publication._id).subscribe(
              res => {
                publication.likes = res.total;
                this.likeService.getLikePublication(publication._id).subscribe(
                  dataResponse => {
                    publication.isLiked = true;
                  },
                  error => {
                    // console.log(error);
                    publication.isLiked = false;
                  }
                );
                this.publications.push(publication);
              },
              error => {
                console.error(error);
              }
            );
          },
          error => {
            console.error(error);
          }
        );
      },
      error => {
        console.error(error);
      }
    );
  }

  getAvatarUser(user: User) {
    this.userService.getImage(user.username, user.avatar).subscribe(
      response => {
        user.avatar = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response));
      },
      error => {
        console.error(error);
      }
    );
  }

  saveLike(publication: Publication) {
    this.likeService.saveLikePublication(publication._id).subscribe(
      response => {
        publication.likes++;
        publication.isLiked = true;
      },
      error => {
        console.error(error);
      }
    );
  }

  deleteLike(publication: Publication) {
    this.likeService.deleteLikePublication(publication._id).subscribe(
      response => {
        publication.likes--;
        publication.isLiked = false;
      },
      error => {
        console.error(error);
      }
    );
  }

  getCommentsPublication(publication: Publication) {
    this.commentService.getCommentsPublication(publication._id).subscribe(
      response => {
        this.comments[publication._id] = response.comments;
      },
      error => {
        console.error(error);
      }
    );
  }

  saveCommentPublication(publication: Publication, text: string) {
    this.commentService.saveCommentPublication(publication._id, text).subscribe(
      response => {
        this.comments[publication._id].push(response.comment);
      },
      error => {
        console.error(error);
      }
    );
  }

}
