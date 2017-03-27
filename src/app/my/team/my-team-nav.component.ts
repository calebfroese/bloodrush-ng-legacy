import {Component, OnInit} from '@angular/core';

import {AccountService} from './../../shared/account.service';

@Component({
  selector: 'bloodrush-my-team-nav',
  template: `
    <section *ngIf="acc.team" class="hero is-primary is-small">
    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
        <div class="container has-text-centered">
            <h1 class="title is-1">{{acc.team.name}}</h1>
            <h2 class="subtitle">
            <span class="icon">
                    <i class="fa fa-money"></i>
                </span>
                {{acc.team.money}}
            </h2>
            <h2 class="subtitle">
            Level {{curLvl}}, {{this.acc.team.experience}} / {{acc.calculateExp(curLvl + 1)}} XP
            <progress class="progress is-info is-large is-marginless" [value]="curExp" [max]="nextLevelExp"></progress>
            </h2>
        </div>
        <div class="container has-text-centered">
        </div>
    </div>
    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot">
        <nav class="tabs">
            <div class="container">
                <ul>
                    <li><a routerLink="/home/team">
                    <span class="icon is-small"><i class="fa fa-sitemap"></i></span>
                    Overview
                    </a></li>
                    <li><a routerLink="/home/team/players">
                    <span class="icon is-small"><i class="fa fa-users"></i></span>
                    Players
                    </a></li>
                    <li><a routerLink="/home/team/team">
                    <span class="icon is-small"><i class="fa fa-flag"></i></span>
                    Team
                    </a></li>
                    <li><a routerLink="/home/team/training">
                    <span class="icon is-small"><i class="fa fa-hand-rock-o"></i></span>
                    Training
                    </a></li>
                </ul>
            </div>
        </nav>
    </div>
</section>
`,
  styles: [`
    .subtitle {
        margin: 5px;
    }
`]
})
export class MyTeamNavComponent implements OnInit {
  curExp: number = 0;
  nextLevelExp: number = 1;
  curLvl: number = 1;

  constructor(public acc: AccountService) {}

  ngOnInit(): void {
    // Calculate the exp bar
    this.curLvl = this.acc.calculateLevel(this.acc.team.experience);
    this.curExp = this.acc.team.experience - this.acc.calculateExp(this.curLvl);
    this.nextLevelExp = this.acc.calculateExp(this.curLvl + 1) -
        this.acc.calculateExp(this.curLvl);
    console.log(this.curExp, this.nextLevelExp);
  }
}