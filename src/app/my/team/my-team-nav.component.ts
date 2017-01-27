import { Component } from '@angular/core';

import { AccountService } from './../../shared/account.service';

@Component({
    selector: 'bloodrush-my-team-nav',
    template: `
    <section *ngIf="acc.team" class="hero is-primary is-small">
    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
        <div class="container has-text-centered">
            <h1 class="title">{{acc.team.name}}</h1>
            <h2 class="subtitle">{{acc.team.id}}</h2>
        </div>
    </div>
    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot">
        <nav class="tabs">
            <div class="container">
                <ul>
                    <li><a routerLink="/home/team">Overview</a></li>
                    <li><a routerLink="/home/team/players">Players</a></li>
                    <li><a routerLink="/home/team/team">Team</a></li>
                </ul>
            </div>
        </nav>
    </div>
</section>
`
})
export class MyTeamNavComponent {
    constructor(private acc: AccountService) { }

}