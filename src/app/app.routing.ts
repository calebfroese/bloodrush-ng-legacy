import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AboutComponent} from './about/about.component';
import {VersionHistoryComponent} from './about/version-history/version-history.component';
import {LoginComponent} from './account/login/login.component';
import {LogoutComponent} from './account/logout/logout.component';
import {SignupComponent} from './account/signup/signup.component';
import {VerifyComponent} from './account/verify/verify.component';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {LeagueCreateComponent} from './league/create/league-create.component';
import {LeagueDetailComponent} from './league/league-detail.component';
import {LeagueComponent} from './league/league.component';
import {MarketComponent} from './market/market.component';
import {MyOverviewComponent} from './my/my-overview.component';
import {MyPlayersComponent} from './my/players/my-players.component';
import {MyTeamComponent} from './my/team/my-team.component';
import {GameDetailComponent} from './season/game/game-detail.component';
import {SeasonComponent} from './season/season.component';
import {LoggedInGuard} from './shared/guards/loggedin.guard';
import {TeamDetailComponent} from './team/team-detail.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {
    path: 'home/team/players',
    component: MyPlayersComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'home/team/team',
    component: MyTeamComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'home/team',
    component: MyOverviewComponent,
    canActivate: [LoggedInGuard]
  },
  {path: 'about', component: AboutComponent},
  {path: 'about/version-history', component: VersionHistoryComponent},
  {path: 'leagues', component: LeagueComponent},
  {
    path: 'leagues/create',
    component: LeagueCreateComponent,
    canActivate: [LoggedInGuard]
  },
  {path: 'leagues/:leagueId', component: LeagueDetailComponent},
  {path: 'market', component: MarketComponent, canActivate: [LoggedInGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'seasons', component: SeasonComponent},
  {path: 'seasons/:seasonId', component: SeasonComponent},
  {path: 'seasons/:seasonId/games/:gameId', component: GameDetailComponent},
  {path: 'verify/:token', component: VerifyComponent},
  {path: 'teams/:teamId', component: TeamDetailComponent},
];
@NgModule({imports: [RouterModule.forRoot(routes)], exports: [RouterModule]})
export class AppRouting {
}
