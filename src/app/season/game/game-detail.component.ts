import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

import { MongoService } from './../../mongo/mongo.service';

@Component({
    templateUrl: './game-detail.component.html',
    // styles: [`
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
    playGame(): void {
        this.loadImage('player1', '/assets/img/player1.png');
        this.loadImage('player2', '/assets/img/player2.png');
        this.loadImage('player3', '/assets/img/player3.png');
        this.loadImage('player1', '/assets/img/player1.png');

        this.initCanvas();
        this.fullscreenify();
    }

    loadImage(name, src) {
        this.images[name] = new Image();
        this.images[name].onload = () => {
            this.redrawCanvas();
        };
        this.images[name].src = src;
    }

    initCanvas(): void {
        this.context = CanvasRenderingContext2D = this.gameCanvas.nativeElement.getContext('2d');
    }

    playerDimensions = {
        x: 160 * 0.2,
        y: 250 * 0.2
    };
    calcEndPoint = this.maxWidth - this.playerDimensions.x;
    homePos = [0, 0, 0, 0, 0, 0, 0, 0];
    awayPos = [this.calcEndPoint, this.calcEndPoint, this.calcEndPoint, this.calcEndPoint,
    this.calcEndPoint, this.calcEndPoint, this.calcEndPoint, this.calcEndPoint];
    homeScore = 0;
    awayScore = 0;

    redrawCanvas() {
        let homePlayers = this.game.game.homePlayers;
        let awayPlayers = this.game.game.awayPlayers;
        // Draw to the canvas
        let canvasWidth = this.gameCanvas.nativeElement.width;
        let canvasHeight = this.gameCanvas.nativeElement.height;

        this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
        
        this.drawField();
        this.drawScore();

        // Draw the home players
        for (let i = 0; i < homePlayers.length; i++) {
            let downText = Math.round(homePlayers[i].kg);
            if (homePlayers[i].down) {
                this.calculateRecovery(0, i);
                downText = homePlayers[i].knockdown;
            }
            this.homePos[i] += this.playerMove(0, i);
            this.drawPlayer(this.images['player' + this.game.home.style], this.playerDimensions.x, this.playerDimensions.y,
                this.homePos[i], i * this.playerDimensions.y, homePlayers[i].last, downText);
        }
        // Draw the away players
        for (let i = 0; i < awayPlayers.length; i++) {
            let downText = Math.round(awayPlayers[i].kg);
            if (awayPlayers[i].down) {
                this.calculateRecovery(1, i);
                downText = awayPlayers[i].knockdown;
            }
            this.awayPos[i] -= this.playerMove(1, i);
            this.drawPlayer(this.images['player' + this.game.away.style], this.playerDimensions.x, this.playerDimensions.y,
                this.awayPos[i], i * this.playerDimensions.y, awayPlayers[i].last, downText);
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
        this.gameCanvas.nativeElement.width = (containerWidth);
        this.gameCanvas.nativeElement.height = (containerWidth) / 1.6;
        this.ratio = this.maxWidth / containerWidth;
    }

    drawField(): void {
        // Draws the field
        this.context.beginPath();
        this.context.rect(0, 0, this.maxWidth, this.maxHeight);
        this.context.fillStyle = 'green';
        this.context.fill();
    }

    drawPlayer(image: any, width: number, height: number, x, y, first: string, down: any): void {
        // Draws a single player
        if (!parseInt(down)) this.context.globalAlpha = 0.5;
        this.context.drawImage(image, x / this.ratio, y / this.ratio, width / this.ratio, height / this.ratio);
        this.context.globalAlpha = 1;
        this.context.font = 12 / this.ratio + 'px Arial';
        this.context.fillStyle = 'white';
        this.context.fillText(first, (x + 10) / this.ratio, (y + 16) / this.ratio);
        this.context.font = 12 / this.ratio + 'px Arial';
        this.context.fillStyle = 'white';
        this.context.fillText(down, (x + 10) / this.ratio, (y + 26) / this.ratio);
    }

    drawScore() {
        // Home Score
        this.context.font = 30 / this.ratio + 'px Arial';
        this.context.fillStyle = 'black';
        this.context.fillText('Home: ' + this.homeScore, 10, 60);
        // Away Score
        this.context.font = 30 / this.ratio + 'px Arial';
        this.context.fillStyle = 'black';
        this.context.fillText('Away: ' + this.awayScore, (this.maxWidth - 140) / this.ratio, 60);
    }

    playerMove(isAway, playerIndex) {
        let gameSpeed = 160;
        // Calculates if a player can move (or is stuck attacking opponents)
        if (isAway === 0) {
            // Home team
            if (this.game.game.homePlayers[playerIndex].down) return 0; // self is down

            if (!this.game.game.awayPlayers[playerIndex].down && this.awayPos[playerIndex] < this.homePos[playerIndex] + this.playerDimensions.x && this.homePos[playerIndex] < this.awayPos[playerIndex]) {
                // Colliding
                let rand = Math.random();
                if (rand > 0.9) {
                    this.game.game.awayPlayers[playerIndex].kg -= this.game.game.homePlayers[playerIndex].atk / (this.game.game.awayPlayers[playerIndex].def / 4);
                    if (this.game.game.awayPlayers[playerIndex].kg < 0) {
                        this.game.game.awayPlayers[playerIndex].down = true;
                    }
                }
            } else {
                // Not colliding
                let scoringZone = (this.maxWidth - this.playerDimensions.x) / this.ratio;
                if (!this.game.game.homePlayers[playerIndex].hasScored) {
                    if (this.homePos[playerIndex] > scoringZone && !this.game.game.homePlayers[playerIndex].hasScored) {
                        // In the scoring zone
                        this.game.game.homePlayers[playerIndex].hasScored = true;
                        this.homePos[playerIndex] = scoringZone;
                        this.homeScore++;
                    } else {
                        return this.game.game.homePlayers[playerIndex].spd / gameSpeed;
                    }
                }
                return 0;
            }
        } else {
            // Away team
            if (this.game.game.awayPlayers[playerIndex].down) return 0; // self is down

            if (!this.game.game.homePlayers[playerIndex].down && this.awayPos[playerIndex] < this.homePos[playerIndex] + this.playerDimensions.x && this.homePos[playerIndex] < this.awayPos[playerIndex]) {
                // Colliding
                let rand = Math.random();
                if (rand > 0.9) {
                    this.game.game.homePlayers[playerIndex].kg -= this.game.game.homePlayers[playerIndex].atk / (this.game.game.homePlayers[playerIndex].def / 4);
                    if (this.game.game.homePlayers[playerIndex].kg < 0) {
                        this.game.game.homePlayers[playerIndex].down = true;
                    }
                }
            } else {
                // Not colliding
                let scoringZone = 0;
                if (!this.game.game.awayPlayers[playerIndex].hasScored) {
                    if (this.awayPos[playerIndex] < scoringZone) {
                        // In the scoring zone
                        this.game.game.awayPlayers[playerIndex].hasScored = true;
                        this.awayPos[playerIndex] = scoringZone;
                        this.awayScore++;
                    } else {
                        return this.game.game.awayPlayers[playerIndex].spd / gameSpeed;
                    }
                }
                return 0;
            }
        }
        return 0;
    }

    calculateRecovery(isAway, playerIndex) {
        let homePlayers = this.game.game.homePlayers;
        let awayPlayers = this.game.game.awayPlayers;
        let randomRecoveryTime = 1500 + Math.random() * 6;
        if (isAway === 0) {
            // Home team
            if (homePlayers[playerIndex].knockdown === 'recover' && Math.random() < homePlayers[playerIndex].rec / 100) {
                setTimeout(() => {
                    homePlayers[playerIndex].down = false;
                    homePlayers[playerIndex].kg = homePlayers[playerIndex].def / 6; // give hp back
                }, randomRecoveryTime);
            } else {
                // Stay knocked down
                homePlayers[playerIndex].knockdown = 'knockdown';
            }
        } else {
            // Away team
            if (awayPlayers[playerIndex].knockdown === 'recover' && Math.random() < awayPlayers[playerIndex].rec / 100) {
                setTimeout(() => {
                    awayPlayers[playerIndex].down = false;
                    awayPlayers[playerIndex].kg = awayPlayers[playerIndex].def / 6; // give hp back
                }, randomRecoveryTime);
            } else {
                // Stay knocked down
                awayPlayers[playerIndex].knockdown = 'knockdown';
            }
        }
    }
}
