import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResult, Pagination } from './../../_models/pagination';
import { UserParams } from './../../_models/userParams';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));

  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];

  userParams: UserParams;
  pagination: Pagination;

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((d) => {
      this.users = d.users.result;
      this.pagination = d.users.pagination;
    });

    this.setUserParams();
  }

  pageChanged(e: any): void {
    this.pagination.currentPage = e.page;
    this.loadUsers();
  }

  resetFilters(): void {
    this.setUserParams();
    this.loadUsers();
  }

  setUserParams(): void {
    this.userParams = {
      gender: this.user.gender === 'female' ? 'male' : 'female',
      minAge: 18,
      maxAge: 99,
      orderBy: 'lastActive',
    };
  }

  loadUsers(): void {
    this.userService
      .getUsers(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.userParams
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
}
