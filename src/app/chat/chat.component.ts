import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AccountService} from './../shared/account.service';
import {ApiService} from './../shared/api/api.service';

@Component({
  selector: 'bloodrush-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  shown: boolean = false;
  chats: {}[];
  form: FormGroup;

  constructor(
      public acc: AccountService, public fb: FormBuilder,
      public api: ApiService) {
    this.form = this.fb.group({
      message: [
        '',
        Validators.compose([Validators.required, Validators.minLength(3)])
      ]
    })
    setTimeout(() => {
      console.log(this.acc.leagues[0]);
      this.chats = this.acc.leagues[0].chats;
    }, 500);
  }

  send(val: any): void {
    this.form.controls['message'].setValue('');
    let chatObj = {
      owner: this.acc.team,
      ownerId: this.acc.team.id,
      leagueId: this.acc.leagues[0].id,
      message: val.message
    };
    this.chats.push(chatObj);
    this.api.run('post', `/chats`, '', chatObj)
  }
}
