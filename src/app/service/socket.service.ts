import { ApplicationRef, Injectable } from '@angular/core';
import { first, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
const SERVER_URL = 'http://localhost:3000';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket<ServerToClientEvents, ClientToServerEvents>;
  socketMessages: Subject<SocketData>;
  socketDetails: Subject<SocketConnectedData>;
  constructor(private appRef: ApplicationRef) {
    this.socketMessages = new Subject<SocketData>();
    this.socketDetails = new Subject<SocketConnectedData>();
  }

  initSocket(GroupID: string, RoomID: string, clientId: string) {
    this.socket = io(`${SERVER_URL}/${GroupID}`, {
      autoConnect: false,
      auth: { userID: clientId },
      query: { group: GroupID, room: RoomID },
    });
    this.appRef.isStable
      .pipe(first((isStable) => isStable))
      .subscribe(() => this.socket.connect());

    this.socket.on('connected', (data: SocketConnectedData) => {
      this.pushToDetails(data);
      // this.pushToSubject({ message: data.message, userID: data.data.roomName });
    });
    this.socket.on('message', (data: SocketData) => this.pushToSubject(data));
    return () => {
      console.log('cleanup');
      this.socket.disconnect();
    };
  }
  private pushToSubject(data: SocketData) {
    return this.socketMessages.next(data);
  }
  private pushToDetails(data: SocketConnectedData) {
    return this.socketDetails.next(data);
  }
  send(message: string) {
    console.log(message);
    console.log(this.socket);
    this.socket.emit('message', message);
    console.log(this.socket);
  }

  getMessages() {
    return this.socketMessages;
  }
  getDetails() {
    return this.socketDetails;
  }
}

interface ClientToServerEvents {
  message: (message: string) => void;
}
interface ServerToClientEvents {
  message?: (data: SocketData) => void;
  connected?: (data: SocketConnectedData) => void;
  userID?: string;
}
export interface SocketData {
  message?: string;
  userID?: string;
  UUID?: string | number;
  createdBy?: string;
}
export interface SocketConnectedData {
  message: string;
  data: {
    groupName: string;
    groupUUID: number;
    isAdmin: boolean;
    messages: ChannelMessages[];
    roomName: string;
    roomUUID: number;
    inRoom: number;
  };
}
export interface ChannelMessages {
  UUID: number | string;
  message: string;
  userID?: string;
  createdBy: string;
}
