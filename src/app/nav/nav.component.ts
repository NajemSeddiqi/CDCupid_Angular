import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  login(): void {
    this.auth.login(this.model).subscribe(
      (next) => {
        console.log('Logged in successfully.');
      },
      (error) => {
        console.log('Failed to login.');
      }
    );
  }

  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    console.log('Logget out.');
  }
}
