import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { PaginatedResult, Pagination } from './../_models/pagination';
import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from './../services/alertify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private alertify: AlertifyService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((d) => {
      this.messages = d.messages.result;
      this.pagination = d.messages.pagination;
    });
  }

  loadMessages(): void {
    this.userService
      .getMessages(
        this.auth.decodedToken.nameid,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe(
        (res: PaginatedResult<Message[]>) => {
          this.messages = res.result;
          this.pagination = res.pagination;
        },
        (err) => {
          this.alertify.error(err);
        }
      );
  }

  deleteMessage(id: number): void {
    this.alertify.confirm(
      'Are you sure you want to delete this message?',
      () => {
        this.userService
          .deleteMessage(id, this.auth.decodedToken.nameid)
          .subscribe(
            () => {
              this.messages.splice(
                this.messages.findIndex((m) => m.id === id), 1);
              this.alertify.success('Message has been deleted');
            },
            (err) => {
              this.alertify.error('Failed to delete the message');
            }
          );
      }
    );
  }

  pageChanged(e: any): void {
    this.pagination.currentPage = e.page;
    this.loadMessages();
  }
}
