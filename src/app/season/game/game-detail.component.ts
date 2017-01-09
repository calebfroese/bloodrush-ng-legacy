import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

import { MongoService } from './../../mongo/mongo.service';

@Component({
    templateUrl: './game-detail.component.html',
    //     styles: [`
    //     canvas, img {
    //         image-rendering: optimizeSpeed;
    //         image-rendering: -moz-crisp-edges;
    //         image-rendering: -webkit-optimize-contrast;
    //         image-rendering: optimize-contrast;
    //         image-rendering: pixelated;
    //         -ms-interpolation-mode: nearest-neighbor;
    //         border: 5px solid #ddd;
    //     }
    // `]
})
export class GameDetailComponent implements OnInit {
    isBye: boolean = false;
    nonByeTeam: string; // index of the team that is not null
    game: any;
    gameId: number;
    seasonNumber: number;
    season: any;

    @ViewChild('gameCanvas') gameCanvas: ElementRef;
    @ViewChild('cDiv') cDiv: ElementRef;
    context: any;
    x: number = 0;
    y: number = 0;
    images = {};
    fps = 30;
    // Scaling
    ratio: number;
    maxWidth: number = 960;
    maxHeight: number = 600;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private mongo: MongoService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            // Fetch the season
            let seasonNumber: number = +params['seasonNumber'];
            this.seasonNumber = seasonNumber;
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
                        if (this.season.games[gameId].game) {
                            this.playGame(this.season.games[gameId].game);
                        }
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

    runGame() {
        this.mongo.run('games', 'playGame', { 'seasonNumber': this.seasonNumber, 'gameNumber': this.gameId });
    }

    // CANVAS
    playGame(game: any): void {
        this.loadImage('char');

        this.initCanvas();
        this.fullscreenify();
    }

    loadImage(name) {
        this.images[name] = new Image();
        this.images[name].onload = () => {
            this.redrawCanvas();
        };
        this.images[name].src = '/assets/' + name + '.png';
    }

    initCanvas(): void {
        this.context = CanvasRenderingContext2D = this.gameCanvas.nativeElement.getContext('2d');
    }

    playerDimensions = 75; // playerDimensions both width and height
    calcEndPoint = this.maxWidth - this.playerDimensions;
    homePos = [0, 0, 0, 0, 0, 0, 0, 0];
    awayPos = [this.calcEndPoint, this.calcEndPoint, this.calcEndPoint, this.calcEndPoint, this.calcEndPoint, this.calcEndPoint, this.calcEndPoint, this.calcEndPoint];
    redrawCanvas() {
        // Draw to the canvas
        let canvasWidth = this.gameCanvas.nativeElement.width;
        let canvasHeight = this.gameCanvas.nativeElement.height;

        this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
        this.drawField();

        // Draw the home players
        for (let i = 0; i < this.game.game.homePlayers.length; i++) {
            this.homePos[i] += this.game.game.homePlayers[i].spd / 50;
            this.drawPlayer(this.images['char'], this.playerDimensions, this.playerDimensions, this.homePos[i], i * this.playerDimensions, this.game.game.homePlayers[i].first, this.game.game.homePlayers[i].last);
        }
        // Draw the away players
        for (let i = 0; i < this.game.game.awayPlayers.length; i++) {
            this.awayPos[i] -= this.game.game.awayPlayers[i].spd / 50;
            this.drawPlayer(this.images['char'], this.playerDimensions, this.playerDimensions, this.awayPos[i], i * this.playerDimensions, this.game.game.awayPlayers[i].first, this.game.game.awayPlayers[i].last);
        }
        setTimeout(() => {
            window.setTimeout(this.redrawCanvas(), 1000 / this.fps);
        }, 30);
    }

    fullscreenify(): void {
        this.resizeScreen();
        window.addEventListener('resize', () => {
            this.resizeScreen();
        }, false);
    }

    resizeScreen(): void {
        let containerWidth = this.cDiv.nativeElement.offsetWidth;

        this.gameCanvas.nativeElement.width = containerWidth;
        this.gameCanvas.nativeElement.height = containerWidth / 1.6;

        this.ratio = this.maxWidth / containerWidth;
    }

    drawField(): void {
        // Draws the field
        this.context.beginPath();
        this.context.rect(0, 0, this.maxWidth, this.maxHeight);
        this.context.fillStyle = 'green';
        this.context.fill();
    }

    drawPlayer(image: any, width: number, height: number, x, y, first: string, last: string): void {
        // Draws a single player
        this.context.drawImage(image, x / this.ratio, y / this.ratio, width / this.ratio, height / this.ratio);
        this.context.font = 12 / this.ratio + 'px Arial';
        this.context.fillStyle = 'white';
        this.context.fillText(first, (x + 10) / this.ratio, (y + 16) / this.ratio);
        this.context.font = 12 / this.ratio + 'px Arial';
        this.context.fillStyle = 'white';
        this.context.fillText(last, (x + 10) / this.ratio, (y + 26) / this.ratio);
    }
}
