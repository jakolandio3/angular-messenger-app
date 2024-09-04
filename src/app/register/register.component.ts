import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CheckAuthService, userObj } from '../service/check-auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email = '';
  password = '';
  errorMsg = 'Incorrect Email or Password';
  error = false;
  user: any = null;
  constructor(private auth: CheckAuthService, private router: Router) {}

  reginsterFn() {
    if (this.email === '' || this.password === '') {
      this.error = true;
      this.errorMsg = 'Please Enter Both an Email and a Password';
      return;
    }
    this.auth
      .CreateUser({
        email: this.email,
        pwd: this.password,
      })
      .subscribe(
        (res: userObj) => {
          if (res.valid) {
            this.error = false;
            this.auth.saveToSessionStorage('username', res.username);
            this.auth.saveToSessionStorage('email', res.email);
            this.auth.saveToSessionStorage('valid', res.valid);
            this.auth.saveToSessionStorage('UUID', res.UUID);
            this.auth.saveToSessionStorage('Groups', res.groups);
            this.auth.saveToSessionStorage('Roles', res.roles);

            this.auth.checkIsValid();
            this.router.navigate(['/auth/home']);
          } else {
            this.error = true;
            this.errorMsg = 'User Already Exists';
            this.auth.clearSessionStorage();
            this.auth.checkIsValid();
          }
        },
        (e) => {
          if (e.statusText === 'Unknown Error') {
            this.errorMsg = `${e.name}: Can't connect to Server`;
          } else this.errorMsg = `${e.name}: ${e.statusText}`;

          this.error = true;
        }
      );
  }
}
