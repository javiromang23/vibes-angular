import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-upload-publication',
  templateUrl: './upload-publication.component.html',
  styleUrls: ['../timeline/timeline.component.css']
})
export class UploadPublicationComponent implements OnInit {

  public token: string;
  public user: User;
  public url: string;
  public publication: any;
  public imagePreview: any;
  public categories: Array<string>;

  constructor(
    private userService: UserService,
    private router: Router,
    private publicationService: PublicationService
  ) {
    this.url = this.userService.url;
    this.token = this.userService.getToken();
    this.user = null;
    this.publication = {
      description: '',
      category: 'unspecified'
    };
    this.categories = [
        'Peoplevibes',
        'Placevibes',
        'Clothesvibes',
        'Travelvibes',
        'Musicvibes'
    ];
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
        this.user = response.user;
      },
      error => {
        this.user = null;
        this.router.navigate(['/error']);
        console.log(error);
      }
    );
  }

  readImagePreview(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  uploadPublication(input) {
    const reader = new FileReader();
    const image: any = input.files[0];
    const data = new FormData();
    data.append('image', image);
    data.append('description', this.publication.description);
    data.append('category', this.publication.category);

    this.publicationService.uploadPublication(data).subscribe(
      response => {
        this.router.navigate(['/p/', response.publication._id]);
      },
      error => {
        console.error(error);
      }
    );

  }

}
