import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'bloodrush-player-card',
  templateUrl: './player-card.component.html'
})
export class PlayerCardComponent implements OnInit {
  @Input() player: any;
  team = {name: 'Mock Team Name'};
  stateEnds: string;

  ngOnInit() {
    if (this.player.stateEnds) {
      console.log(this.player);
      this.stateEnds = moment(this.player.stateEnds).format('LLLL');
    }
  }
}
