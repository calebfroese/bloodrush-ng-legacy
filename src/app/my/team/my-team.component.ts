import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgUploaderOptions } from 'ngx-uploader';

import { Config } from './../../shared/config';
import { MongoService } from './../../mongo/mongo.service';
import { AccountService } from './../../shared/account.service';

@Component({
    templateUrl: './my-team.component.html',
    styles: [`
    .player-preview {
        width: 100%;
        height: 400px;
    }
    .picker-color {
        width: 100%;
        height: 20px;
        margin: 5px;
    }
    .part-editing {
        background-color: yellow;
    }
    `]
})
export class MyTeamComponent {
    @ViewChild('colorPreview') colorPreview: ElementRef;
    team: any;
    picker = {
        r: 0,
        g: 255,
        b: 120
    };
    convert = require('color-convert');
    parts: any = [
        {
            name: 'shirt1',
            base: true,
            color: { r: 0, g: 120, b: 12 }
        },
        {
            name: 'leg1',
            color: { r: 0, g: 123, b: 255 },
            selected: false
        },
        {
            name: 'leg2',
            color: { r: 52, g: 120, b: 0 },
            selected: false
        },
        {
            name: 'lines',
            base: true,
            color: { r: 100, g: 120, b: 0 }
        },
        {
            name: 'face',
            base: true,
            color: { r: 70, g: 120, b: 50 }
        }
    ];
    partEditIndex: number = null;

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
        this.colorChange();
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

    colorChange(): void {
        this.colorPreview.nativeElement.style.backgroundColor = '#' + this.convert.rgb.hex(this.picker.r, this.picker.g, this.picker.b);
        if (this.parts[this.partEditIndex]) {
            this.parts[this.partEditIndex].color = this.picker;
        }
    }

    editPart(i: number): void {
        this.partEditIndex = i;
        this.picker = this.parts[i].color;
        this.colorChange();
    }
}
