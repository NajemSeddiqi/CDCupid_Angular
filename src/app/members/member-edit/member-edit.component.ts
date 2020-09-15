import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { User } from './../../_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from './../../services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', { static: true }) editForm: NgForm;
  user: User;
  photoUrl: string;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((d) => (this.user = d.user));
    this.auth.currentPhotoUrl.subscribe((url) => (this.photoUrl = url));
  }

  updateUser(): void {
    this.userService
      .updateUserById(this.auth.decodedToken.nameid, this.user)
      .subscribe(
        () => {
          this.alertify.success('Profile updated successfully.');
          this.editForm.reset(this.user);
        },
        (err) => {
          this.alertify.error(err);
        }
      );
  }

  updateMainPhoto(photoUrl: string): void {
    this.user.photoUrl = photoUrl;
  }
}
