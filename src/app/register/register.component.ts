import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { AlertifyService } from './../services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private auth: AuthService, private alertify: AlertifyService) {}

  ngOnInit(): void {}

  register(): void {
    this.auth.register(this.model).subscribe(
      () => {
        this.alertify.success('Registration successful');
      },
      (err) => {
        this.alertify.error(err);
      }
    );
  }

  cancel(): void {
    this.cancelRegister.emit(false);
    this.alertify.message('Cancelled');
  }
}
