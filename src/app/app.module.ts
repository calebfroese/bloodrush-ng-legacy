import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { HomeComponent } from './home/home.component';
import { MongoService } from './mongo/mongo.service';
import { TeamDetailComponent } from './team/team-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TeamDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouting
  ],
  providers: [ MongoService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
