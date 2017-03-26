import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as moment from 'moment';

@Component({
    selector: 'bloodrush-market-listings',
    template: 'bloodrush-market-listings',
    templateUrl: './market-listings.component.html',
    styles: [`
        .listing-button {
            float: right;
            margin-left: 5px;
        }
    `]
})
export class MarketListingsComponent {
    @Input() players: any[];
    @Input() isMine: boolean;
    @Output() viewPlayer = new EventEmitter();
    @Output() cancelSale = new EventEmitter();
    mockTime: string = moment().format('DD/MM/YYYY');

}
