import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from './../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  register(): void {
    this.auth.register(this.model).subscribe(
      () => {
        console.log('Registration successful');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  cancel(): void {
    this.cancelRegister.emit(false);
    console.log('Cancelled');
  }
}
