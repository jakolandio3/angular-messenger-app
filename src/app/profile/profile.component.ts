import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  username: string | null = '';
  birthday: string | null = '';
  age: number | null = 0;
  email: string | null = '';
  valid: boolean | null = false;
}
