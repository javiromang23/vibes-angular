import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { Publication } from 'src/app/models/publication';
import { User } from 'src/app/models/user';
import { DomSanitizer } from '@angular/platform-browser';
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
  public usernameLoggedIn: string;
  public usernameProfile: string;
  public counters: any;

  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private likeService: LikeService,
    private followService: FollowService,
    private commentService: CommentService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute
  ) {
    this.token = userService.getToken();
    this.usernameLoggedIn = userService.getUsernameStored();
    this.activatedRoute.params.subscribe(params => {
      this.usernameProfile = params.username;
      console.log(params);
  });
    this.counters = {};
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
    this.userService.getUser(this.usernameProfile).subscribe(
      data => {
        this.getAvatarUser(data.user);
        this.user = data.user;
        this.getCounters();
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
    this.publicationService.getPublicationsUser(this.usernameProfile).subscribe(
      response => {
        publications = response.publications;
        this.counters.publications = response.total;
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

  getCounters() {
    this.followService.getFollowers(this.usernameProfile).subscribe(
      response => {
        this.counters.followers = response.total;
      },
      error => {
        console.log(error);
      },
      () => {
        this.followService.getFolloweds(this.usernameProfile).subscribe(
          res => {
            this.counters.followeds = res.total;
          },
          err => {
            console.log(err);
          }
        );
      }
    );
  }


}
