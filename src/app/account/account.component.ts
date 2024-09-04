import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  onUpdate() {}
}
