import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

import { MongoService } from './../../mongo/mongo.service';

@Component({
    templateUrl: './game-detail.component.html',
    styles: [`
    canvas, img {
        image-rendering: optimizeSpeed;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: optimize-contrast;
        image-rendering: pixelated;
        -ms-interpolation-mode: nearest-neighbor;
        border: 5px solid #ddd;
    }
`]
})
export class GameDetailComponent implements OnInit {
    isBye: boolean = false;
    nonByeTeam: string; // index of the team that is not null
    game: any;
    gameId: number;
    season: any;

    @ViewChild('gameCanvas') gameCanvas: ElementRef;
    context: any;
    x: number = 0;
    y: number = 0;
    images = {};
    fps = 30;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private mongo: MongoService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            // Fetch the season
            let seasonNumber: number = +params['seasonNumber'];
            let gameId: number = +params['gameId'];
            this.gameId = gameId;
            this.mongo.run('seasons', 'oneByNumber', { number: seasonNumber }).then(season => {
                this.season = season;
                if (season) {
                    if (season.games[gameId]) this.game = season.games[gameId];
                    // Load the teams
                    this.mongo.run('teams', 'oneById', { _id: this.game.home }).then(teamHome => {
                        this.game.home = teamHome;
                        return this.mongo.run('teams', 'oneById', { _id: this.game.away });
                    }).then(awayTeam => {
                        this.game.away = awayTeam;
                        this.playGame(this.season.games[gameId].game);
                    }).catch(err => {
                        debugger;
                    });
                } else {
                    debugger;
                }
            }).catch(err => {
                debugger;
            });
        });
    }

    calculateBye(x): void {
        if (!this.game['home']) {
            this.nonByeTeam = 'home';
        } else {
            this.nonByeTeam = 'away';
        }
    }

    // CANVAS
    playGame(game: any): void {
        this.loadImage("char");

        this.initCanvas();
        this.fullscreenify();
    }

    resourceLoaded() {
        this.animate();
    }

    loadImage(name) {
        this.images[name] = new Image();
        this.images[name].onload = () => {
            let w = this.images[name].width * 10;
            let h = this.images[name].height * 10;
            // Step it down several times
            let can2 = document.createElement('canvas');
            can2.width = w / 2;
            can2.height = w / 2;
            let ctx2 = can2.getContext('2d');
            // Draw it at 1/2 size 3 times (step down three times)
            ctx2.drawImage(this.images[name], 0, 0, w / 2, h / 2);
            ctx2.drawImage(can2, 0, 0, w / 2, h / 2, 0, 0, w / 4, h / 4);
            ctx2.drawImage(can2, 0, 0, w / 4, h / 4, 0, 0, w / 6, h / 6);
            this.context.drawImage(can2, 0, 0, w / 6, h / 6, 0, 200, w / 6, h / 6);

            this.resourceLoaded();
        };
        this.images[name].src = "/assets/" + name + ".jpg";
    }

    initCanvas(): void {
        this.context = CanvasRenderingContext2D = this.gameCanvas.nativeElement.getContext('2d');
    }

    animate() {
        // Draw to the canvas
        let canvasWidth = this.gameCanvas.nativeElement.width;
        let canvasHeight = this.gameCanvas.nativeElement.height;
        console.log(this.images['char'].width)
        // this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
        // this.context.drawImage(this.images["char"], this.x, 200);
        setTimeout(() => {
            window.setTimeout(this.animate(), 1000 / this.fps);
        }, 30);
    }

    fullscreenify() {
        this.gameCanvas.nativeElement.height = this.gameCanvas.nativeElement.width / 1.6;
        window.addEventListener('resize', () => {
            this.gameCanvas.nativeElement.height = this.gameCanvas.nativeElement.width / 1.6;
        }, false);
    }
}
