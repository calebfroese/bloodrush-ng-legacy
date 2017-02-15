import { Component } from '@angular/core';

@Component({
    selector: 'bloodrush-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
    shown: boolean = false;

    constructor() {
      
    }
}
