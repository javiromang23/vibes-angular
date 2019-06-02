import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { LikeService } from '../../services/like.service';
import { CommentService } from '../../services/comment.service';
import { Publication } from 'src/app/models/publication';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  public categories: Array<any>;
  public token: string;
  public publications: Array<Publication>;
  public userLoggedIn: User;
  public url: string;

  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private router: Router,
    private likeService: LikeService,
    private commentService: CommentService
  ) {
    this.categories = [
      'Peoplevibes',
      'Placevibes',
      'Clothesvibes',
      'Travelvibes',
      'Musicvibes'
    ];
    this.url = this.userService.url;
    this.token = userService.getToken();
    this.publications = [];
  }

  ngOnInit() {
    this.loadPublications();
  }

  loadPublications() {
    this.publicationService.getPublicationsPublic().subscribe(
      response => {
        this.publications = response.publications;
      },
      err => {
        this.publications = null;
        console.error(err);
      },
      () => {
        if (this.publications != null) {
          this.publications.map(publication => {
            this.getLikesPublications(publication);
            this.getCommentsPublication(publication);
          });
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
      }
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

}
