import { Component, Input } from '@angular/core';

@Component({
    selector: 'bloodrush-player-card',
    templateUrl: './player-card.component.html'
})
export class PlayerCardComponent {
    @Input() player: any;
    team = {
        name: 'Mock Team Name'
    };
}
