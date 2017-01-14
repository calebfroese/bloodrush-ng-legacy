import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent {
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
