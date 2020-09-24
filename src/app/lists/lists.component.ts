import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../_models/user';
import { PaginatedResult, Pagination } from './../_models/pagination';
import { ActivatedRoute } from '@angular/router';
import { UserParams } from './../_models/userParams';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;
  userParams: UserParams = { gender: 'all', minAge: 18, maxAge: 99, orderBy: 'lastActive' };

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((d) => {
      this.users = d.users.result;
      this.pagination = d.users.pagination;
    });
    this.likesParam = 'Likers';
  }

  loadUsers(): void {
    this.userService
      .getUsers(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.userParams,
        this.likesParam
      )
      .subscribe(
        (res: PaginatedResult<User[]>) => {
          this.users = res.result;
          this.pagination = res.pagination;
        },
        (err) => {
          this.alertify.error(err);
        }
      );
  }

  pageChanged(e: any): void {
    this.pagination.currentPage = e.page;
    this.loadUsers();
  }
}
