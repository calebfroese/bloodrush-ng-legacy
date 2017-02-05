import {Location} from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import * as moment from 'moment';

import {environment} from './../../../environments/environment';
import {ApiService} from './../../shared/api/api.service';
import {Config} from './../../shared/config';

@Component({
  templateUrl: './game-detail.component.html',
  styles: [`
        .c-div {
            width: 100%;
        }
        progress {
          border-radius: 0px;
        }
    `]
})
export class GameDetailComponent implements OnInit {
  // UI STUFF
  gameTime: string;
  startsIn: string;
  live: boolean = false;
  roundPercent: number = 0;
  imgUrl = Config[environment.envName].imgUrl;
  events: any[] = [];
  gameFinished: boolean = false;
  showNames: boolean = false;

  // GAME STUFF
  isBye: boolean = false;
  nonByeTeam: string;  // index of the team that is not null
  // Params
  gameId: string;
  seasonId: string;
  // season: any;
  // Teams
  home: any;  // original unmodified team
  away: any;  // original unmodified team
  game: any;  // the game object "game": { "data": {}, "round": Date(), etc}
  self = this;
  bye: string = null;  // 'home' or 'away' or null;
  // Game data
  data: any;  // additional game data
  homePos: any = [];
  awayPos: any = [];
  calcEndPoint: number = 0;
  homeScore = 0;
  awayScore = 0;
  timeStart = 0;
  timeCurrent = 0;
  timeElapsed = 0;
  timeNextRound = null;
  qtr: any;
  cachedQtrNum = this.qtrNum;
  qtrDeadInjArray = {
    home: [],
    away: []
  };                   // arrays of injured/dead players to be replaced
  qtrNum: number = 0;  // round number

  @ViewChild('gameCanvas') gameCanvas: ElementRef;
  @ViewChild('cDiv') cDiv: ElementRef;
  context: any;
  images = {};
  // Scaling
  ratio: number;
  maxWidth: number = 1152;
  maxHeight: number = 822;

