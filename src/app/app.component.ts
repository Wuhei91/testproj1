import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  messages = [
    { name: 'John', comment: 'Excited for the wedding!' },
    { name: 'Jane', comment: 'Can’t wait to celebrate with you!' }
  ];
  newMessage = { name: '', comment: '' };

  addMessage() {
    if (this.newMessage.name && this.newMessage.comment) {
      this.messages.push({ ...this.newMessage });
      this.newMessage = { name: '', comment: '' };
    }
  }
}