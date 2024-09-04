import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CheckAuthService, role } from '../service/check-auth.service';
import { GroupFunctionsService } from '../service/group-functions.service';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
})
export class GroupsComponent implements OnInit {
  permissions: any = [];
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  groupsArr: any = [];
  AllgroupsArr: any = [];

  constructor(
    private auth: CheckAuthService,
    private groups: GroupFunctionsService
  ) {
    this.auth.getPermissions.subscribe((val: role[]) => {
      this.permissions = val;
      this.isAdmin = this.permissions?.includes('SUPERADMIN' || 'USERADMIN');
      this.isSuperAdmin = this.permissions?.includes('SUPERADMIN');
    });
  }

  ngOnInit(): void {
    this.groups.getGroups().subscribe((g: any) => (this.groupsArr = g));
    this.groups.getAllGroups().subscribe((g: any) => (this.AllgroupsArr = g));
    this.groups.getAllGroups().subscribe(async (g: any) => {
      this.AllgroupsArr = g;
      this.AllgroupsArr = await this.AllgroupsArr.filter((group: any) => {
        return !this.groupsArr.some((g: any) => g.name === group.name);
      });
    });
  }
}