  constructor(
      private route: ActivatedRoute, private router: Router,
      private location: Location, private api: ApiService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      // Fetch the season
      let seasonId: string = this.seasonId = params['seasonId'];
      let gameId: number = this.gameId = params['gameId'];
      this.api.run('get', `/games/${gameId}`, '', {}).then(game => {
        this.game = game;
        this.data = game.data;
        console.log(game);
        this.api.run('get', `/teams/${game.homeId}`, '', {})
            .then(teamHome => {
              this.home = teamHome;
              return this.api.run('get', `/teams/${game.awayId}`, '', {})
            })
            .then(teamAway => {
              this.away = teamAway;
              if (this.data.live) {
                // Game has been played
                this.preloadImages().then(() => {
                  // Images are loaded
                  this.checkCanvasThenInit();
                });
              } else {
                // Game has not been played
                this.preGame();
              }
            });

      });
    });
  }

  runGame(): void {
    // Manually runs the game. TODO remove this
    this.api.run('post', `/games/generate`, `&gameId=${this.gameId}`, {})
        .then(() => {
          console.log('game is generated');
        });
  }

  preGame(): void {
    if (this.router.url.indexOf(this.gameId) === -1) {
      console.log('returning!');
      return;
    }
    let duration = moment.duration(moment(this.game.date).diff(moment()));
    this.gameTime = moment(this.game.date).format('LLLL');
    // Calculate the time it starts in
    let seconds = duration.asSeconds() + 3;
    if (duration.asWeeks() >= 2) {
      this.startsIn = Math.floor(duration.asWeeks()).toString() + ' weeks';
      setTimeout(() => {
        this.preGame();
      }, 3600000);  // every hour
    } else if (duration.asDays() >= 2) {
      this.startsIn = Math.floor(duration.asDays()).toString() + ' days';
      setTimeout(() => {
        this.preGame();
      }, 3600000);  // every hour
    } else if (duration.asHours() >= 1) {
      this.startsIn = Math.floor(duration.asHours()).toString() + ' hours';
      setTimeout(() => {
        this.preGame();
      }, 60000);  // every min
    } else if (duration.asSeconds() >= 60) {
      this.startsIn = Math.floor(duration.asMinutes()).toString() + ' minutes';
      setTimeout(() => {
        this.preGame();
      }, 5000);  // every 5 second
    } else {
      if (seconds < 0) {
        // Start the game!
        this.startsIn = 'LIVE';
        this.live = true;
        this.ngOnInit();
      } else {
        this.startsIn = Math.floor(seconds).toString();
        setTimeout(() => {
          this.preGame();
        }, 1000);  // every second
      }
    }
  }

  checkCanvasThenInit(): void {
    setTimeout(() => {
      if (this.gameCanvas && this.cDiv) {
        this.context = CanvasRenderingContext2D =
            this.gameCanvas.nativeElement.getContext('2d');
        this.events.push({team: null, text: 'The game has started!'});
        this.fullscreenify();
        this.initializeGame();
      } else {
        this.checkCanvasThenInit();
      }
    }, 100);
  }

  // CANVAS
  preloadImages(): Promise<void> {
    return this.loadImage('field', '/assets/img/fields/field3.png')
        .then(() => {
          return this.loadImage(
              'home1',
              `${Config[environment.envName].imgUrl}player/output/${this.home.id
              }-1.png`);
        })
        .then(() => {
          return this.loadImage(
              'home4',
              `${Config[environment.envName].imgUrl}player/output/${this.home.id
              }-4.png`);
        })
        .then(() => {
          return this.loadImage(
              'home7',
              `${Config[environment.envName].imgUrl}player/output/${this.home.id
              }-7.png`);
        })
        .then(() => {
          return this.loadImage(
              'home7.4',
              `${Config[environment.envName].imgUrl}player/output/${this.home.id
              }-4.png`);
        })
        .then(() => {
          return this.loadImage(
              'away1',
              `${Config[environment.envName].imgUrl}player/output/${this.away.id
              }-1r.png`);
        })
        .then(() => {
          return this.loadImage(
              'away4',
              `${Config[environment.envName].imgUrl}player/output/${this.away.id
              }-4r.png`);
        })
        .then(() => {
          return this.loadImage(
              'away7',
              `${Config[environment.envName].imgUrl}player/output/${this.away.id
              }-7r.png`);
        })
        .then(() => {
          return this.loadImage(
              'away7.4',
              `${Config[environment.envName].imgUrl}player/output/${this.away.id
              }-4r.png`);
        });
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

  fullscreenify(): void {
    this.resizeScreen();
    window.addEventListener('resize', () => {
      this.resizeScreen();
    }, false);
  }

  resizeScreen(): void {
    let containerWidth = this.cDiv.nativeElement.offsetWidth;
    this.gameCanvas.nativeElement.width = (containerWidth);
    this.gameCanvas.nativeElement.height = (containerWidth) / 1.4;
    this.ratio = this.maxWidth / containerWidth;
  }

  drawField(): void {
    // Draws the field
    this.context.drawImage(
        this.images['field'], 0, 0, this.maxWidth / this.ratio,
        this.maxHeight / this.ratio);
  }

  drawPlayer(
      image: any, width: number, height: number, x, y, first: string,
      last: string, down: boolean, color: string): void {
    // Draws a single player
    if (down) {
      this.context.globalAlpha = 0.3;
    }
    if (this.showNames) {
      this.context.font = '30px Arial';
      this.context.fillText(last, x / this.ratio, y / this.ratio);
    }
    this.context.drawImage(
        image, x / this.ratio, y / this.ratio, width / this.ratio,
        height / this.ratio);
    this.context.globalAlpha = 1;
  }

  // GAME

  initializeGame(): void {
    // This will start the game playing
    this.initializePlayers();
    this.checkRoundEnd();
    this.redrawCanvas();
  }

  initializePlayers(): void {
    this.data = this.game.data;
    this.qtr = this.game.qtr;
    for (let i = 0; i < 8; i++) {
      for (let j = 1; j <= 4; j++) {
        if (this.qtr[j].homePlayers[i]) {
          this.qtr[j].homePlayers[i].scored =
              {qtr1: false, qtr2: false, qtr3: false, qtr4: false};
        }
        if (this.qtr[j].awayPlayers[i]) {
          this.qtr[j].awayPlayers[i].scored =
              {qtr1: false, qtr2: false, qtr3: false, qtr4: false};
        }
      }
    }
    for (let i = 8; i < 12; i++) {
      for (let j = 1; j <= 4; j++) {
        if (this.qtr[j].homePlayers[i])
          this.qtr[j].homePlayers[i].scored =
              {qtr1: false, qtr2: false, qtr3: false, qtr4: false};
        if (this.qtr[j].awayPlayers[i])
          this.qtr[j].awayPlayers[i].scored =
              {qtr1: false, qtr2: false, qtr3: false, qtr4: false};
      }
    }
  }

  newRound(): void {
    if (this.qtrNum > 0)
      this.events.push({
        team: null,
        text: `Quarter ${this.qtrNum} finished. Score is ${this.home
                  .name} ${this.homeScore}, ${this.away.name} ${this.awayScore}`
      });
    this.replaceWithSub();
    // Calculate end point
    this.calcEndPoint = this.maxWidth - this.data.playerAttr.x;
    // Generate player positions
    this.homePos = [];
    this.awayPos = [];
    for (let i = 0; i < 8; i++) {
      this.homePos.push({
        x: 0,
        y: (this.data.playerAttr.y / this.data.playerAttr.playerYSpacing) * i,
        r: 0,
        recalc: 0,
        targetIndex: i,
        frame: 1,
        framecalc: 0
      });
      this.awayPos.push({
        x: this.calcEndPoint,
        y: (this.data.playerAttr.y / this.data.playerAttr.playerYSpacing) * i,
        r: 0,
        recalc: 0,
        targetIndex: i,
        frame: 1,
        framecalc: 0
      });
    }
    this.timeCurrent = this.timeElapsed = this.timeStart = this.timeNextRound =
        0;
    this.qtrNum++;
    this.cachedQtrNum = this.qtrNum;
  }

  checkRoundEnd() {
    if (this.gameFinished) return;
    if (this.timeCurrent >= this.timeNextRound || !this.timeNextRound) {
      if (this.qtrNum < 4) {
        this.newRound();
        this.timeNextRound =
            this.timeCurrent + this.data.gameAttr.roundDuration;
      } else {
        this.gameFinished = true;
        this.events.push({
          team: null,
          text: `Game finished. Final score is ${this.home.name
                } ${this.homeScore}, ${this.away.name} ${this.awayScore}`
        });
      }
    }
  }

  redrawCanvas() {
    this.roundPercent =
        1000 - Math.round((this.timeElapsed / this.timeNextRound) * 1000);
    if (this.cachedQtrNum !== this.qtrNum) {
      return;
    }
    let homePlayers = this.qtr[this.qtrNum].homePlayers;
    let awayPlayers = this.qtr[this.qtrNum].awayPlayers;
    // Draw to the canvas
    let canvasWidth = this.gameCanvas.nativeElement.width;
    let canvasHeight = this.gameCanvas.nativeElement.height;

    this.context.clearRect(
        0, 0, this.gameCanvas.nativeElement.width,
        this.gameCanvas.nativeElement.height);

    this.drawField();

    // Draw the home players
    for (let i = 0; i < 8; i++) {
      if (homePlayers[i]) {
        let downText = Math.round(homePlayers[i].kg);
        if (homePlayers[i].down) {
          this.calculateRecovery('home', i);
          downText = homePlayers[i].knockdown;
        }
        this.homePos[i] = this.playerLogic(this.homePos[i], 'home', i);
        this.drawPlayer(
            this.images['home' + this.homePos[i].frame], this.data.playerAttr.x,
            this.data.playerAttr.y, this.homePos[i].x, this.homePos[i].y,
            homePlayers[i].first, homePlayers[i].last, homePlayers[i].down,
            this.home.col1);
      }
    }
    // Draw the away players
    for (let i = 0; i < 8; i++) {
      if (awayPlayers[i]) {
        let downText = Math.round(awayPlayers[i].kg);
        if (awayPlayers[i].down) {
          this.calculateRecovery('away', i);
          downText = awayPlayers[i].knockdown;
        }
        this.awayPos[i] = this.playerLogic(this.awayPos[i], 'away', i);
        this.drawPlayer(
            this.images['away' + this.awayPos[i].frame], this.data.playerAttr.x,
            this.data.playerAttr.y, this.awayPos[i].x, this.awayPos[i].y,
            awayPlayers[i].first, awayPlayers[i].last, awayPlayers[i].down,
            this.away.col1);
      }
    }
    // Update time
    if (!this.gameFinished)
      this.timeElapsed = this.timeCurrent - this.timeStart;

    setTimeout(() => {
      this.timeCurrent += this.data.gameAttr.fps;
      this.checkRoundEnd();
      this.redrawCanvas();
    }, this.data.gameAttr.fps);
  }

  playerLogic(playerPos, team, i) {
    if (this.gameFinished) return playerPos;
    /**
     * Calculates the player logic
     * @param {x, y, r} playerPos
     * @param {string} team // home or away
     * @param {number} i // player index in array e.g. homePlayers[i]
     */
    let oTeam = (team === 'home') ? 'away' : 'home';  // other team
    let teamPlayers = this.qtr[this.qtrNum][team + 'Players'];
    let oPlayers = this.qtr[this.qtrNum][oTeam + 'Players'];
    let oPos = (team === 'home') ? this.awayPos : this.homePos;
    if (!teamPlayers[i]) return;
    // If down or scored
    if (teamPlayers[i].kg <= 0 || teamPlayers[i].scored['qtr' + this.qtrNum])
      return playerPos;
    // Run through to find the closest enemy
    if (this.timeElapsed > playerPos.recalc && !oPlayers[i] ||
        this.timeElapsed > playerPos.recalc && oPlayers[i].down) {
      let lowestC = 1000000000;  // unreasonably higher number that any player
                                 // will be closer than
      playerPos.targetIndex = null;
      for (let x = 0; x < 8; x++) {
        if (oPlayers[x] && oPlayers[x].kg > 0) {
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
      playerPos.recalc = this.timeElapsed + 100;
    }
    // If the player's target has scored/injured/dead, remove them as the target
    if (!oPlayers[playerPos.targetIndex] ||
        playerPos.targetIndex &&
            oPlayers[playerPos.targetIndex].scored['qtr' + this.qtrNum] ===
                true) {
      playerPos.targetIndex = null;
    }

    if (playerPos.targetIndex !== null && oPos[playerPos.targetIndex] &&
        oPlayers[playerPos.targetIndex] &&
        !oPlayers[playerPos.targetIndex].down) {
      // Target is alive, check if nearby enough to attack
      let a = playerPos.x - oPos[playerPos.targetIndex].x;
      let b = playerPos.y - oPos[playerPos.targetIndex].y;
      let c = Math.sqrt(a * a + b * b);

      if (c <= this.data.playerAttr.attackRadius) {
        // ATTACK THE ENEMY
        if (this.timeElapsed > playerPos.atkTime || !playerPos.atkTime) {
          let genNextTime: number =
              800 + parseInt(Math.round(this.timeCurrent * playerPos.x)
                                 .toString()
                                 .substr(0, 2));
          playerPos.atkTime =
              this.timeElapsed + genNextTime + teamPlayers[i].spd;
          this.qtr[this.qtrNum][oTeam + 'Players'][playerPos.targetIndex].kg -=
              this.data.gameAttr.atkBase +
              (teamPlayers[i].atk / oPlayers[playerPos.targetIndex].def) *
                  this.data.gameAttr.atkMultiplier;
          if (this.qtr[this.qtrNum][oTeam + 'Players'][playerPos.targetIndex]
                  .kg <= 0) {
            this.qtr[this.qtrNum][oTeam + 'Players'][playerPos.targetIndex]
                .down = true;
          }
        }
      } else {
        // MOVE TOWARDS ENEMY

        // Calculate direction towards player
        let calcX = oPos[playerPos.targetIndex].x - playerPos.x;
        let calcY = oPos[playerPos.targetIndex].y - playerPos.y;

        // Normalize
        let toEnemyLength = Math.sqrt(calcX * calcX + calcY * calcY);
        calcX = calcX / toEnemyLength;
        calcY = calcY / toEnemyLength;

        // Move towards the enemy
        playerPos.x +=
            (calcX * teamPlayers[i].spd) / this.data.gameAttr.speedMultiplier;
        playerPos.y +=
            (calcY * teamPlayers[i].spd) / this.data.gameAttr.speedMultiplier;

        // Rotate us to face the player
        playerPos.r = Math.atan2(calcY, calcX);
      }
    } else {
      // MOVE TO END field
      let moveDirection = (team === 'home') ? 1 : -1;
      if (playerPos.x >= this.calcEndPoint && moveDirection === 1 ||
          playerPos.x <= 0 && moveDirection === -1) {
        this.qtr[this.qtrNum][team + 'Players'][i].scored['qtr' + this.qtrNum] =
            true;
        if (team === 'home') this.homeScore++;
        if (team === 'away') this.awayScore++;
      } else {
        playerPos.x +=
            (teamPlayers[i].spd / this.data.gameAttr.speedMultiplier) *
            moveDirection;
      }
    }
    // Graphics
    if (this.timeElapsed > playerPos.framecalc) {
      playerPos.framecalc = this.timeElapsed + 120 - (teamPlayers[i].spd / 2);
      if (playerPos.frame === 1) {
        playerPos.frame = 4;
      } else if (playerPos.frame === 4) {
        playerPos.frame = 7;
      } else if (playerPos.frame === 7) {
        playerPos.frame = 7.4;
      } else if (playerPos.frame === 7.4) {
        playerPos.frame = 1;
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

    let recoveryTime = this.data.playerAttr.recoveryTime;

    if (team === 'home') {
      // Home team
      if (homePlayers[playerIndex].knockdown === 'recover') {
        setTimeout(() => {
          homePlayers[playerIndex].down = false;
          homePlayers[playerIndex].kg =
              homePlayers[playerIndex].def / 6;  // give hp back
        }, recoveryTime);
      } else if (homePlayers[playerIndex].knockdown === 'injured') {
        this.qtrDeadInjArray.home.push(playerIndex);
        this.events.push({
          team: 'home',
          text:
              `<a href="/players/${homePlayers[playerIndex].id}">${homePlayers[playerIndex].first} ${homePlayers[playerIndex].last
              }</a> was injured`
        });
      } else if (homePlayers[playerIndex].knockdown === 'dead') {
        this.qtrDeadInjArray.home.push(playerIndex);
        this.events.push({
          team: 'home',
          text:
              `<a href="/players/${homePlayers[playerIndex].id}">${homePlayers[playerIndex].first} ${homePlayers[playerIndex].last
              }</a> died`
        });
      }
      homePlayers[playerIndex].knockdown = 'knockdown';
    } else {
      // Away team
      if (awayPlayers[playerIndex].knockdown === 'recover') {
        setTimeout(() => {
          awayPlayers[playerIndex].down = false;
          awayPlayers[playerIndex].kg =
              awayPlayers[playerIndex].def / 6;  // give hp back
        }, recoveryTime);
      } else if (awayPlayers[playerIndex].knockdown === 'injured') {
        this.qtrDeadInjArray.away.push(playerIndex);
        this.events.push({
          team: 'away',
          text:
              `<a href="/players/${awayPlayers[playerIndex].id}">${awayPlayers[playerIndex].first} ${awayPlayers[playerIndex].last
              }</a> was injured`
        });
      } else if (awayPlayers[playerIndex].knockdown === 'dead') {
        this.qtrDeadInjArray.away.push(playerIndex);
        this.events.push({
          team: 'away',
          text:
              `<a href="/players/${awayPlayers[playerIndex].id}">${awayPlayers[playerIndex].first} ${awayPlayers[playerIndex].last
              }</a> died`
        });
      }
      awayPlayers[playerIndex].knockdown = 'knockdown';
    }
  }

  replaceWithSub(): void {
    console.log(
        'reaplceWithSub: home replacements:', this.qtrDeadInjArray.home.length);
    console.log(
        'reaplceWithSub: away replacements:', this.qtrDeadInjArray.away.length);
    // Remove the local player in the game object
    // Iterate for each game quarter
    for (let needReplaceIndexC = 0;
         needReplaceIndexC < this.qtrDeadInjArray.home.length;
         needReplaceIndexC++) {
      // Replace out the unable to play player
      console.log('home going through dead array');
      this.qtr[1].homePlayers[this.qtrDeadInjArray.home[needReplaceIndexC]] =
          null;
      this.qtr[2].homePlayers[this.qtrDeadInjArray.home[needReplaceIndexC]] =
          null;
      this.qtr[3].homePlayers[this.qtrDeadInjArray.home[needReplaceIndexC]] =
          null;
      this.qtr[4].homePlayers[this.qtrDeadInjArray.home[needReplaceIndexC]] =
          null;
      for (let k = 8; k < 12; k++) {
        console.log('home finding a replacement');
        if (this.qtr[1].homePlayers[k] &&
            this.qtrDeadInjArray.home[needReplaceIndexC]) {
          this.events.push({
            team: 'home',
            text: `${this.qtr[1]
                      .homePlayers[k]
                      .first} ${this.qtr[1]
                      .homePlayers[k]
                      .last} was subbed on`
          });
          this.qtr[1]
              .homePlayers[this.qtrDeadInjArray.home[needReplaceIndexC]] =
              this.qtr[1].homePlayers[k];
          this.qtr[2]
              .homePlayers[this.qtrDeadInjArray.home[needReplaceIndexC]] =
              this.qtr[2].homePlayers[k];
          this.qtr[3]
              .homePlayers[this.qtrDeadInjArray.home[needReplaceIndexC]] =
              this.qtr[3].homePlayers[k];
          this.qtr[4]
              .homePlayers[this.qtrDeadInjArray.home[needReplaceIndexC]] =
              this.qtr[4].homePlayers[k];
          this.qtr[1].homePlayers[k] =
              this.qtrDeadInjArray.home[needReplaceIndexC] = null;
        }
      }
    }
    for (let needReplaceIndexC = 0;
         needReplaceIndexC < this.qtrDeadInjArray.away.length;
         needReplaceIndexC++) {
      // Replace out the unable to play player
      console.log(
          'nulling out player index',
          this.qtrDeadInjArray.away[needReplaceIndexC]);
      this.qtr[1].awayPlayers[this.qtrDeadInjArray.away[needReplaceIndexC]] =
          null;
      this.qtr[2].awayPlayers[this.qtrDeadInjArray.away[needReplaceIndexC]] =
          null;
      this.qtr[3].awayPlayers[this.qtrDeadInjArray.away[needReplaceIndexC]] =
          null;
      this.qtr[4].awayPlayers[this.qtrDeadInjArray.away[needReplaceIndexC]] =
          null;
      for (let k = 8; k < 12; k++) {
        console.log('possible replacement of', this.qtr[1].awayPlayers);
        if (this.qtr[1].awayPlayers[k] &&
            this.qtrDeadInjArray.away[needReplaceIndexC]) {
          this.events.push({
            team: 'away',
            text: `${this.qtr[1]
                      .awayPlayers[k]
                      .first} ${this.qtr[1]
                      .awayPlayers[k]
                      .last} was subbed on`
          });
          this.qtr[1]
              .awayPlayers[this.qtrDeadInjArray.away[needReplaceIndexC]] =
              this.qtr[1].awayPlayers[k];
          this.qtr[2]
              .awayPlayers[this.qtrDeadInjArray.away[needReplaceIndexC]] =
              this.qtr[2].awayPlayers[k];
          this.qtr[3]
              .awayPlayers[this.qtrDeadInjArray.away[needReplaceIndexC]] =
              this.qtr[3].awayPlayers[k];
          this.qtr[4]
              .awayPlayers[this.qtrDeadInjArray.away[needReplaceIndexC]] =
              this.qtr[4].awayPlayers[k];
          this.qtr[1].awayPlayers[k] =
              this.qtrDeadInjArray.away[needReplaceIndexC] = null;
        }
      }
    }
    this.qtrDeadInjArray = {home: [], away: []};
  }
}
