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
    homePos = [{ x: 0, y: this.playerDimensions.y * 0, r: 0, recalc: 0 }, { x: 0, y: this.playerDimensions.y * 1, r: 0, recalc: 0 }, { x: 0, y: this.playerDimensions.y * 2, r: 0, recalc: 0 }, { x: 0, y: this.playerDimensions.y * 3, r: 0, recalc: 0 }, { x: 0, y: this.playerDimensions.y * 4, r: 0, recalc: 0 }, { x: 0, y: this.playerDimensions.y * 5, r: 0, recalc: 0 }, { x: 0, y: this.playerDimensions.y * 6, r: 0, recalc: 0 }, { x: 0, y: this.playerDimensions.y * 7, r: 0, recalc: 0 }];
    awayPos = [{ x: this.calcEndPoint, y: this.playerDimensions.y * 0, r: 0, recalc: 0 }, { x: this.calcEndPoint, y: this.playerDimensions.y * 1, r: 0, recalc: 0 }, { x: this.calcEndPoint, y: this.playerDimensions.y * 2, r: 0, recalc: 0 }, { x: this.calcEndPoint, y: this.playerDimensions.y * 3, r: 0, recalc: 0 }, { x: this.calcEndPoint, y: this.playerDimensions.y * 4, r: 0, recalc: 0 }, { x: this.calcEndPoint, y: this.playerDimensions.y * 5, r: 0, recalc: 0 }, { x: this.calcEndPoint, y: this.playerDimensions.y * 6, r: 0, recalc: 0 }, { x: this.calcEndPoint, y: this.playerDimensions.y * 7, r: 0, recalc: 0 }];
    homeScore = 0;
    awayScore = 0;
    timeStart = Date.now();
    timeCurrent = this.timeStart;
    timeElapsed = 0;

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
            this.homePos[i] = this.playerLogic(this.homePos[i], 'home', i);
            this.drawPlayer(this.images['player' + this.game.home.style], this.playerDimensions.x, this.playerDimensions.y,
                this.homePos[i].x, this.homePos[i].y, homePlayers[i].last, downText);
        }
        // Draw the away players
        for (let i = 0; i < awayPlayers.length; i++) {
            let downText = Math.round(awayPlayers[i].kg);
            if (awayPlayers[i].down) {
                this.calculateRecovery(1, i);
                downText = awayPlayers[i].knockdown;
            }
            this.awayPos[i] = this.playerLogic(this.awayPos[i], 'away', i);
            this.drawPlayer(this.images['player' + this.game.away.style], this.playerDimensions.x, this.playerDimensions.y,
                this.awayPos[i].x, this.awayPos[i].y, awayPlayers[i].last, downText);
        }
        // Update time
        this.timeCurrent = Date.now();
        this.timeElapsed = this.timeCurrent - this.timeStart;
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
        if (!parseInt(down)) this.context.globalAlpha = 0.3;
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

    playerLogic(playerPos, team, i) {
        /**
         * Calculates the player logic
         * @param {x, y, r} playerPos
         * @param {string} team // home or away
         * @param {number} i // player index in array e.g. homePlayers[i]
         */
        let gameSpeed = 160;
        let oTeam = (team === 'home') ? 'away' : 'home'; // other team
        let teamPlayers = this.game.game[team + 'Players'];
        let oPlayers = this.game.game[oTeam + 'Players'];
        let oPos = this[oTeam + 'Pos'];

        // If down
        if(teamPlayers[i].down) return playerPos;

        if (!playerPos.targetIndex) playerPos.targetIndex = i;

        // Run through to find the closest enemy
        if (this.timeElapsed > playerPos.recalc && oPlayers[i].down) {
            let lowestC = 1000000000; // unreasonably higher number that any player will be closer than
            for (let x = 0; x < 8; x++) {
                if (!oPlayers[x].down) {
                    let a = playerPos.x - oPos[x].x;
                    let b = playerPos.y - oPos[x].y;
                    let c = Math.sqrt(a * a + b * b);
                    if (c < lowestC) {
                        lowestC = c;
                        playerPos.targetIndex = x;
                    }
                }
            }
            // Reset the timer until next recalculation of target
            playerPos.recalc = this.timeElapsed + 1000;
        }

        if (!oPlayers[playerPos.targetIndex].down) {
            // Target is alive, check if nearby enough to attack
            let a = playerPos.x - oPos[playerPos.targetIndex].x;
            let b = playerPos.y - oPos[playerPos.targetIndex].y;
            let c = Math.sqrt(a * a + b * b);

            if (c <= 50) {
                // ATTACK THE ENEMY
                if (Math.random() * 100 < 4) {
                    this.game.game[oTeam + 'Players'][playerPos.targetIndex].kg -= teamPlayers[i].atk / oPlayers[playerPos.targetIndex].def;
                    if (this.game.game[oTeam + 'Players'][playerPos.targetIndex].kg <= 0) {
                        this.game.game[oTeam + 'Players'][playerPos.targetIndex].down = true;
                    }
                }
            } else {
                // MOVE TOWARDS ENEMY

                // Calculate direction towards player
                let calcX = this[oTeam + 'Pos'][playerPos.targetIndex].x - playerPos.x;
                let calcY = this[oTeam + 'Pos'][playerPos.targetIndex].y - playerPos.y;

                // Normalize
                let toEnemyLength = Math.sqrt(calcX * calcX + calcY * calcY);
                calcX = calcX / toEnemyLength;
                calcY = calcY / toEnemyLength;

                // Move towards the enemy
                playerPos.x += (calcX * teamPlayers[i].spd) / 100;
                playerPos.y += (calcY * teamPlayers[i].spd) / 100;

                // Rotate us to face the player
                playerPos.r = Math.atan2(calcY, calcX);
            }
        }
        return playerPos;
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
