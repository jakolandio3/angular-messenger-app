import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckAuthService, userObj } from '../service/check-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {
  username: string | null = '';
  email: string | null = '';
  valid: boolean | null = false;
  UUID: number | null = null;
  isLoading: boolean = false;
  Updated: boolean = false;
  newPassword: string = '';
  updatedAccount: any = {};
  error: boolean = false;

  constructor(private auth: CheckAuthService, private router: Router) {
    this.username = this.auth.getFromSessionStorage('username');
    this.UUID = Number(this.auth.getFromSessionStorage('UUID'));
    this.email = this.auth.getFromSessionStorage('email');
    this.auth.getValid.subscribe((val: any) => (this.valid = val));
  }
  ngOnInit(): void {
    if (!this.valid) {
      this.router.navigate(['/login']);
    }
  }
  onUpdate() {
    this.isLoading = true;
    if (this.newPassword === '') {
      alert('Password has not been changed');
      this.updatedAccount = {
        username: this.username,
        email: this.email,
        UUID: this.UUID,
      };
    } else {
      this.updatedAccount = {
        username: this.username,
        email: this.email,
        UUID: this.UUID,
        password: this.newPassword,
      };
    }
    if (confirm('Are you sure you want to update your details?')) {
      console.log(this.updatedAccount);
      console.log('what');
      this.auth.updateUser(this.updatedAccount).subscribe((res: userObj) => {
        if (res.valid) {
          this.error = false;
          this.auth.saveToSessionStorage('username', res.username);
          this.auth.saveToSessionStorage('email', res.email);
          this.auth.saveToSessionStorage('valid', res.valid);
          this.auth.saveToSessionStorage('UUID', res.UUID);
          this.auth.saveToSessionStorage('Groups', res.groups);
          this.auth.saveToSessionStorage('Roles', res.roles);

          this.Updated = true;
          this.isLoading = false;
        } else {
          this.error = true;
          this.auth.clearSessionStorage();
          this.isLoading = false;
        }
      });
    }
  }
}
