import { Component } from '@angular/core';
import { CheckAuthService, role } from '../service/check-auth.service';
import { CommonModule } from '@angular/common';
import { GroupFunctionsService } from '../service/group-functions.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  permissions: any = [];
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  newGroupName: string = '';

  constructor(
    private auth: CheckAuthService,
    private groupservice: GroupFunctionsService
  ) {
    this.auth.getPermissions.subscribe((val: role[]) => {
      this.permissions = val;
      this.isAdmin = this.permissions.includes('SUPERADMIN' || 'USERADMIN');
      this.isSuperAdmin = this.permissions.includes('SUPERADMIN');
    });
  }

  createNewGroup() {
    this.groupservice.createNewGroup(this.newGroupName).subscribe();
  }
}
