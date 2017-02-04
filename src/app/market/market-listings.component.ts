import { Component, Input } from '@angular/core';

import * as moment from 'moment';

@Component({
    selector: 'bloodrush-market-listings',
    template: 'bloodrush-market-listings',
    templateUrl: './market-listings.component.html'
})
export class MarketListingsComponent {
    @Input() players: any[];
    mockTime: string = moment().format('DD/MM/YYYY');
}
