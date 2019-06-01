import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  public userLoggedIn: User;
  public statusSearch: boolean;
  public users: Array<User>;
  public url: string;
  public follows: Array<any>;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
    this.url = this.userService.url;
    this.userLoggedIn = new User('', '', '', '', '', '', new Date(), '', '', '', '', null);
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
        this.userLoggedIn = null;
        this.router.navigate(['/error']);
        console.log(error);
      }
    );
  }

  logOut() {
    console.clear();
    localStorage.clear();
    this.router.navigate(['/sign-in']);
  }

  searchUser(ev) {
    const value = ev.target.value;
    this.statusSearch = true;
    this.userService.searchUsers(value).subscribe(
      res => {
        this.users = res.users;
        if (this.users.length === 0) {
          this.users = null;
        }
        this.follows = res.follows;
      },
      err => {
        this.users = null;
        console.error(err);
        console.clear();
      },
      () => {
        this.follows.map((follow) => {
          const index = this.users.findIndex(x => x._id === follow.followed);
          this.users[index].isFollowed = true;
        });
        console.clear();
      }
    );
  }

  closeSearch(ev) {
    this.statusSearch = false;
    this.users = null;
    ev.target.parentNode.parentNode.parentNode.children[0].value = '';
  }

  navigateProfile(username: string) {
    this.router.navigateByUrl('/timeline', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/u/' + username]));
  }

}
