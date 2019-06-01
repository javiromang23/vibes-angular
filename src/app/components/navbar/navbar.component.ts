import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { FollowService } from '../../services/follow.service';

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
    private followService: FollowService
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
          if (follow.toAccept === true ) {
            this.users[index].isFollowed = true;
          } else {
            this.users[index].isFollowed = false;
          }
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

  saveFollow(username: string) {
    this.followService.saveFollow(username).subscribe(
      response => {
        if (response.follow.toAccept === true) {
          const index = this.users.findIndex(x => x.username === username);
          this.users[index].isFollowed = true;
        } else {
          const index = this.users.findIndex(x => x.username === username);
          this.users[index].isFollowed = false;
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
        const index = this.users.findIndex(x => x.username === username);
        this.users[index].isFollowed = undefined;
      },
      err => {
        console.error(err);
      }
    );
  }

}
