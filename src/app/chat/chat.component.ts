import {Component, ViewChild} from '@angular/core';
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
  leagueId: string;
  @ViewChild('messagePanel') messagePanel: any;

  constructor(
      public acc: AccountService, public fb: FormBuilder,
      public api: ApiService) {
    this.form = this.fb.group({
      message: [
        '',
        Validators.compose([Validators.required, Validators.minLength(3)])
      ]
    });
    this.scrollToBottom();
  }

  send(val: any): void {
    this.form.controls['message'].setValue('');
    let chatObj = {
      owner: this.acc.team,
      ownerId: this.acc.team.id,
      leagueId: this.acc.leagues[0].id,
      message: val.message
    };
    this.api.run('post', `/chats`, '', chatObj);
    this.chats.push(chatObj);
  }

  listenChat(): void {
    if (!this.acc.leagues[0]) {
      setTimeout(() => {
        this.listenChat();
      }, 1000);
      return;
    } else if (!this.leagueId) {
      this.leagueId = this.acc.leagues[0].id;
    }
    this.api
        .run(
            'get', `/leagues/${this.leagueId}/chats`,
            `&filter={"include": "owner"}`, {})
        .then(chats => {
          this.chats = chats;
          this.scrollToBottom();
          if (this.shown) {
            setTimeout(() => {
              this.listenChat();
            }, 1000);
          }
        });
  }

  showChat(): void {
    this.shown = true;
    this.listenChat();
  }

  scrollToBottom(): void {
    try {
      this.messagePanel.nativeElement.scrollTop =
          this.messagePanel.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
      // do nothing
    }
  }
}
