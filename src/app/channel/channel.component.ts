import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { SocketService } from '../service/socket.service';
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
  messageArray: SocketData[] = [];
  incomingMessage: Observable<SocketData>;
  ioConnection: Subscription | undefined;
  userID: string | null = '';

  currentGroupID: Observable<string>;
  currentChannelID: Observable<string>;

  constructor(
    private socket: SocketService,
    private auth: CheckAuthService,
    private route: ActivatedRoute
  ) {
    if (this.auth.getFromSessionStorage('UUID') === null) {
      this.userID = '';
      throw new Error('undefined user Props');
    } else {
      this.userID = this.auth.getFromSessionStorage('UUID');
    }
    this.currentGroupID = this.route.params.pipe(map((p) => p['groupID']));
    this.currentChannelID = this.route.params.pipe(map((p) => p['channelID']));
    this.incomingMessage = new Observable<SocketData>();
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
    this.incomingMessage.subscribe((m) => {
      console.log(m);
      this.messageArray.push(m);
      console.log(this.messageArray);
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
}
