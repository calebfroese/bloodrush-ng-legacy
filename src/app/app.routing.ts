import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { GameDetailComponent } from './season/game/game-detail.component';
import { MarketComponent } from './market/market.component';
import { LogoutComponent } from './account/logout/logout.component';
import { LoginComponent } from './account/login/login.component';
import { SignupComponent } from './account/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MyOverviewComponent } from './my/my-overview.component';
import { TeamDetailComponent } from './team/team-detail.component';
import { SeasonComponent } from './season/season.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'home/team', component: MyOverviewComponent },
    { path: 'about', component: AboutComponent },
    { path: 'market', component: MarketComponent },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'season', component: SeasonComponent },
    { path: 'team/:teamId', component: TeamDetailComponent },
    { path: 'season/:seasonNumber/:gameId', component: GameDetailComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRouting { }
