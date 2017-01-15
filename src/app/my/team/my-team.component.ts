import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgUploaderOptions } from 'ngx-uploader';

import { Config } from './../../shared/config';
import { MongoService } from './../../mongo/mongo.service';
import { AccountService } from './../../shared/account.service';

@Component({
    templateUrl: './my-team.component.html'
})
export class MyTeamComponent {

    team: any;

    constructor(
        private acc: AccountService,
        private mongo: MongoService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Upon page init, load the team data
        this.options = {
            url: Config.imgUrl + 'file/' + this.acc.loggedInAccount.team._id
        };
        this.team = this.acc.loggedInAccount.team;
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

    onClickSubmit(): void {
        // When the user submits their signup form
        // Validate stuff
        // Team
        if (this.team.acronym.length < 2) {
            alert('Password must be at least 2 characters');
            return;
        }
        if (this.team.name.length < 8) {
            alert('Team name must be at least 8 characters');
            return;
        }
        // Submit to mongo
        this.mongo.run('teams', 'saveMyTeam', { team: this.team }).then(response => {
            if (response.error) {
                alert(response.error);
            } else if (response.ok) {
                alert('Successfully updated team details.')
            } else {
                alert('No response');
            }
        }).catch(() => alert('Unable to sign up'));
    }
}
