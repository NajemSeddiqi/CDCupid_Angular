import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode = false;

  constructor(public auth: AuthService) { }

  ngOnInit(): void { }

  registerToggle(): void {
    this.registerMode = true;
  }

  cancelRegisterMode(registerMode: boolean): void {
    this.registerMode = registerMode;
  }

  loggedIn(): boolean {
    return this.auth.loggedIn();
  }

}
