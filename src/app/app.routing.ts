import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TeamDetailComponent } from './team/team-detail.component';

const routes: Routes = [
    { path: '', component: AppComponent },
    { path: 'home', component: HomeComponent },
    { path: 'team/:teamId', component: TeamDetailComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRouting { }
