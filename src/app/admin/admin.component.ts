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
  error: boolean = false;
  updated: boolean = false;
  alertMessage: string = '';
  groupList: any = [];
  channelList: any = [];
  adminMessages: string[] = ['Hello', 'secondmessage'];
  permissions: any = [];
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  newGroupName: string = '';
  currentGroup: any = '';
  groupSelected: boolean = false;
  currentChannel: any = '';
  channelSelected: boolean = false;
  currentChannelName: string = '';
  newChannelName: string = '';
  currentUser: any = { UUID: '', name: '' };
  currentGroupUser: any = { UUID: '', name: '' };
  userSelected: boolean = false;
  groupUserSelected: boolean = false;
  isDeleteUser: boolean = false;
  isPromoteToSuper: boolean = false;
  isPromoteToAdmin: boolean = false;
  selectedAdminGroup: any = '';
  hasSelectedNewAdmin: boolean = false;
  selectedGroupDetails: any = {};
  isAddUserToGroup: boolean = false;
  adminUserList: any;
  selectedGroupAdmins: any = [];
  userToAdd: string = '';
  requestUserSelected: boolean = false;
  selectedUserisGroupAdmin: boolean = false;
  nameOfUser: string = '';
  userToUpgrade: string = '';

  constructor(
    private auth: CheckAuthService,
    private groupservice: GroupFunctionsService
  ) {
    this.auth.getPermissions.subscribe((val: role[]) => {
      this.permissions = val;
      this.isAdmin = this.permissions.includes('SUPERADMIN' || 'USERADMIN');
      this.isSuperAdmin = this.permissions.includes('SUPERADMIN');
    });
    this.groupservice
      .getAllGroups()
      .subscribe((val: any) => this.groupList.push(...val));
    console.log(this.groupList);
    if (this.isAdmin) {
      this.auth.getUserList().subscribe((users: any) => {
        this.adminUserList = users;
      });
    }
  }

  createNewGroup() {
    this.groupservice.createNewGroup(this.newGroupName).subscribe(() => {
      this.alertMessage = `${this.newGroupName} was created`;
      this.updated = true;
      this.newGroupName = '';
      this.groupservice.getAllGroups().subscribe((val: any) => {
        this.groupList = [];
        this.groupList.push(...val);
      });
      this.groupSelected = false;
      this.currentGroup = '';
    });
  }

  deleteGroup() {
    console.log('help me genie');
    this.groupservice.deleteGroup(this.currentGroup.UUID).subscribe(() => {
      this.alertMessage = `${this.currentGroup.name} was deleted`;
      this.currentGroup = '';
      this.updated = true;
      this.groupSelected = false;
      this.groupservice.getAllGroups().subscribe((val: any) => {
        this.groupList = [];
        this.groupList.push(...val);
        console.log('milk');
      });
    });
    console.log('run after');
  }

  onSelectGroup(value: any) {
    this.channelSelected = false;
    this.currentChannel = '';
    this.channelSelected = false;
    this.currentChannelName = '';
    this.newChannelName = '';
    this.selectedGroupAdmins = [];
    this.currentUser = { UUID: '', name: '' };
    this.currentGroupUser = { UUID: '', name: '' };
    this.groupUserSelected = false;
    this.currentGroup = this.groupList.filter(
      (group: any) => group.name === value
    )[0];
    this.groupservice
      .getGroupByID(this.currentGroup.UUID)
      .subscribe((val: any) => {
        this.selectedGroupDetails = val[0];
        if (val[0]?.admins?.length > 0) {
          for (let i = 0; i < val[0].admins.length; i++) {
            this.groupservice
              .getUserByID(this.selectedGroupDetails.admins[i])
              .subscribe((name: string) => {
                if (!value.error) {
                  this.selectedGroupAdmins.push(name);
                }
              });
          }
        }
        this.channelList = this.selectedGroupDetails.channels;
      });
    this.groupSelected = true;
    console.log(this.selectedGroupDetails);
  }
  onJoinRequest(id: string) {
    this.requestUserSelected = true;
    this.userToAdd = id;
  }
  onSelectUserGroup(value: any) {
    this.selectedUserisGroupAdmin = false;
    console.log(value);
    this.currentGroupUser.UUID = value;
    this.groupservice.getUserByID(value).subscribe((val: any) => {
      if (!val.error) {
        this.currentGroupUser.name = val;
        this.groupUserSelected = true;
        if (this.selectedGroupAdmins.includes(val)) {
          this.selectedUserisGroupAdmin = true;
        }
      } else {
        this.groupUserSelected = false;
        this.currentGroupUser.name = '';
      }
    });
  }

  onUpdateUserFromGroup(ACTION: string) {
    if (!this.groupUserSelected) {
      return console.log('something went wrong');
    }
    this.groupservice
      .updateUserGroupPermissions(
        this.currentGroupUser.UUID,
        this.currentGroup.UUID,
        ACTION
      )
      .subscribe(
        (res: any) => {
          this.alertMessage = res.message;
          this.updated = true;
          this.nameOfUser = '';
        },
        (e: any) => console.log(e),
        () => this.onSelectGroup(this.currentGroup.name)
      );
  }

  onAddUserToGroup() {
    if (this.requestUserSelected === false || this.userToAdd === '') {
      return;
    } else {
      console.log('adding user to group');
      console.log(`USERID: ${this.userToAdd}`);
      console.log(`GROUPID: ${this.currentGroup.UUID}`);
      this.groupservice
        .assignToGroup(this.userToAdd, this.currentGroup.UUID)
        .subscribe(
          (res) => {
            if (!res?.ok) {
              this.alertMessage = `${res.error}`;
              this.updated = true;
              this.userToAdd = '';
              this.requestUserSelected = false;
              return;
            }
            this.userToAdd = '';
            this.requestUserSelected = false;
            this.alertMessage = `${res.message}`;
            this.updated = true;

            console.log(res);
          },
          (e) => console.log(e),
          () => this.onSelectGroup(this.currentGroup.name)
        );
    }
  }

  createNewChannel() {
    this.groupservice
      .createNewChannel(this.newChannelName, this.currentGroup.UUID)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.alertMessage = res.message;
          this.updated = true;
        },
        (e) => console.log(e),
        () => this.onSelectGroup(this.currentGroup.name)
      );
  }

  onDeleteChannel() {
    if (!window.confirm('Are you sure you want to delete this channel?')) {
      return;
    }
    this.groupservice
      .deleteChannel(this.currentGroup.UUID, this.currentChannel)
      .subscribe(
        (res: any) => {
          if (!res?.ok) {
            this.alertMessage = res.error;
            this.updated = true;
            return;
          }
          this.alertMessage = res.message;
          this.updated = true;
        },
        (e) => console.log(e),
        () => this.onSelectGroup(this.currentGroup.name)
      );
  }

  onSelectChannel(value: any) {
    this.channelSelected = true;
    this.groupservice
      .getChannelNames(this.currentGroup.UUID, value)
      .subscribe((res: any) => {
        this.currentChannelName = res.name;
      });
  }
  onSelectUser(value: any) {
    console.log(value);
    this.currentUser.UUID = value;
    this.groupservice.getUserByID(value).subscribe((val: any) => {
      if (!val.error) {
        this.currentUser.name = val;
        this.userSelected = true;
      } else {
        this.userSelected = false;
        this.currentUser.name = '';
      }
    });
  }
  onSelectAdminOption(value: any) {
    this.isPromoteToAdmin = false;
    this.isPromoteToSuper = false;
    this.isDeleteUser = false;
    this.isAddUserToGroup = false;
    switch (value) {
      case 'DELETE':
        this.isDeleteUser = true;
        this.isPromoteToSuper = false;
        this.isPromoteToAdmin = false;
        break;
      case 'SUPER':
        this.isPromoteToSuper = true;
        this.isDeleteUser = false;
        this.isPromoteToAdmin = false;
        break;
      case 'ADMIN':
        this.isPromoteToAdmin = true;
        this.isPromoteToSuper = false;
        this.isDeleteUser = false;

        break;
      case 'ADD':
        this.isPromoteToAdmin = false;
        this.isPromoteToSuper = false;
        this.isDeleteUser = false;
        this.isAddUserToGroup = true;

        break;
      default:
        return;
    }
  }
  selectGroupToPromote(val: any) {
    this.selectedAdminGroup = val;
    this.hasSelectedNewAdmin = true;
  }
  onAdminAddToGroup() {
    if (!this.userSelected || !this.isAddUserToGroup) {
      return;
    }
    this.groupservice
      .assignToGroup(this.currentUser.UUID, this.selectedAdminGroup)
      .subscribe(
        (res) => {
          if (!res?.ok) {
            this.alertMessage = `${res.error}`;
            this.updated = true;
            this.userToAdd = '';
            this.requestUserSelected = false;
            return;
          }
          this.userToAdd = '';
          this.requestUserSelected = false;
          this.alertMessage = `${res.message}`;
          this.updated = true;

          console.log(res);
        },
        (e) => console.log(e),
        () => {
          console.log('finished');
          this.hasSelectedNewAdmin = false;
          this.userToUpgrade = '';
          this.selectedAdminGroup = '';
          this.isPromoteToAdmin = false;
          this.isPromoteToSuper = false;
          this.isDeleteUser = false;
          this.isAddUserToGroup = false;
          this.userSelected = false;
          this.currentUser = { UUID: '', name: '' };
        }
      );
  }
  onAdminAddGroupAdmin() {
    if (!this.userSelected || !this.isPromoteToAdmin) {
      return;
    }
    this.groupservice
      .updateUserGroupPermissions(
        this.currentUser.UUID,
        this.selectedAdminGroup,
        'PROMOTE'
      )
      .subscribe(
        (res: any) => {
          this.alertMessage = res.message;
          this.updated = true;
          this.nameOfUser = '';
        },

        (e) => console.log(e),
        () => {
          console.log('finished');
          this.hasSelectedNewAdmin = false;
          this.userToUpgrade = '';
          this.selectedAdminGroup = '';
          this.isPromoteToAdmin = false;
          this.isPromoteToSuper = false;
          this.isDeleteUser = false;
          this.isAddUserToGroup = false;
          this.userSelected = false;
          this.currentUser = { UUID: '', name: '' };
        }
      );
  }
  onAdminDeleteUser() {
    if (!this.isDeleteUser || !this.userSelected) {
      return;
    }
    console.log(this.currentUser);
    this.auth.adminDeleteUser(this.currentUser.UUID).subscribe(
      (val: any) => console.log(val),
      (e) => console.log(e),
      () => {
        console.log('finished');
        this.userToUpgrade = '';
        this.isPromoteToAdmin = false;
        this.isPromoteToSuper = false;
        this.isDeleteUser = false;
        this.isAddUserToGroup = false;
        this.userSelected = false;
        this.currentUser = { UUID: '', name: '' };
        this.adminUserList = [];
        this.auth.getUserList().subscribe((users: any) => {
          this.adminUserList = users;
        });
      }
    );
  }

  onAdminCreateSuper() {
    if (!this.isPromoteToSuper || !this.userSelected) {
      console.log('somethings wong');
      return;
    }
    console.log(this.currentUser);
    this.auth.adminMakeSuper(this.currentUser.UUID).subscribe(
      (val: any) => console.log(val),
      (e) => console.log(e),
      () => {
        console.log('finished');
        this.userToUpgrade = '';
        this.isPromoteToAdmin = false;
        this.isPromoteToSuper = false;
        this.isDeleteUser = false;
        this.isAddUserToGroup = false;
        this.userSelected = false;
        this.currentUser = { UUID: '', name: '' };
        this.adminUserList = [];
        this.auth.getUserList().subscribe((users: any) => {
          this.adminUserList = users;
        });
      }
    );
  }
}
