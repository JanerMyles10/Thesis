import { Injectable } from '@angular/core';
import { io, Socket as SocketIOClient } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: SocketIOClient;

  connect(userId: string) {
    this.socket = io('http://localhost:5000');
    this.socket.emit('join', userId);
  }

  sendMessage(data: any) {
    this.socket.emit('sendMessage', data);
  }

  onMessage(callback: (msg: any) => void) {
    this.socket.on('newMessage', callback);
  }
}
