import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgUploaderModule } from 'ngx-uploader';

import { AccountService } from './shared/account.service';
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { GameDetailComponent } from './season/game/game-detail.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './account/logout/logout.component';
import { LoginComponent } from './account/login/login.component';
import { MongoService } from './mongo/mongo.service';
import { TeamDetailComponent } from './team/team-detail.component';
import { SignupComponent } from './account/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HomeComponent,
    GameDetailComponent,
    TeamDetailComponent,
    SignupComponent,
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
  providers: [MongoService, AccountService],
  bootstrap: [AppComponent, FooterComponent]
})
export class AppModule { }
