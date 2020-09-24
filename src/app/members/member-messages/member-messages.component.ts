import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from './../../services/user.service';
import { AuthService } from './../../services/auth.service';
import { AlertifyService } from './../../services/alertify.service';
import { first, scan, tap } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private alertify: AlertifyService
  ) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    const currentUserId = +this.auth.decodedToken.nameid;
    this.userService.getMessageThread(this.auth.decodedToken.nameid, this.recipientId)
      .pipe(tap(ms => {
        for (const m of ms) {
          if (m.isRead === false && m.recipientId === currentUserId)
            this.userService.markAsRead(currentUserId, m.id);
        }
      }))
      .subscribe(
        (m) => {
          this.messages = m;
        },
        (err) => {
          this.alertify.error(err);
        }
      );
  }

  sendMessage(): void {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.auth.decodedToken.nameid, this.newMessage)
      .subscribe(
        (m: Message) => {
          this.messages.unshift(m);
          this.newMessage.content = '';
        },
        (err) => {
          this.alertify.error(err);
        }
      );
  }
}
