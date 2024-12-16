import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ChannelMessages,
  SocketConnectedData,
  SocketService,
} from '../service/socket.service';
import { CheckAuthService } from '../service/check-auth.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { SocketData } from '../service/socket.service';
@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css',
})
export class ChannelComponent implements OnInit {
  messageContent: string = '';
  messageArray: (SocketData | ChannelMessages)[] = [];
  incomingMessage: Observable<SocketData>;
  channelDetails: Observable<SocketConnectedData>;
  ioConnection: Subscription | undefined;
  userID: string | null = '';
  userName: string | null = '';
  currentGroupName: string = 'Loading';
  currentRoomName: string = 'Loading';
  userIsAdmin: boolean = false;
  usersInRoom: number = 0;

  currentGroupID: Observable<string>;
  currentChannelID: Observable<string>;

  constructor(
    private socket: SocketService,
    private auth: CheckAuthService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    if (this.auth.getFromSessionStorage('UUID') === null) {
      this.userID = '';
      throw new Error('undefined user Props');
    } else {
      this.userID = this.auth.getFromSessionStorage('UUID');
    }

    this.userName = this.auth.getFromSessionStorage('username');
    this.currentGroupID = this.route.params.pipe(map((p) => p['groupID']));
    this.currentChannelID = this.route.params.pipe(map((p) => p['channelID']));
    this.incomingMessage = new Observable<SocketData>();
    this.channelDetails = new Observable<SocketConnectedData>();
  }

  ngOnInit(): void {
    let currGroupID = '';
    let currChannelID = '';
    this.currentGroupID.subscribe({
      next: (group: string) => {
        console.log(group);
        currGroupID = group;
      },
      error: (e) => console.log(e),
      complete: () => console.log('Subscription completed'),
    });
    this.currentChannelID.subscribe({
      next: (channel: string) => {
        console.log(channel);
        currChannelID = channel;
      },
      error: (e) => console.log(e),
      complete: () => console.log('Subscription completed'),
    });
    if (this.userID === null) {
      console.log('Error with userID');
      return;
    }
    this.socket.initSocket(currGroupID, currChannelID, this.userID);
    this.incomingMessage = this.socket.getMessages().pipe(map((p) => p));
    this.incomingMessage.subscribe((m: SocketData) => {
      console.log(m);
      this.messageArray.push(m);
      console.log(this.messageArray);
    });
    this.channelDetails = this.socket.getDetails().pipe(map((p) => p));
    this.channelDetails.subscribe((data: SocketConnectedData) => {
      const {
        messages,
        groupUUID,
        groupName,
        roomUUID,
        roomName,
        isAdmin,
        inRoom,
      } = data.data;
      this.messageArray.push(...messages);
      this.currentGroupName = groupName;
      this.currentRoomName = roomName;
      this.userIsAdmin = isAdmin;
      this.usersInRoom = inRoom;
    });
  }
  chat() {
    if (this.messageContent) {
      console.log('sending', this.messageContent);
      this.socket.send(this.messageContent);
      this.messageContent = '';
    } else {
      console.log('no message');
    }
  }
  openModalFunction(content: any) {
    this.modalService.open(content);
  }
  closeModalFunction() {
    this.modalService.dismissAll();
  }
}
