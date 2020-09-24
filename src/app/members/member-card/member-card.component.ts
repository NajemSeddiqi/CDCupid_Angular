import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { AlertifyService } from './../../services/alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) { }

  ngOnInit(): void { }

  sendLike(id: number): void {
    this.userService.sendLike(this.auth.decodedToken.nameid, id).subscribe(
      () => {
        this.alertify.success('You have liked: ' + this.user.knownAs);
      },
      (err) => {
        this.alertify.error(err);
      }
    );
  }
}
