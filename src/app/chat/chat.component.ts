import { Component } from '@angular/core';

@Component({
    selector: 'bloodrush-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
    // Copyright
    year = 2017;
    text = '2017';
    appVersion = require('./../../../package.json').appVersion

    constructor() {
        console.log(this.appVersion)
        let thisYear = new Date().getFullYear();
        if (this.year !== thisYear) {
            this.text = `2017 - ${thisYear.toString()}`;
        }
    }
}
