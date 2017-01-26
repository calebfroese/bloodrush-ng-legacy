import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgUploaderModule } from 'ngx-uploader';

import { AboutComponent } from './about/about.component';
import { AccountService } from './shared/account.service';
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { GameDetailComponent } from './season/game/game-detail.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LadderComponent } from './ladder/ladder.component';
import { LeagueComponent } from './league/league.component';
import { LeagueDetailComponent } from './league/league-detail.component';
import { LogoutComponent } from './account/logout/logout.component';
import { LoginComponent } from './account/login/login.component';
import { MongoService } from './mongo/mongo.service';
import { MyPlayersComponent } from './my/players/my-players.component';
import { MyTeamComponent } from './my/team/my-team.component';
import { MyOverviewComponent } from './my/my-overview.component';
import { MarketComponent } from './market/market.component';
import { TeamDetailComponent } from './team/team-detail.component';
import { SeasonComponent } from './season/season.component';
import { SignupComponent } from './account/signup/signup.component';

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    FooterComponent,
    HomeComponent,
    LadderComponent,
    LeagueComponent,
    LeagueDetailComponent,
    MarketComponent,
    MyPlayersComponent,
    MyTeamComponent,
    MyOverviewComponent,
    GameDetailComponent,
    TeamDetailComponent,
    SignupComponent,
    SeasonComponent,
    LoginComponent,
    LogoutComponent
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
    MongoService,
    AccountService
  ],
  bootstrap: [
    AppComponent,
    FooterComponent
  ]
})
export class AppModule { }
