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
        width: 280;
        height: 430;
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
        if (this.team.style.length > 0) this.team.style.forEach(savedStyle => {
            for (let i = 0; i < defaultStyles.length; i++) {
                // Increments for each default style
                if (savedStyle.name === defaultStyles[i].name) {
                    console.log('overwriting', defaultStyles[i].name)
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
        // TODO Validate stuff central form config
        // Team
        if (this.team.acronym.length < 2) {
            alert('Password must be at least 2 characters');
            return;
        }
        if (this.team.name.length < 3) {
            alert('Team name must be at least 3 characters');
            return;
        }
        this.acc.loggedInAccount.team = this.team;
        // Submit to mongo
        this.mongo.run('teams', 'saveMyTeam', { team: this.team }).then(response => {
            if (response.error) {
                alert(response.error);
            } else if (response.ok) {
                alert('Successfully updated team details.');
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
        this.images = []; // empty the image stack
        this.team.style.forEach(sty => {
            if (sty.base || sty.selected) {
                // Send a request to the server
                let partUrl = `${Config.imgUrl}temp/player/${this.team._id}/frame1/${sty.name}-${sty.color.r}.${sty.color.g}.${sty.color.b}.png`;
                this.mongo.run('images', 'createPart', { style: sty, teamId: this.team._id });
                let img = new Image();
                img.src = partUrl;
                this.images.push(img);
            }
        });
        // TODO button update only not settimeout
        setTimeout(() => {
            console.log('Drawing to canvas')
            this.drawCanvas();
        }, 3000);
        setTimeout(() => {
            console.log('Updating colors')
            this.updateCanvas();
        }, 10000);
    }

    drawCanvas() {
        console.log('drawing stack');
        this.context.clearRect(0, 0, this.playerPreviewCanvas.nativeElement.width, this.playerPreviewCanvas.nativeElement.height);
        // Draw the image stack
        this.images.forEach(img => {
            this.drawPlayer(img);
        });
    }

    drawPlayer(image) {
        this.context.drawImage(image, 0, 0);
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

    initCanvas(): void {
        this.loadImage('field', '/assets/img/field.png')
            .then(() => {
                // All images loaded
                if (this.playerPreviewCanvas) {
                    this.context = CanvasRenderingContext2D = this.playerPreviewCanvas.nativeElement.getContext('2d');
                    // Play
                    this.playerPreviewCanvas.nativeElement.width = Config.playerImgWidth;
                    this.playerPreviewCanvas.nativeElement.height = Config.playerImgHeight;
                    this.updateCanvas();
                } else {
                    setTimeout(() => {
                        this.initCanvas();
                    }, 10);
                }
            });
    }
}
