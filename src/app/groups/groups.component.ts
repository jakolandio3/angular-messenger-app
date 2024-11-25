import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CheckAuthService, role } from '../service/check-auth.service';
import { GroupFunctionsService } from '../service/group-functions.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
})
export class GroupsComponent implements OnInit {
  permissions: any = [];
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  groupsArr: any = [];
  AllgroupsArr: any = [];
  selectedChannel: string[] = [];
  serverMessage: string = '';
  messageAlert: boolean = false;

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
    this.groups.getAllGroups().subscribe(
      async (g: any) => {
        this.AllgroupsArr = g;
        this.AllgroupsArr = await this.AllgroupsArr.filter((group: any) => {
          return !this.groupsArr.some((g: any) => g.name === group.name);
        });
      },
      (e: any) => console.log(e),
      () => {
        for (let i = 0; i < this.groupsArr.length; i++) {
          this.selectedChannel[i] = '';
        }
      }
    );
  }

  onLeaveGroup(groupID: string): void {
    this.groups.leaveGroup(groupID).subscribe(
      (val: any) => {
        if (val?.ok) {
          this.messageAlert = true;
          this.serverMessage = val.message;
          return;
        }
        this.messageAlert = true;
        this.serverMessage = val.error;
      },
      (e: any) => console.log(e),
      () => {
        this.ngOnInit();
      }
    );
  }
  onRequestJoinGroup(groupID: string): void {
    this.groups.requestJoinGroup(groupID).subscribe(
      (val: any) => {
        if (val?.ok) {
          this.messageAlert = true;
          this.serverMessage = val.message;
          return;
        }
        this.messageAlert = true;
        this.serverMessage = val.error;
      },
      (e: any) => console.log(e),
      () => {
        this.ngOnInit();
      }
    );
  }
}
