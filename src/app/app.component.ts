import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CheckAuthService, role } from './service/check-auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, NgbModule],
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
    this.auth.getPermissions.subscribe(
      (val: role[]) => {
        console.log(`Permissisons: ${val}`);
        this.permissions = val;
        console.log(this.permissions);
        this.isAdmin = this.permissions?.includes('SUPERADMIN');
        this.isAdmin = this.permissions?.includes('USERADMIN');
        console.log(this.isAdmin);
      },
      (e: any) => console.log(e),
      () => {}
    );
  }

  logOut() {
    this.auth.logout();
    this.isAdmin = false;
  }
}
