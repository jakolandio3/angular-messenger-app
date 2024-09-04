import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckAuthService, userObj } from '../service/check-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = 'Incorrect Email or Password';
  error = false;
  user: any = null;
  constructor(private router: Router, private auth: CheckAuthService) {}
  loginFn() {
    this.auth.checkPermissions();
    this.auth.getPermissions.subscribe((e: any) => console.log(e));
    if (this.email === '' || this.password === '') {
      this.error = true;
      this.errorMsg = 'Please Enter Both an Email and a Password';
      return;
    }
    this.auth
      .login({
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
            this.auth.saveToSessionStorage('groups', res.groups);
            this.auth.saveToSessionStorage('roles', res.roles);

            this.auth.checkIsValid();
            this.router.navigate(['/auth/home']);
          } else {
            this.error = true;
            this.errorMsg = 'Incorrect Email or Password';
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
