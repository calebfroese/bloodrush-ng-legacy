import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { GameDetailComponent } from './season/game/game-detail.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './account/login/login.component';
import { MongoService } from './mongo/mongo.service';
import { TeamDetailComponent } from './team/team-detail.component';
import { SignupComponent } from './account/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameDetailComponent,
    TeamDetailComponent,
    SignupComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouting
  ],
  providers: [MongoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
