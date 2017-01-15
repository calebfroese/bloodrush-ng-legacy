import { Component, OnInit } from '@angular/core';
import { NgUploaderOptions } from 'ngx-uploader';

import { Config } from './../shared/config';
import { MongoService } from './../mongo/mongo.service';
import { AccountService } from './../shared/account.service';

@Component({
    templateUrl: './my-overview.component.html'
})
export class MyOverviewComponent implements OnInit {
    team: any;

    constructor(
        private acc: AccountService,
        private mongo: MongoService
    ) {

    }

    ngOnInit(): void {
        // Upon page init, load the team data
        this.loadTeam();
        this.options = {
            url: Config.imgUrl + 'file/' + this.acc.loggedInAccount.team._id
        };
    }

    loadTeam(): void {
        this.mongo.run('teams', 'oneByOwner', { ownerId: this.acc.loggedInAccount._id })
            .then(team => {
                this.team = team;
            })
            .catch(err => {
                debugger
            });
    }

    moveTo(old_index, new_index) {
        if (!this.team.players[new_index]) return;

        if (new_index >= this.team.players.length) {
            let k = new_index - this.team.players.length;
            while ((k--) + 1) {
                this.team.players.push(undefined);
            }
        }
        this.team.players.splice(new_index, 0, this.team.players.splice(old_index, 1)[0]);
    }

    saveTeam(): void {
        // Saves the team to the current orientation of players
        // TODO: Server-side protection of meddling
        this.mongo.run('teams', 'saveMyTeam', { team: this.team })
            .then(res => {
                alert('Team saved successfully.');
            })
            .catch(err => {
                debugger;
            });
    }

    uploadFile: any;
    hasBaseDropZoneOver: boolean = false;
    options: NgUploaderOptions;
    sizeLimit = 2000000;

    handleUpload(data): void {
        if (data && data.response) {
            data = JSON.parse(data.response);
            this.uploadFile = data;
        }
    }

    fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    beforeUpload(uploadingFile): void {
        if (uploadingFile.size > this.sizeLimit) {
            uploadingFile.setAbort();
            alert('File is too large');
        }
    }
}
