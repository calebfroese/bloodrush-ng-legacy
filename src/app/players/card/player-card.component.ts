import { Component, Input } from '@angular/core';

@Component({
    selector: 'bloodrush-player-info',
    templateUrl: './player-card.component.html'
})
export class PlayerCardComponent {
    @Input() player: any;
    team = {
        name: 'Mock Team Name'
    };
}
