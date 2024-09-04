import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CheckAuthService } from './service/check-auth.service';

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

  constructor(private auth: CheckAuthService) {
    this.auth.getValid.subscribe((val: any) => (this.loggedIn = val));
  }
  logOut() {
    this.auth.logout();
  }
}
