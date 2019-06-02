import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { Publication } from 'src/app/models/publication';
import { User } from 'src/app/models/user';
import { LikeService } from '../../services/like.service';
import { CommentService } from '../../services/comment.service';
import { FollowService } from '../../services/follow.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public token: string;
  public publications: Array<Publication>;
  public user: User;
  public userLoggedIn: User;
  public usernameProfile: string;
  public counters: any;
  public url: string;
  public statusFollow: boolean;
  public modalRef: BsModalRef;
  public followeds: Array<any>;
  public followers: Array<any>;

  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private likeService: LikeService,
    private followService: FollowService,
    private commentService: CommentService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService
  ) {
    this.url = this.userService.url;
    this.token = userService.getToken();
    this.activatedRoute.params.subscribe(params => {
      this.usernameProfile = params.username;
    });
    this.statusFollow = null;
    this.publications = null;
    this.counters = {};
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
        this.userLoggedIn = response.user;
      },
      error => {
        this.router.navigate(['/error']);
        console.error(error);
      },
      () => {
        this.loadProfile();
      }
    );
  }

  loadProfile() {
    this.userService.getUser(this.usernameProfile).subscribe(
      data => {
        this.user = data.user;
        this.getCounters();
        this.loadPublications();
      },
      error => {
        console.error(error);
        this.router.navigate(['/error']);
      },
      () => {
        if (this.user._id === this.userLoggedIn._id) {
          this.statusFollow = true;
        } else {
          this.followService.getFollow(this.user.username).subscribe(
            response => {
              if (response.follow.toAccept !== false) {
                this.statusFollow = true;
              } else {
                this.statusFollow = false;
              }
            },
            err => {
              this.statusFollow = undefined;
            },
          );
        }
      }
    );
  }

  loadPublications() {
    this.publicationService.getPublicationsUser(this.usernameProfile).subscribe(
      response => {
        this.publications = response.publications;
        this.counters.publications = response.total;
      },
      err => {
        this.counters.publications = err.error.total;
        console.error(err);
      },
      () => {
        if (this.publications.length > 0) {
          this.publications.map(publication => {
            this.getLikesPublications(publication);
            this.getCommentsPublication(publication);
          });
        } else {
          this.publications = null;
        }
      }
    );
  }

  getLikesPublications(publication: Publication) {
    this.likeService.getLikesByPublication(publication._id).subscribe(
      res => {
        const index = this.publications.findIndex(x => x._id === publication._id);
        this.publications[index].likes = res.total;
      },
      error => {
        console.error(error);
      },
    );
  }

  getCommentsPublication(publication: Publication) {
    this.commentService.getCommentsPublication(publication._id).subscribe(
      response => {
        const index = this.publications.findIndex(x => x._id === publication._id);
        this.publications[index].comments = response.total;
      },
      error => {
        console.error(error);
      }
    );
  }

  getCounters() {
    this.followService.getFollowers(this.usernameProfile).subscribe(
      response => {
        this.counters.followers = response.total;
      },
      error => {
        console.error(error);
      },
      () => {
        this.followService.getFolloweds(this.usernameProfile).subscribe(
          res => {
            this.counters.followeds = res.total;
          },
          err => {
            console.error(err);
          },
        );
      }
    );
  }

  saveFollow(username: string) {
    this.followService.saveFollow(username).subscribe(
      response => {
        if (response.follow.toAccept === true) {
          this.statusFollow = true;
          this.getCounters();
          if (this.followeds != null) {
            const index = this.followeds.findIndex(x => x.followed.username === username);
            this.followeds[index].toAccept = true;
          }
          if (this.followers != null) {
            const index = this.followers.findIndex(x => x.user.username === username);
            this.followers[index].toAccept = true;
          }
        } else {
          this.statusFollow = false;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  deleteFollow(username: string) {
    this.followService.deleteFollow(username).subscribe(
      response => {
        this.statusFollow = undefined;
        this.getCounters();
        if (this.followeds != null) {
          const index = this.followeds.findIndex(x => x.followed.username === username);
          this.followeds[index].toAccept = false;
        }
        if (this.followers != null) {
          const index = this.followers.findIndex(x => x.user.username === username);
          this.followers[index].toAccept = false;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  showFolloweds(modalTemplate) {
    this.followService.getFolloweds(this.user.username).subscribe(
      response => {
        this.followeds = response.follows;
        this.modalRef = this.modalService.show(modalTemplate,
          Object.assign({}, { class: 'modal-custom modal-custom-confirm' }));
      },
      err => {
        console.error(err);
      }
    );
  }

  showFollowers(modalTemplate) {
    this.followService.getFollowers(this.user.username).subscribe(
      response => {
        this.followers = response.follows;
        this.followers.map((follow) => {
          this.onLoad(follow.user.username);
        });
      },
      err => {
        console.error(err);
      },
      () => {
        this.modalRef = this.modalService.show(modalTemplate,
          Object.assign({}, { class: 'modal-custom modal-custom-confirm' }));
      }
    );
  }

  navigateProfile(username: string) {
    this.router.navigateByUrl('/timeline', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/u/' + username]));
  }

  onLoad(username: string) {
    const index = this.followers.findIndex(x => x.user.username === username);
    if (username === this.userLoggedIn.username) {
      this.followers[index].toAccept = undefined;
    } else {
      this.followService.getFollow(username).subscribe(
        response => {
          this.followers[index].toAccept = true;
        },
        err => {
          this.followers[index].toAccept = false;
        }
      );
    }
  }

}
