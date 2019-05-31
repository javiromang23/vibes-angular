import { Component, OnInit, ContentChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { Publication } from 'src/app/models/publication';
import { LikeService } from '../../services/like.service';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';
import { User } from '../../models/user';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['../timeline/timeline.component.css']
})
export class PublicationComponent implements OnInit {
  public token: string;
  public publication: Publication;
  public publicationActivated: string;
  public url: string;
  public comments: Array<Comment>;
  public user: User;
  public modalRef: BsModalRef;
  public statusDelete: boolean;

  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private likeService: LikeService,
    private commentService: CommentService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
  ) {
    this.url = this.userService.url;
    this.token = userService.getToken();
    this.activatedRoute.params.subscribe(params => {
      this.publicationActivated = params.publication;
    });
    this.publication = null;
    this.comments = [];
    if (!this.token) {
      this.router.navigate(['/sign-in']);
    }
  }

  ngOnInit() {
    this.getPublicationActivated();
    this.getUserLoggedIn();
  }

  getUserLoggedIn() {
    this.userService.getUserById(this.userService.getUserId()).subscribe(
      response => {
        this.user = response.user;
      },
      error => {
        this.user = null;
        this.router.navigate(['/sign-in']);
        console.log(error);
      }
    );
  }

  getPublicationActivated() {
    this.publicationService.getPublication(this.publicationActivated).subscribe(
      response => {
        this.publication = response.publication;
        this.getLikesPublications();
        this.getCommentsPublication();
      },
      err => {
        console.error(err);
      }
    );
  }

  getLikesPublications() {
    this.likeService.getLikesByPublication(this.publication._id).subscribe(
      res => {
        this.publication.likes = res.total;
      },
      err => {
        console.error(err);
      },
      () => {
        this.likeService.getLikePublication(this.publication._id).subscribe(
          data => {
            this.publication.isLiked = true;
          },
          err => {
            console.error(err);
            this.publication.isLiked = false;
          },
        );
      }
    );
  }

  getCommentsPublication() {
    this.commentService.getCommentsPublication(this.publication._id).subscribe(
      response => {
        this.comments = response.comments;
      },
      err => {
        console.error(err);
      }
    );
  }

  saveLike(publication: Publication) {
    this.likeService.saveLikePublication(publication._id).subscribe(
      response => {
        publication.likes++;
        publication.isLiked = true;
      },
      err => {
        console.error(err);
      }
    );
  }

  deleteLike(publication: Publication) {
    this.likeService.deleteLikePublication(publication._id).subscribe(
      response => {
        publication.likes--;
        publication.isLiked = false;
      },
      err => {
        console.error(err);
      }
    );
  }

  saveCommentPublication(publication: Publication, text: string) {
    this.commentService.saveCommentPublication(publication._id, text).subscribe(
      response => {
        this.comments.unshift(response.comment);
      },
      err => {
        console.error(err);
      }
    );
  }

  dblclick(id) {
    this.likeService.getLikePublication(id).subscribe(
      response => {
        this.likeService.deleteLikePublication(id).subscribe(
          data => {
            this.publication.likes--;
            this.publication.isLiked = false;
          },
          err => {
            console.error(err);
          }
        );
      },
      error => {
        this.likeService.saveLikePublication(id).subscribe(
          data => {
            this.publication.likes++;
            this.publication.isLiked = true;
          },
          err => {
            console.error(err);
          }
        );
      }
    );
  }

  openModalDelete(modalTemplate) {
    this.modalRef = this.modalService.show(modalTemplate,
      Object.assign({}, { class: 'modal-custom modal-custom-confirm' }));
  }

  deletePublication() {
    this.publicationService.deletePublication(this.publication._id).subscribe(
      reponse => {
        this.statusDelete = true;
        this.modalRef.hide();
        this.router.navigate(['/timeline']);
      },
      err => {
        this.statusDelete = false;
        console.error(err);
      }
    );
  }

}
