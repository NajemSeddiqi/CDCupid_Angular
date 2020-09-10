import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { AlertifyService } from './../services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(public auth: AuthService, private alertify: AlertifyService) {}

  ngOnInit(): void {}

  login(): void {
    this.auth.login(this.model).subscribe(
      (next) => {
        this.alertify.success('Logged in successfully.');
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }

  loggedIn(): boolean {
    return this.auth.loggedIn();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.alertify.message('Logget out.');
  }
}
