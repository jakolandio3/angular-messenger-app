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
  constructor(private appRef: ApplicationRef) {
    this.socketMessages = new Subject<SocketData>();
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

    this.socket.on('connected', (data: SocketData) => this.pushToSubject(data));
    this.socket.on('message', (data: SocketData) => this.pushToSubject(data));
    return () => {
      console.log('cleanup');
      this.socket.disconnect();
    };
  }
  private pushToSubject(data: SocketData) {
    return this.socketMessages.next(data);
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
}

interface ClientToServerEvents {
  message: (message: string) => void;
}
interface ServerToClientEvents {
  message: (data: SocketData) => void;
  connected?: (data: SocketData) => void;
  userID?: string;
}
export interface SocketData {
  message?: string;
  userID?: string;
}
