import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgUploaderOptions} from 'ngx-uploader';

import {environment} from './../../../environments/environment';
import {AccountService} from './../../shared/account.service';
import {ApiService} from './../../shared/api/api.service';
import {Config} from './../../shared/config';

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
  picker = {r: 0, g: 255, b: 120};
  convert = require('color-convert');
  partEditIndex: number = 0;
  imgUrl: string;
  rndCache: string = Math.random().toString();
  savingChanges: boolean = false;

  constructor(
      private acc: AccountService, private api: ApiService,
      private router: Router) {}

  ngOnInit(): void {
    if (!this.acc.team.id) return;
    // Upon page init, load the team data
    this.teamlogoOptions = {
      url: Config[environment.envName].imgUrl + 'file/' + this.acc.team.id
    };
    this.teamanthemOptions = {
      url: Config[environment.envName].imgUrl + 'fileAnthem/' + this.acc.team.id
    };
    this.team = this.acc.team;
    // Defaults
    let defaultStyles = [
      {name: 'soles1', base: true, color: {r: 0, g: 0, b: 0}},
      {name: 'shoes1', base: true, color: {r: 0, g: 0, b: 0}},
      {
        name: 'preset/flesh',
        base: true,
        hidden: true,
        color: {r: 255, g: 220, b: 177}
      },
      {name: 'leg1', base: true, color: {r: 0, g: 0, b: 0}},
      {name: 'leg2', color: {r: 0, g: 0, b: 0}},
      {name: 'leg3', color: {r: 0, g: 0, b: 0}},
      {name: 'shirt1', base: true, color: {r: 0, g: 0, b: 0}},
      {name: 'shirt2', color: {r: 0, g: 0, b: 0}},
      {name: 'shirt3', color: {r: 0, g: 0, b: 0}},
      {name: 'shirt4', color: {r: 0, g: 0, b: 0}},
      {name: 'shirt5', color: {r: 0, g: 0, b: 0}},
      {name: 'shirt6', color: {r: 0, g: 0, b: 0}},
      {name: 'arm1', color: {r: 0, g: 0, b: 0}},
      {name: 'arm2', color: {r: 0, g: 0, b: 0}},
      {name: 'arm3', color: {r: 0, g: 0, b: 0}},
      {
        name: 'preset/face',
        base: true,
        hidden: true,
        color: {r: 0, g: 0, b: 0}
      },
      {name: 'helm1', base: true, color: {r: 0, g: 0, b: 0}},
      {name: 'helm2', color: {r: 0, g: 0, b: 0}},
      {name: 'helm3', color: {r: 0, g: 0, b: 0}},
      {
        name: 'preset/lines',
        base: true,
        hidden: true,
        color: {r: 0, g: 0, b: 0}
      },
    ];
    if (this.team.style && this.team.style.length > 0)
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
    this.updateCanvas();
    // Image url
    this.imgUrl = Config[environment.envName].imgUrl;
  }

  uploadFile: any;
  hasBaseDropZoneOver: boolean = false;
  teamlogoOptions: NgUploaderOptions;
  teamanthemOptions: NgUploaderOptions;
  sizeLimit = 10000000;

  handleUpload(data): void {
    console.log(data);
    if (data && data.response) {
      data = JSON.parse(data.response);
      this.uploadFile = data;
      this.rndCache = Math.random().toString();
      // Assuming the file is done uploading now, set the teamlogos to true
      this.api.run('patch', `/teams/${this.acc.team.id}`, '', {hasImg: true});
    }
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  beforeUpload(uploadingFile, type: string): void {
    if (type === 'anthem') {
      // Validate as mp3
      if (uploadingFile.originalName.split('.').pop() !== 'mp3') {
        uploadingFile.setAbort();
        alert('Must be a .mp3 file');
        return;
      }
    }
    if (uploadingFile.size > this.sizeLimit) {
      uploadingFile.setAbort();
      alert('File is too large');
    }
  }
  upperAcr(): void {
    this.team.acronym = this.team.acronym.toUpperCase();
  }

  onClickSubmit(): void {
    if (this.savingChanges) return;
    // When the user submits their signup form
    // TODO validate form
    this.team.init = true;
    // Submit to the server and update the team
    this.team.acronym = this.team.acronym.toUpperCase();
    this.savingChanges = true;
    this.api.run('patch', `/teams/${this.acc.team.id}`, '', this.team)
        .then(
            response => {
                // Save the player style too
                this.api
                    .run(
                        'post', `/images/createPlayers`, '',
                        {style: this.team.style, teamId: this.team.id})
                    .then(response => {
                      console.log(response);
                      if (response.response.ok === true) {
                        alert('Saved');
                      } else {
                        alert('Unable to save team. Please try again shortly');
                      }
                      this.savingChanges = false;
                    })
                    .catch(err => {
                      console.error(err);
                      alert('Unable to save team. Please try again shortly');
                      this.savingChanges = false;
                    })});
  }

  colorChange(): void {
    this.colorPreview.nativeElement.style.backgroundColor =
        '#' + this.convert.rgb.hex(this.picker.r, this.picker.g, this.picker.b);
    if (this.team.style[this.partEditIndex]) {
      this.team.style[this.partEditIndex].color = this.picker;
    }
  }

  editPart(i: number): void {
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
    let arrayOfStyles = [];
    for (let i = 0; i < this.team.style.length; i++) {
      let sty = this.team.style[i];
      if (sty.base || sty.selected) {
        arrayOfStyles.push(sty);
      }
    }
    this.api
        .run(
            'post', '/images/createPreview', '',
            {styles: arrayOfStyles, teamId: this.team.id})
        .then(res => {
          let i = new Image();
          i.src = `${Config[environment.envName]
                      .imgUrl}player/output/${this.team
                      .id}-preview.png?a=${new Date()
                      .toString()}`;
          i.onload = () => {
            this.drawCanvas();
          };
          i.onerror = (err) => {
            i.src =
                '/assets/img/logo.png';  // use a default bloodrush logo image
          };
          this.images = [i];
        })
        .catch(err => {
          console.error(err);
        })
  }

  drawCanvas() {
    this.context.clearRect(
        0, 0, this.playerPreviewCanvas.nativeElement.width,
        this.playerPreviewCanvas.nativeElement.height);
    // Draw the image stack
    this.images.forEach(img => {
      setTimeout(() => {
        this.drawPlayer(img);
      }, 50);
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
    this.loadImage('field', '/assets/img/field.png').then(() => {
      // All images loaded
      if (this.playerPreviewCanvas) {
        this.context = CanvasRenderingContext2D =
            this.playerPreviewCanvas.nativeElement.getContext('2d');
        // Play
        this.playerPreviewCanvas.nativeElement.width =
            Config[environment.envName].playerImgWidth;
        this.playerPreviewCanvas.nativeElement.height =
            Config[environment.envName].playerImgHeight;
        if (this.team.hasInit) this.updateCanvas();
      } else {
        setTimeout(() => {
          this.initCanvas();
        }, 10);
      }
    });
  }
}
