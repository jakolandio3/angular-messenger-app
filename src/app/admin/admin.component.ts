import { Component } from '@angular/core';
import { CheckAuthService, role } from '../service/check-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  permissions: any = [];
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;

  constructor(private auth: CheckAuthService) {
    this.auth.getPermissions.subscribe((val: role[]) => {
      this.permissions = val;
      this.isAdmin = this.permissions.includes('SUPERADMIN' || 'USERADMIN');
      this.isSuperAdmin = this.permissions.includes('SUPERADMIN');
    });
  }
}
