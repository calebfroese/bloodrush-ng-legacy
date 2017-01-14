import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

import { MongoService } from './../../mongo/mongo.service';

@Component({
    templateUrl: './game-detail.component.html',
    styles: [`
        .c-div {
            width: 100%;
        }
    `]
})
export class GameDetailComponent implements OnInit {
    isBye: boolean = false;
    nonByeTeam: string; // index of the team that is not null
    // Params
    gameId: number;
    seasonNumber: number;
    // Teams
    home: any; // original unmodified team
    away: any; // original unmodified team
    game: any; // the game object "game": { "data": {}, "round": Date(), etc}
    // Game data
    data: any; // additional game data
    homePos: any = [];
    awayPos: any = [];
    calcEndPoint: number = 0;
    homeScore = 0;
    awayScore = 0;
    timeStart = Date.now();
    timeCurrent = this.timeStart;
    timeElapsed = 0;
    qtr: any;
    qtrNum: number = 1; // round number


    @ViewChild('gameCanvas') gameCanvas: ElementRef;
    @ViewChild('cDiv') cDiv: ElementRef;
    context: any;
    x: number = 0;
    y: number = 0;
    images = {};
    fps = 40;
    // Scaling
    ratio: number;
    maxWidth: number = 1152;
    maxHeight: number = 720;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private mongo: MongoService,
        private zone: NgZone
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            // Fetch the season
            let seasonNumber: number = +params['seasonNumber'];
            this.seasonNumber = seasonNumber;
            let gameId: number = +params['gameId'];
            this.gameId = gameId;
            this.mongo.run('seasons', 'oneByNumber', { number: seasonNumber }).then(season => {
                this.game = season.games[gameId];
                if (season.games[gameId]) {
                    // The game exists, load the teams
                    this.mongo.run('teams', 'oneById', { _id: season.games[gameId].home }).then(teamHome => {
                        this.home = teamHome;
                        return this.mongo.run('teams', 'oneById', { _id: season.games[gameId].away });
                    }).then(awayTeam => {
                        this.away = awayTeam;
                        if (season.games[gameId].round && season.games[gameId].qtr) {
                            // Game has been played
                            this.data = season.games[gameId].data;
                            this.qtr = season.games[gameId].qtr;
                            for (let i = 0; i < 8; i++) {
                                for (let j = 1; j <= 4; j++) {
                                    this.qtr[j].homePlayers[i].scored = { qtr1: false, qtr2: false, qtr3: false, qtr4: false };
                                    this.qtr[j].awayPlayers[i].scored = { qtr1: false, qtr2: false, qtr3: false, qtr4: false };
                                }
                            }
                            this.zone.run(() => { });
                            this.initCanvas();
                        }
                    }).catch(err => {
                    });
                } else {
                    // Game does not exist
                    alert('Game does not exist!');
                }
            }).catch(err => {
                debugger;
            });
        });
    }

    runGame() {
        this.mongo.run('games', 'playGame', { 'seasonNumber': this.seasonNumber, 'gameNumber': this.gameId });
    }

    // CANVAS
    initCanvas(): void {
        this.loadImage('player1', '/assets/img/player1.png')
            .then(() => { return this.loadImage('player2', '/assets/img/player2.png'); })
            .then(() => { return this.loadImage('player3', '/assets/img/player3.png'); })
            .then(() => { return this.loadImage('player4', '/assets/img/player4.png'); })
            .then(() => {
                // All images loaded
                if (this.gameCanvas) {
                    this.context = CanvasRenderingContext2D = this.gameCanvas.nativeElement.getContext('2d');
                    this.initVariables();
                    this.playGame();
                    this.redrawCanvas();
                } else {
                    setTimeout(() => {
                        this.initCanvas();
                    }, 10);
                }
            });
    }

    initVariables(): void {
        // Calculate end point
        this.calcEndPoint = this.maxWidth - this.data.playerAttr.x;
        // Generate player positions
        this.homePos = [];
        this.awayPos = [];
        for (let i = 0; i < 8; i++) {
            this.homePos.push({ x: 0, y: this.data.playerAttr.y * i, r: 0, recalc: 0, targetIndex: i });
            this.awayPos.push({ x: this.calcEndPoint, y: this.data.playerAttr.y * i, r: 0, recalc: 0, targetIndex: i });
        }
        // Set a timeout to end the round
        setTimeout(() => {
            if (this.qtrNum < 4) {
                this.qtrNum++;
                this.cachedQtrNum = this.qtrNum;
                this.initVariables();
            } else {
                console.log('end')
            }
        }, this.data.gameAttr.roundDuration);
    }

    playGame(): void {
        this.fullscreenify();
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

    cachedQtrNum = this.qtrNum;
    redrawCanvas() {
        if (this.cachedQtrNum !== this.qtrNum) {
            return;
        }
        let homePlayers = this.qtr[this.qtrNum].homePlayers;
        let awayPlayers = this.qtr[this.qtrNum].awayPlayers;
        // Draw to the canvas
        let canvasWidth = this.gameCanvas.nativeElement.width;
        let canvasHeight = this.gameCanvas.nativeElement.height;

        this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);

        this.drawField();

        // Draw the home players
        for (let i = 0; i < homePlayers.length; i++) {
            let downText = Math.round(homePlayers[i].kg);
            if (homePlayers[i].down) {
                this.calculateRecovery('home', i);
                downText = homePlayers[i].knockdown;
            }
            this.homePos[i] = this.playerLogic(this.homePos[i], 'home', i);
            this.drawPlayer(this.images['player' + this.home.style], this.data.playerAttr.x, this.data.playerAttr.y,
                this.homePos[i].x, this.homePos[i].y, homePlayers[i].first, homePlayers[i].last, downText, this.home.col1);
        }
        // Draw the away players
        for (let i = 0; i < awayPlayers.length; i++) {
            let downText = Math.round(awayPlayers[i].kg);
            if (awayPlayers[i].down) {
                this.calculateRecovery('away', i);
                downText = awayPlayers[i].knockdown;
            }
            this.awayPos[i] = this.playerLogic(this.awayPos[i], 'away', i);
            this.drawPlayer(this.images['player' + this.away.style], this.data.playerAttr.x, this.data.playerAttr.y,
                this.awayPos[i].x, this.awayPos[i].y, awayPlayers[i].first, awayPlayers[i].last, downText, this.away.col1);
        }
        // Update time
        this.timeCurrent = Date.now();
        this.timeElapsed = this.timeCurrent - this.timeStart;

        setTimeout(() => {
            this.redrawCanvas();
        }, 1000 / this.fps);
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

    drawPlayer(image: any, width: number, height: number, x, y, first: string, last: string, down: any, color: string): void {
        // Draws a single player
        if (!parseInt(down)) this.context.globalAlpha = 0.3;
        this.context.drawImage(image, x / this.ratio, y / this.ratio, width / this.ratio, height / this.ratio);
        // Font
        this.context.font = 12 / this.ratio + 'px Arial';
        this.context.fillStyle = color;
        this.context.fillText(first, (x) / this.ratio, (y - 14) / this.ratio);
        this.context.fillText(last, (x) / this.ratio, (y - 4) / this.ratio);
        this.context.globalAlpha = 1;
    }

    playerLogic(playerPos, team, i) {
        /**
         * Calculates the player logic
         * @param {x, y, r} playerPos
         * @param {string} team // home or away
         * @param {number} i // player index in array e.g. homePlayers[i]
         */
        let oTeam = (team === 'home') ? 'away' : 'home'; // other team
        let teamPlayers = this.qtr[this.qtrNum][team + 'Players'];
        let oPlayers = this.qtr[this.qtrNum][oTeam + 'Players'];
        let oPos = this[oTeam + 'Pos'];

        // If down or scored
        if (teamPlayers[i].kg <= 0 || teamPlayers[i].scored['qtr' + this.qtrNum]) return playerPos;

        // Run through to find the closest enemy
        if (this.timeElapsed > playerPos.recalc && oPlayers[i].down) {
            let lowestC = 1000000000; // unreasonably higher number that any player will be closer than
            playerPos.targetIndex = null;
            for (let x = 0; x < 8; x++) {
                if (oPlayers[x].kg > 0) {
                    let a = playerPos.x - oPos[x].x;
                    let b = playerPos.y - oPos[x].y;
                    let c = Math.sqrt(a * a + b * b);
                    if (c < lowestC && c < this.data.playerAttr.visionRadius) {
                        lowestC = c;
                        playerPos.targetIndex = x;
                    }
                }
            }
            // Reset the timer until next recalculation of target
            playerPos.recalc = this.timeElapsed + 1000;
        }

        if (playerPos.targetIndex && oPlayers[playerPos.targetIndex].scored['qtr' + this.qtrNum] === true) {
            playerPos.targetIndex = null;
        }

        if (playerPos.targetIndex !== null && !oPlayers[playerPos.targetIndex].down) {
            // Target is alive, check if nearby enough to attack
            let a = playerPos.x - oPos[playerPos.targetIndex].x;
            let b = playerPos.y - oPos[playerPos.targetIndex].y;
            let c = Math.sqrt(a * a + b * b);

            if (c <= this.data.playerAttr.attackRadius) {
                // ATTACK THE ENEMY
                if (this.timeElapsed > playerPos.atkTime || !playerPos.atkTime) {
                    let genNextTime: number = 800 + parseInt(Math.round(this.timeCurrent * playerPos.x).toString().substr(-2));
                    playerPos.atkTime = this.timeElapsed + genNextTime + teamPlayers[i].spd; // REMOVE ME
                    this.qtr[this.qtrNum][oTeam + 'Players'][playerPos.targetIndex].kg -= 8 + (teamPlayers[i].atk / oPlayers[playerPos.targetIndex].def) * 8;
                    if (this.qtr[this.qtrNum][oTeam + 'Players'][playerPos.targetIndex].kg <= 0) {
                        this.qtr[this.qtrNum][oTeam + 'Players'][playerPos.targetIndex].down = true;
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
                playerPos.x += (calcX * teamPlayers[i].spd) / this.data.gameAttr.speedMultiplier;
                playerPos.y += (calcY * teamPlayers[i].spd) / this.data.gameAttr.speedMultiplier;

                // Rotate us to face the player
                playerPos.r = Math.atan2(calcY, calcX);
            }
        } else {
            // MOVE TO END field
            let moveDirection = (team === 'home') ? 1 : -1;
            if (playerPos.x >= this.calcEndPoint && moveDirection === 1 ||
                playerPos.x <= 0 && moveDirection === -1) {
                this.qtr[this.qtrNum][team + 'Players'][i].scored['qtr' + this.qtrNum] = true;
                this[team + 'Score']++;
            } else {
                playerPos.x += (teamPlayers[i].spd / this.data.gameAttr.speedMultiplier) * moveDirection;
            }
        }
        return playerPos;
    }

    calculateRecovery(team, playerIndex) {
        if (this.cachedQtrNum !== this.qtrNum) {
            return;
        }
        let homePlayers = this.qtr[this.qtrNum].homePlayers;
        let awayPlayers = this.qtr[this.qtrNum].awayPlayers;

        let recoveryTime = 6000;

        if (team === 'home') {
            // Home team
            if (homePlayers[playerIndex].knockdown === 'recover') {
                setTimeout(() => {
                    homePlayers[playerIndex].down = false;
                    homePlayers[playerIndex].kg = homePlayers[playerIndex].def / 6; // give hp back
                }, recoveryTime);
            }
            homePlayers[playerIndex].knockdown = 'knockdown';
        } else {
            // Away team
            if (awayPlayers[playerIndex].knockdown === 'recover') {
                setTimeout(() => {
                    awayPlayers[playerIndex].down = false;
                    awayPlayers[playerIndex].kg = awayPlayers[playerIndex].def / 6; // give hp back
                }, recoveryTime);
            }
            awayPlayers[playerIndex].knockdown = 'knockdown';
        }
    }
}
