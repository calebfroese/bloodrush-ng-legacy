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
import { GamePipe } from './season/game/game.pipe';
import { HomeComponent } from './home/home.component';
import { LadderComponent } from './ladder/ladder.component';
import { LeagueComponent } from './league/league.component';
import { LeagueDetailComponent } from './league/league-detail.component';
import { LeagueCreateComponent } from './league/create/league-create.component';
import { LogoutComponent } from './account/logout/logout.component';
import { LoggedInGuard } from './shared/guards/loggedin.guard';
import { LoginComponent } from './account/login/login.component';
import { MyPlayersComponent } from './my/players/my-players.component';
import { MyTeamNavComponent } from './my/team/my-team-nav.component';
import { MyTeamComponent } from './my/team/my-team.component';
import { MyOverviewComponent } from './my/my-overview.component';
import { MarketComponent } from './market/market.component';
import { MarketListingsComponent } from './market/market-listings.component';
import { PlayerCardComponent } from './players/card/player-card.component';
import { TeamStatsComponent } from './team-stats/team-stats.component';
import { TeamPlayersComponent } from './players/team-players.component';
import { TeamDetailComponent } from './team/team-detail.component';
import { SeasonComponent } from './season/season.component';
import { SignupComponent } from './account/signup/signup.component';
import { ScoreService } from './shared/score.service';
import { UpcomingGamesComponent } from './upcoming-games/upcoming-games.component';
import { VerifyComponent } from './account/verify/verify.component';
import { VersionHistoryComponent } from './about/version-history/version-history.component';

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
    MarketListingsComponent,
    PlayerCardComponent,
    MyPlayersComponent,
    MyTeamComponent,
    MyTeamNavComponent,
    MyOverviewComponent,
    GamePipe,
    GameDetailComponent,
    TeamStatsComponent,
    TeamPlayersComponent,
    TeamDetailComponent,
    SignupComponent,
    SeasonComponent,
    LoginComponent,
    LogoutComponent,
    UpcomingGamesComponent,
    VerifyComponent,
    VersionHistoryComponent
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
    AccountService,
    ScoreService,
    FormService,
    LoggedInGuard
  ],
  bootstrap: [
    AppComponent,
    FooterComponent
  ]
})
export class AppModule { }
