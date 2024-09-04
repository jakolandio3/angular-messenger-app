import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CheckAuthService, role } from './service/check-auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Angular-Messenger';
  loggedIn: any;
  isAdmin: boolean = false;
  permissions: any;

  constructor(private auth: CheckAuthService) {
    this.auth.getValid.subscribe((val: any) => (this.loggedIn = val));
    this.auth.getPermissions.subscribe((val: role[]) => {
      this.permissions = val;
      this.isAdmin = this.permissions?.includes('SUPERADMIN' || 'USERADMIN');
    });
  }

  logOut() {
    this.auth.logout();
    this.isAdmin = false;
  }
}
