import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import * as Connection from '../../../backend/common/connection';
import * as socketIo from 'socket.io-client';
const backendUrl = 'http://localhost:3000'

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  private clientSocket: typeof socketIo.Socket;
  constructor() {
    this.clientSocket = socketIo.connect(backendUrl);
  }

  listenToServer(connection: Connection): Observable<any> {
     return new Observable<any>((subscribe) => {
       this.clientSocket.on(connection, (data) => {
         subscribe.next(data)
       })
     })
  }

  emitToServer(connection: Connection, data: any): void {
     this.clientSocket.emit(connection, data);
  }
}
