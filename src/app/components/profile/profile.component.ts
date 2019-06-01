import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { Publication } from 'src/app/models/publication';
import { User } from 'src/app/models/user';
import { LikeService } from '../../services/like.service';
import { CommentService } from '../../services/comment.service';
import { FollowService } from '../../services/follow.service';

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

  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private likeService: LikeService,
    private followService: FollowService,
    private commentService: CommentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.url = this.userService.url;
    this.token = userService.getToken();
    this.activatedRoute.params.subscribe(params => {
      this.usernameProfile = params.username;
  });
    this.counters = {};
    this.publications = [];
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
        this.loadPublications();
      }
    );
  }

  loadProfile() {
    this.userService.getUser(this.usernameProfile).subscribe(
      data => {
        this.user = data.user;
        this.getCounters();
      },
      error => {
        console.error(error);
        this.router.navigate(['/error']);
      }
    );
  }

  loadPublications() {
    let publications;
    this.publicationService.getPublicationsUser(this.usernameProfile).subscribe(
      response => {
        publications = response.publications;
        this.counters.publications = response.total;
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

  getLikesPublications(publication: Publication) {
    this.likeService.getLikesByPublication(publication._id).subscribe(
      res => {
        publication.likes = res.total;
      },
      error => {
        console.error(error);
      },
    );
    this.publications.push(publication);
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
          }
        );
      }
    );
  }

}
