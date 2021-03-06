import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { CommentService } from '../../services/comment.service';
import { LikeService } from '../../services/like.service';
import { Publication } from 'src/app/models/publication';
import { User } from '../../models/user';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification';

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
  public url: string;
  public notifications: any;

  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private likeService: LikeService,
    private commentService: CommentService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.url = this.userService.url;
    this.token = userService.getToken();
    this.publications = [];
    this.comments = [];
    this.user = new User('', '', '', '', '', '', new Date(), '', '', '', '', null);
    if (!this.token) {
      this.router.navigate(['/sign-in']);
    }
  }

  ngOnInit() {
    this.getUserLoggedIn();
    this.getNotifications();
  }

  async getUserLoggedIn() {
    await this.userService.getUserById(this.userService.getUserId()).subscribe(
      response => {
        this.userLoggedIn = response.user;
        this.loadProfile();
        this.loadPublications();
      },
      error => {
        this.router.navigate(['/sign-in']);
        console.error(error);
      }
    );
  }

  loadPublications() {
    let publications;
    this.publicationService.getPublicationsFollows().subscribe(
      response => {
        publications = response.publications;
        this.total = response.total;
        publications.map((publication, index) => {
          this.getLikesPublications(publication);
          this.getCommentsPublication(publication);
        });
      },
      error => {
        this.publications = null;
        console.error(error);
      }
    );
  }

  loadProfile() {
    this.userService.getUser(this.userLoggedIn.username).subscribe(
      data => {
        this.user = data.user;
      },
      error => {
        console.error(error);
      }
    );
  }

  getNotifications() {
    this.notificationService.getNotificationByUser().subscribe(
      data => {
        this.notifications = data['notifications'];
      },
      err => {
        console.error(err);
      }
    );
  }

  getLikesPublications(publication: Publication) {
    this.likeService.getLikesByPublication(publication._id).subscribe(
      res => {
        publication.likes = res.total;
      },
      error => {
        console.error(error);
      },
      () => {
        this.likeService.getLikePublication(publication._id).subscribe(
          data => {
            publication.isLiked = true;
          },
          error => {
            console.error(error);
            publication.isLiked = false;
          },
        );
      }
    );
    this.publications.push(publication);
  }

  saveLike(publication: Publication) {
    this.likeService.saveLikePublication(publication._id).subscribe(
      response => {
        publication.likes++;
        publication.isLiked = true;
        if (this.user._id !== publication.user._id) {
          const notification = new Notification(undefined, undefined, undefined, new Date(), '', undefined);
          notification.fromUser = this.user;
          notification.message = `A ${this.user.username} le ha gustado tu publicación.`;
          notification.publication = publication;
          notification.user = publication.user;
          this.notificationService.saveNotification(notification).subscribe(
            data => {
            },
            err => {
              console.error(err);
            }
          );
        }
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
        const index = this.publications.findIndex(x => x._id === publication._id);
        this.comments[publication._id] = response.comments;
        publication.comments = response.total;
        this.publications[index] = publication;
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
        if (this.user._id !== publication.user._id) {
          const notification = new Notification(undefined, undefined, undefined, new Date(), '', undefined);
          notification.fromUser = this.user;
          notification.message = `${this.user.username} ha comentado en tu publicación.`;
          notification.publication = publication;
          notification.user = publication.user;
          this.notificationService.saveNotification(notification).subscribe(
            data => {
            },
            err => {
              console.error(err);
            }
          );
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  dblclick(id) {
    const index = this.publications.findIndex(x => x._id === id);

    this.likeService.getLikePublication(id).subscribe(
      response => {
        this.likeService.deleteLikePublication(id).subscribe(
          data => {
            this.publications[index].likes--;
            this.publications[index].isLiked = false;
          },
          err => {
            console.error(err);
          }
        );
      },
      error => {
        this.likeService.saveLikePublication(id).subscribe(
          data => {
            this.publications[index].likes++;
            this.publications[index].isLiked = true;
            if (this.user._id !== this.publications[index].user._id) {
              const notification = new Notification(undefined, undefined, undefined, new Date(), '', undefined);
              notification.fromUser = this.user;
              notification.message = `A ${this.user.username} le ha gustado tu publicación.`;
              notification.publication = this.publications[index];
              notification.user = this.publications[index].user;
              this.notificationService.saveNotification(notification).subscribe(
                res => {
                },
                err => {
                  console.error(err);
                }
              );
            }
          },
          err => {
            console.error(err);
          }
        );
      }
    );
  }

}
