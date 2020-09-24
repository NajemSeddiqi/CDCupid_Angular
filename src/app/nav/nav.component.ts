import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { AlertifyService } from './../services/alertify.service';
import { Router } from '@angular/router';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;
  unreadMessages: number;

  constructor(
    public auth: AuthService,
    private alertify: AlertifyService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.auth.currentPhotoUrl.subscribe((url) => (this.photoUrl = url));
    this.auth.amount.subscribe(msg => this.unreadMessages = msg);
  }

  login(): void {
    this.auth.login(this.model).subscribe(
      (next) => {
        this.alertify.success('Logged in successfully.');
      },
      (error) => {
        this.alertify.error(error);
      },
      () => {
        this.router.navigate(['/members']);
      }
    );
  }

  loggedIn(): boolean {
    return this.auth.loggedIn();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.auth.decodedToken = null;
    this.auth.currentUser = null;
    this.alertify.message('Logget out.');
    this.router.navigate(['/homr']);
  }
}
