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
    @ViewChild('playerPreviewCanvas') playerPreviewCanvas: ElementRef;
    context: any;
    team: any;
    picker = {
        r: 0,
        g: 255,
        b: 120
    };
    convert = require('color-convert');
    partEditIndex: number = 0;
    imgUrl: string;
    rndCache: string = Math.random().toString();

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
        // Defaults
        let defaultStyles = [
            {
                name: 'soles1',
                base: true,
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'shoes1',
                base: true,
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'preset/flesh',
                base: true,
                hidden: true,
                color: { r: 255, g: 220, b: 177 }
            },
            {
                name: 'leg1',
                base: true,
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'leg2',
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'leg3',
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'shirt1',
                base: true,
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'shirt2',
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'shirt3',
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'shirt4',
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'shirt5',
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'shirt6',
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'arm1',
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'arm2',
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'arm3',
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'preset/face',
                base: true,
                hidden: true,
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'helm1',
                base: true,
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'helm2',
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'helm3',
                color: { r: 0, g: 0, b: 0 }
            },
            {
                name: 'preset/lines',
                base: true,
                hidden: true,
                color: { r: 0, g: 0, b: 0 }
            },
        ];
        this.team.style = defaultStyles;

        this.team.style.forEach(savedStyle => {
            for (let i = 0; i < defaultStyles.length; i++) {
                // Increments for each default style
                if (savedStyle.name === defaultStyles[i].name) {
                    defaultStyles[i] = savedStyle;
                }
            }
        });
        // Loaded
        this.team.style = defaultStyles;
        this.initCanvas();
        // Image url
        this.imgUrl = Config.imgUrl;
    }

    uploadFile: any;
    hasBaseDropZoneOver: boolean = false;
    options: NgUploaderOptions;
    sizeLimit = 2000000;

    handleUpload(data): void {
        if (data && data.response) {
            data = JSON.parse(data.response);
            this.uploadFile = data;
            this.rndCache = Math.random().toString();
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
        if (this.team.style[this.partEditIndex]) {
            this.team.style[this.partEditIndex].color = this.picker;
        }
    }

    editPart(i: number): void {
        console.log(i)
        this.partEditIndex = i;
        this.picker = this.team.style[i].color;
        this.colorChange();
    }

    selectPart(i: number) {
        if (!this.team.style[i].selected) {
            this.team.style[i].selected = true;
        } else {
            this.team.style[i].selected = false;
        }
    }

    // CANVAS RENDERING PLAYER
    images: any[] = [];
    updateCanvas(): void {
        this.context.clearRect(0, 0, this.playerPreviewCanvas.nativeElement.width, this.playerPreviewCanvas.nativeElement.height);
        console.log('drawing field');
        this.drawPlayer(this.images['field']);
        setTimeout(() => {
            this.updateCanvas();
        }, 200);
    }

    loadImage(name, src): Promise<any> {
        return new Promise((resolve, reject) => {
            this.images[name] = new Image();
            this.images[name].onload = () => {
                resolve();
            };
            this.images[name].src = src;
        });
    }

    drawPlayer(image: any): void {
        this.context.drawImage(image, 0, 0);
    }

    initCanvas(): void {
        let loader = this.loadImage('field', '/assets/img/field.png');
        // For each thingo
        this.team.style.forEach(sty => {
            console.log(sty.name)
            loader.then(() => { return this.loadImage(sty.name, `${Config.imgUrl}player/gen/frame1/${sty.name}.png`); })
        });
        loader.then(() => {
            // All images loaded
            if (this.playerPreviewCanvas) {
                this.context = CanvasRenderingContext2D = this.playerPreviewCanvas.nativeElement.getContext('2d');
                // Play
                this.updateCanvas();
            } else {
                setTimeout(() => {
                    this.initCanvas();
                }, 10);
            }
        });
    }
}
