import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {NgUploaderModule} from 'ngx-uploader';

import {AboutComponent} from './about/about.component';
import {VersionHistoryComponent} from './about/version-history/version-history.component';
import {LoginComponent} from './account/login/login.component';
import {LogoutComponent} from './account/logout/logout.component';
import {SignupComponent} from './account/signup/signup.component';
import {VerifyComponent} from './account/verify/verify.component';
import {AppComponent} from './app.component';
import {AppRouting} from './app.routing';
import {ChatComponent} from './chat/chat.component';
import {FooterComponent} from './footer/footer.component';
import {HomeComponent} from './home/home.component';
import {LadderComponent} from './ladder/ladder.component';
import {LeagueCreateComponent} from './league/create/league-create.component';
import {LeagueDetailComponent} from './league/league-detail.component';
import {LeagueComponent} from './league/league.component';
import {MarketListingsComponent} from './market/market-listings.component';
import {MarketComponent} from './market/market.component';
import {MyOverviewComponent} from './my/my-overview.component';
import {MyPlayersComponent} from './my/players/my-players.component';
import {MyTeamNavComponent} from './my/team/my-team-nav.component';
import {MyTeamComponent} from './my/team/my-team.component';
import {MyTrainingComponent} from './my/training/my-training.component';
import {PlayerCardComponent} from './players/card/player-card.component';
import {PlayerDetailComponent} from './players/player/player-detail.component';
import {TeamPlayersComponent} from './players/team-players.component';
import {GameDetailComponent} from './season/game/game-detail.component';
import {GamePipe} from './season/game/game.pipe';
import {SeasonComponent} from './season/season.component';
import {AccountService} from './shared/account.service';
import {ApiService} from './shared/api/api.service';
import {FormService} from './shared/forms/form.service';
import {LoggedInGuard} from './shared/guards/loggedin.guard';
import {ScoreService} from './shared/score.service';
import {TeamStatsComponent} from './team-stats/team-stats.component';
import {TeamDetailComponent} from './team/team-detail.component';
import {UpcomingGamesComponent} from './upcoming-games/upcoming-games.component';

@NgModule({
  declarations: [
    AboutComponent,          AppComponent,
    FooterComponent,         GamePipe,
    ChatComponent,           GameDetailComponent,
    HomeComponent,           LadderComponent,
    LeagueComponent,         LeagueCreateComponent,
    LeagueDetailComponent,   MarketComponent,
    MarketListingsComponent, MyPlayersComponent,
    MyTeamComponent,         MyTeamNavComponent,
    MyOverviewComponent,     PlayerCardComponent,
    PlayerDetailComponent,   TeamStatsComponent,
    TeamPlayersComponent,    TeamDetailComponent,
    SignupComponent,         SeasonComponent,
    LoginComponent,          LogoutComponent,
    UpcomingGamesComponent,  VerifyComponent,
    MyTrainingComponent,     VersionHistoryComponent
  ],
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule, HttpModule, AppRouting,
    NgUploaderModule
  ],
  providers:
      [ApiService, AccountService, ScoreService, FormService, LoggedInGuard],
  bootstrap: [AppComponent, FooterComponent, ChatComponent]
})
export class AppModule {
}
