import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgUploaderModule } from 'ngx-uploader';

import { ApiService } from './shared/api/api.service';
import { AboutComponent } from './about/about.component';
import { AccountService } from './shared/account.service';
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { GameDetailComponent } from './season/game/game-detail.component';
import { FooterComponent } from './footer/footer.component';
import { FormService } from './shared/forms/form.service';
import { FormConfig } from './shared/forms/form.config';
import { HomeComponent } from './home/home.component';
import { LadderComponent } from './ladder/ladder.component';
import { LeagueComponent } from './league/league.component';
import { LeagueCreateComponent } from './league/create/league-create.component';
import { LeagueDetailComponent } from './league/league-detail.component';
import { LogoutComponent } from './account/logout/logout.component';
import { LoginComponent } from './account/login/login.component';
import { MongoService } from './mongo/mongo.service';
import { MyPlayersComponent } from './my/players/my-players.component';
import { MyTeamNavComponent } from './my/team/my-team-nav.component';
import { MyTeamComponent } from './my/team/my-team.component';
import { MyOverviewComponent } from './my/my-overview.component';
import { MarketComponent } from './market/market.component';
import { TeamStatsComponent } from './team-stats/team-stats.component';
import { TeamPlayersComponent } from './players/team-players.component';
import { TeamDetailComponent } from './team/team-detail.component';
import { SeasonComponent } from './season/season.component';
import { SignupComponent } from './account/signup/signup.component';
import { ScoreService } from './shared/score.service';
import { VerifyComponent } from './account/verify/verify.component';

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    FooterComponent,
    HomeComponent,
    LadderComponent,
    LeagueComponent,
    LeagueCreateComponent,
    LeagueDetailComponent,
    MarketComponent,
    MyPlayersComponent,
    MyTeamComponent,
    MyTeamNavComponent,
    MyOverviewComponent,
    GameDetailComponent,
    TeamStatsComponent,
    TeamPlayersComponent,
    TeamDetailComponent,
    SignupComponent,
    SeasonComponent,
    LoginComponent,
    LogoutComponent,
    VerifyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRouting,
    NgUploaderModule
  ],
  providers: [
    ApiService,
    MongoService,
    AccountService,
    ScoreService,
    FormService,
    FormConfig
  ],
  bootstrap: [
    AppComponent,
    FooterComponent
  ]
})
export class AppModule { }
