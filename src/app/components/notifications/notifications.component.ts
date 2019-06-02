import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { FollowService } from '../../services/follow.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['../timeline/timeline.component.css']
})
export class NotificationsComponent implements OnInit {
  public userLoggedIn: User;
  public url: string;
  public follows: Array<any>;
  public notifications: any;
  public statusNotification: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private followService: FollowService,
    private notificationService: NotificationService
  ) {
    this.url = this.userService.url;
    this.userLoggedIn = new User('', '', '', '', '', '', new Date(), '', '', '', '', null);
    this.statusNotification = false;
  }

  ngOnInit() {
    this.getUserLoggedIn();
    this.getNotifications();
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

}
