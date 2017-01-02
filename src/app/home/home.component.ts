import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent {
    teamWins: number = 5;
    teamLosses: number = 8;
}
