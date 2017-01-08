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
    charX: number;
    charY: number;
    startTime;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private mongo: MongoService
    ) {
        this.startTime = (new Date()).getTime();
    }

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

    images = {};

    totalResources = 6;
    numResourcesLoaded = 0;
    fps = 30;

    resourceLoaded() {
        this.animate();
        this.numResourcesLoaded++;
        if (this.numResourcesLoaded === this.totalResources) {
            setInterval(this.animate(), 1000 / this.fps);
        }
    }

    loadImage(name) {
        this.images[name] = new Image();
        this.images[name].onload = () => {
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
        this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
        this.context.drawImage(this.images["char"], this.x, this.y);
        setTimeout(() => {
            window.setTimeout(this.animate(), 1000 / 60);
        }, 30);
    }

    fullscreenify() {
        this.gameCanvas.nativeElement.height = this.gameCanvas.nativeElement.width / 1.6;
        window.addEventListener('resize', () => {
            this.gameCanvas.nativeElement.height = this.gameCanvas.nativeElement.width / 1.6;
        }, false);
    }
}
